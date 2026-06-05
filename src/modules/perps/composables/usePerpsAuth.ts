import { ref, watch, effectScope } from 'vue'
import { BUILDER_CODE, perpsClient } from '../configs'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import type { PerpsBalance, PortfolioSummary } from '../sdk/types'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import { decrypt, encrypt } from '@/utils/crypto'
import { perpsWs } from '../sdk/ws'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'

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

let _authRestored = false
let _currentAddress: string | null = null

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

  if (!_authRestored) {
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

  async function login() {
    if (_authRestored) return;
    if (!wallet.value || !isWalletConnected.value) {
      authError.value = 'Wallet not connected'
      return
    }
    isAuthenticating.value = true
    authError.value = null
    try {
      const address = await wallet.value.getAddress()
      const challenge = await perpsClient.getLoginChallenge({
        walletAddress: address,
        chainId: '1',
      })
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
    } catch (e) {
      authError.value = e instanceof Error ? e.message : 'Authentication failed'
    } finally {
      isAuthenticating.value = false
    }
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
