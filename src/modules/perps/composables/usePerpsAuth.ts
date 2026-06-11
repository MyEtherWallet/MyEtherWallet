import { ref, watch, effectScope } from 'vue'
import { BUILDER_CODE, perpsClient } from '../configs'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import type { PerpsBalance, PortfolioSummary } from '../sdk/types'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import { decrypt, encrypt } from '@/utils/crypto'
import { WalletType } from '@/providers/types'
import { perpsWs } from '../sdk/ws'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'
import { analytics, PerpsSignInEvent } from '@/analytics'

const STORAGE_KEY_TOKEN = 'perps_auth_token'
const STORAGE_KEY_ACCOUNT = 'perps_auth_account'

function getStoredArray(key: string): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const token = ref<string | null>(null)
const accountId = ref<string | null>(null)
const isAuthenticating = ref(false)
const authError = ref<string | null>(null)
const refreshKey = ref(0)
const showSigningPrompt = ref(false)
const signingMessage = ref<string | null>(null)
const isHardwareWalletSigning = ref(false)
const isWaitingForConfirm = ref(false)

let _authRestored = false
let _currentAddress: string | null = null
let _resolveSign: (() => void) | null = null
let _rejectSign: ((reason?: unknown) => void) | null = null

function _waitForSignConfirmation(): Promise<void> {
  return new Promise((resolve, reject) => {
    _resolveSign = resolve
    _rejectSign = reject
  })
}
let _walletWatcherRegistered = false

async function tryRestoreAuth(address: string) {
  const storedTokens: string[] = getStoredArray(STORAGE_KEY_TOKEN)
  const storedAccounts: string[] = getStoredArray(STORAGE_KEY_ACCOUNT)
  for (let i = 0; i < storedTokens.length; i++) {
    try {
      const decryptedToken = await decrypt(storedTokens[i], address)
      token.value = decryptedToken
      perpsClient.setToken(decryptedToken)
      perpsWs.login(decryptedToken)
      _authRestored = true
      try {
        accountId.value = storedAccounts[i]
          ? await decrypt(storedAccounts[i], address)
          : null

      } catch {
        _authRestored = false
        accountId.value = null
      }
      break
    } catch {
      _authRestored = false
      // token belongs to a different address, try next
    }
  }
}

async function clearAuth() {
  const store = useWalletStore()
  const { wallet } = storeToRefs(store)
  token.value = null
  accountId.value = null
  perpsClient.setToken(null)
  perpsWs.logout()
  // Reset module-scope guards so a subsequent Sign In click is not silently
  // blocked by a stale auth-restored flag from a previous session.
  _authRestored = false
  _currentAddress = null
  isAuthenticating.value = false

  if (!wallet.value) return;
  const storedTokens = getStoredArray(STORAGE_KEY_TOKEN)
  const storedAccId = getStoredArray(STORAGE_KEY_ACCOUNT)

  const address = await wallet.value!.getAddress();
  const results = await Promise.all(
    storedTokens.map(async (eToken: string, i: number) => {
      try {
        await decrypt(eToken, address)
        return null
      } catch {
        return { token: eToken, account: storedAccId[i] ?? null }
      }
    }),
  )
  const kept = results.filter(Boolean) as { token: string; account: string | null }[]
  const filteredStoredTokens = kept.map(e => e.token)
  const filteredStoredAccounts = kept.map(e => e.account)

  localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(filteredStoredTokens))
  localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(filteredStoredAccounts))
}

perpsClient.setOnUnauthorized(() => {
  clearAuth()
})
perpsWs.setOnUnauthorized(() => {
  clearAuth()
})

