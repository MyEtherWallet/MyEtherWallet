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
import { analytics, PerpsSignInEvent, PerpsEventSource } from '@/analytics'
import { isUserRejectionError } from '@/utils/walletUtils'

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
// Detached scope so the walletAddress watcher survives the unmount of whichever
// component first called usePerpsAuth(). Without it the watcher is owned by that
// component's setup scope and Vue disposes it on unmount (route / side-panel
// change) — after which the `_walletWatcherRegistered` guard permanently blocks
// re-registration, so a later address switch A→B never resets the token and the
// UI keeps serving account A's positions/balance/history.
const _walletWatcherScope = effectScope(true)

// Data composables (positions, balance, summary, portfolio graph) register a
// callback here so auth teardown — sign-out AND account switch — can wipe their
// singleton caches synchronously and directly, instead of depending on a
// per-composable `watch(token)` being alive at that moment. Showing a previous
// account's balances/positions is a correctness/trust bug, so the reset must not
// hinge on watcher liveness or on the WS pushing a fresh snapshot.
const _dataResetHandlers = new Set<() => void>()
export function onPerpsAuthReset(fn: () => void): () => void {
  _dataResetHandlers.add(fn)
  return () => {
    _dataResetHandlers.delete(fn)
  }
}
function resetPerpsData() {
  for (const fn of _dataResetHandlers) {
    try {
      fn()
    } catch {
      // a failing reset handler must not block the others
    }
  }
}

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
  resetPerpsData()
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
  // module, inside a detached effectScope so it outlives the caller component's
  // unmount (see `_walletWatcherScope` above). Re-registering after a sign-out
  // would race with `clearAuth()`'s localStorage filtering — the fresh
  // watcher's `immediate: true` fire would call `tryRestoreAuth` against the
  // unfiltered localStorage and re-hydrate the token we just cleared.
  if (!_walletWatcherRegistered) {
    _walletWatcherRegistered = true
    _walletWatcherScope.run(() => {
      watch(
        walletAddress,
        async address => {
          if (!address || address === _currentAddress) return
          _currentAddress = address
          token.value = null
          accountId.value = null
          perpsClient.setToken(null)
          perpsWs.logout()
          resetPerpsData()
          await tryRestoreAuth(address)
          if (token.value) refreshKey.value++
        },
        { immediate: true },
      )
    })
  }

  async function login(source?: PerpsEventSource) {
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
        builderCode: BUILDER_CODE
      })
      token.value = complete.result.token
      accountId.value = complete.result.accountId

      perpsClient.setToken(token.value)
      perpsWs.login(token.value)

      const storedTokens = getStoredArray(STORAGE_KEY_TOKEN)
      const storedAccId = getStoredArray(STORAGE_KEY_ACCOUNT)

      // Drop any existing entries for this address so re-login doesn't accumulate stale tokens.
      const filterResults = await Promise.all(
        storedTokens.map(async (eToken: string, i: number) => {
          try {
            await decrypt(eToken, address)
            return null
          } catch {
            return { token: eToken, account: storedAccId[i] ?? null }
          }
        }),
      )
      const kept = filterResults.filter(Boolean) as { token: string; account: string | null }[]

      const encryptedToken = await encrypt(token.value, address)
      const encryptedAcc = await encrypt(accountId.value, address)

      localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify([...kept.map(e => e.token), encryptedToken]))
      localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify([...kept.map(e => e.account), encryptedAcc]))

      await perpsClient.acceptAgreement({
        termsVersion: 1,
        privacyVersion: 1,
      })
      analytics.trackPerpsSignInEvent(PerpsSignInEvent.SUCCESS, { source })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Authentication failed'
      if (isUserRejectionError(e)) {
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

    onPerpsAuthReset(() => {
      balance.value = null
    })

    const perpsToasts = usePerpsToasts()
    // Detached scope so these singleton watchers survive the unmount of the
    // first component that calls usePerpsBalance() — otherwise they die on
    // route/panel change and, guarded by `_balanceInitialized`, never
    // re-register, so an account switch A→B stops clearing/refetching balance.
    effectScope(true).run(() => {
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

      perpsWs.subscribe<PerpsBalance>('balancePerps', (rows) => {
        if (rows.length === 0) return
        balance.value = rows[0]
      })

      watch(
        () => _sharedBalance.value?.underLiquidation,
        (current, previous) => {
          if (current === true && previous === false) {
            perpsToasts.toastLiquidationInitiated()
          }
        },
        { immediate: false },
      )
    })
  }

  return { balance, loading, refetch: _sharedFetchBalance! }
}

// Shared singleton state for portfolio summary
const _sharedSummary = ref<PortfolioSummary | null>(null)
const _sharedSummaryLoading = ref(false)
let _summaryInitialized = false
let _sharedFetchSummary: (() => Promise<void>) | null = null
const _summaryScope = effectScope(true)

export function usePerpsPortfolioSummary() {
  const { token, refreshKey } = usePerpsAuth()
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

    onPerpsAuthReset(() => {
      summary.value = null
    })

    // Detached scope so the watchers outlive the first caller's unmount (see
    // usePerpsBalance above). Without a token watcher the summary only
    // refreshed on the 5-minute interval, so after an account switch A→B it
    // kept showing account A's summary until the next tick.
    _summaryScope.run(() => {
      watch(
        token,
        (now, prev) => {
          if (prev && !now) summary.value = null
          if (now) void fetchSummary()
        },
        { immediate: true },
      )

      watch(refreshKey, () => {
        if (token.value) void fetchSummary()
      })
    })

    setInterval(poll, 300_000) // refresh every 5 minutes

    _sharedFetchSummary = fetchSummary
  }

  return { summary, loading, refetch: _sharedFetchSummary! }
}