export function usePerpsAuth() {
  const store = useWalletStore()
  const { wallet, isWalletConnected, walletAddress } = storeToRefs(store)

  // Register the walletAddress watcher exactly once for the lifetime of the
  // module. Re-registering after a sign-out would race with `clearAuth()`'s
  // localStorage filtering — the fresh watcher's `immediate: true` fire would
  // call `tryRestoreAuth` against the unfiltered localStorage and re-hydrate
  // the token we just cleared.
  if (!_walletWatcherRegistered) {
    _walletWatcherRegistered = true
    watch(
      walletAddress,
      async address => {
        if (!address || address === _currentAddress) return
        _currentAddress = address
        token.value = null
        accountId.value = null
        perpsClient.setToken(null)
        perpsWs.logout()
        await tryRestoreAuth(address)
        if (token.value) refreshKey.value++
      },
      { immediate: true },
    )
  }

  async function login(source?: string) {
    if (_authRestored || isAuthenticating.value || isWaitingForConfirm.value) return
    if (!wallet.value || !isWalletConnected.value) {
      authError.value = 'Wallet not connected'
      return
    }
    analytics.trackPerpsSignInEvent(PerpsSignInEvent.CLICKED, { source })
    isAuthenticating.value = true
    authError.value = null
    let walletTypeStr: string | undefined
    try {
      const address = await wallet.value.getAddress()
      const challenge = await perpsClient.getLoginChallenge({
        walletAddress: address,
        chainId: '1',
      })
      const walletType = wallet.value.getWalletType()
      walletTypeStr = walletType
      const isInjected = walletType === WalletType.WAGMI || walletType === WalletType.INJECTED

      if (!isInjected) {
        isHardwareWalletSigning.value = walletType === WalletType.LEDGER || walletType === WalletType.TREZOR
        signingMessage.value = challenge.result.message
        isWaitingForConfirm.value = true
        showSigningPrompt.value = true
        isAuthenticating.value = false

        await _waitForSignConfirmation()

        isWaitingForConfirm.value = false
        isAuthenticating.value = true
      }

      const signature = await wallet.value.SignMessage({
        message: challenge.result.message,
      })
      const complete = await perpsClient.completeLoginChallenge({
        id: challenge.result.id,
        signature,
        builderCode: BUILDER_CODE,
      })
      token.value = complete.result.token
      accountId.value = complete.result.accountId

      perpsClient.setToken(token.value)
      perpsWs.login(token.value)

      const storedTokens = getStoredArray(STORAGE_KEY_TOKEN)
      const storedAccId = getStoredArray(STORAGE_KEY_ACCOUNT)
      const encryptedToken = await encrypt(token.value, address)
      const encryptedAcc = await encrypt(accountId.value, address)

      storedTokens.push(encryptedToken)
      storedAccId.push(encryptedAcc)
      localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(storedTokens))
      localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(storedAccId))

      await perpsClient.acceptAgreement({
        termsVersion: 1,
        privacyVersion: 1,
      })
      analytics.trackPerpsSignInEvent(PerpsSignInEvent.SUCCESS, { source })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Authentication failed'
      if (errorMessage === 'cancelled') {
        analytics.trackPerpsSignInEvent(PerpsSignInEvent.CANCEL, { source })
      } else {
        authError.value = errorMessage
        analytics.trackPerpsSignInErrorEvent(PerpsSignInEvent.ERROR, {
          source,
          errorMessage,
          walletType: walletTypeStr,
        })
      }
    } finally {
      showSigningPrompt.value = false
      signingMessage.value = null
      isHardwareWalletSigning.value = false
      isWaitingForConfirm.value = false
      isAuthenticating.value = false
    }
  }

  function confirmSign() {
    _resolveSign?.()
    _resolveSign = null
    _rejectSign = null
  }

  function cancelSign() {
    _rejectSign?.(new Error('cancelled'))
    _resolveSign = null
    _rejectSign = null
  }

  function logout() {
    clearAuth()
  }

  function triggerRefresh() {
    refreshKey.value++
  }

  return {
    token,
    accountId,
    isAuthenticating,
    authError,
    isWalletConnected,
    login,
    logout,
    refreshKey,
    triggerRefresh,
    showSigningPrompt,
    signingMessage,
    isHardwareWalletSigning,
    isWaitingForConfirm,
    confirmSign,
    cancelSign,
  }
}

// Shared singleton state for balance polling
const _sharedBalance = ref<PerpsBalance | null>(null)
const _sharedBalanceLoading = ref(false)
let _balanceInitialized = false
let _sharedFetchBalance: (() => Promise<void>) | null = null

export function usePerpsBalance() {
  const { token, refreshKey } = usePerpsAuth()
  const balance = _sharedBalance
  const loading = _sharedBalanceLoading

  if (!_balanceInitialized) {
    _balanceInitialized = true
    ensurePerpsWsLifecycle()

    async function fetchBalance() {
      if (!token.value) {
        balance.value = null
        return
      }
      loading.value = true
      try {
        const res = await perpsClient.getPerpsBalance()
        balance.value = res.result
      } catch {
        balance.value = null
      } finally {
        loading.value = false
      }
    }

    _sharedFetchBalance = fetchBalance

    watch(
      token,
      (now, prev) => {
        if (prev && !now) {
          balance.value = null
        }
        if (now) void fetchBalance()
      },
      { immediate: true },
    )

    watch(refreshKey, () => {
      if (token.value) void fetchBalance()
    })

    effectScope(true).run(() => {
      perpsWs.subscribe<PerpsBalance>('balancePerps', (rows) => {
        if (rows.length === 0) return
        balance.value = rows[0]
      })
    })

    const perpsToasts = usePerpsToasts()
    watch(
      () => _sharedBalance.value?.underLiquidation,
      (current, previous) => {
        if (current === true && previous === false) {
          perpsToasts.toastLiquidationInitiated()
        }
      },
      { immediate: false },
    )
  }

  return { balance, loading, refetch: _sharedFetchBalance! }
}

// Shared singleton state for portfolio summary
const _sharedSummary = ref<PortfolioSummary | null>(null)
const _sharedSummaryLoading = ref(false)
let _summaryInitialized = false
let _sharedFetchSummary: (() => Promise<void>) | null = null

export function usePerpsPortfolioSummary() {
  const { token } = usePerpsAuth()
  const summary = _sharedSummary
  const loading = _sharedSummaryLoading

  if (!_summaryInitialized) {
    _summaryInitialized = true

    async function fetchSummary() {
      if (!token.value) {
        summary.value = null
        return
      }
      loading.value = true
      try {
        const res = await perpsClient.getPortfolioSummary()
        summary.value = res.result
      } catch {
        summary.value = null
      } finally {
        loading.value = false
      }
    }

    function poll() {
      if (token.value) {
        fetchSummary()
      } else {
        summary.value = null
      }
    }

    poll()
    setInterval(poll, 300_000) // refresh every 5 minutes

    _sharedFetchSummary = fetchSummary
  }

  return { summary, loading, refetch: _sharedFetchSummary! }
}
