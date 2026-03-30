import { ref } from 'vue'
import { BUILDER_CODE, perpsClient } from '../configs'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import type { PerpsBalance } from '../sdk/types'

const STORAGE_KEY_TOKEN = 'perps_auth_token'
const STORAGE_KEY_ACCOUNT = 'perps_auth_account'

const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN)
const savedAccount = localStorage.getItem(STORAGE_KEY_ACCOUNT)

const token = ref<string | null>(savedToken)
const accountId = ref<string | null>(savedAccount)
const isAuthenticating = ref(false)
const authError = ref<string | null>(null)
const refreshKey = ref(0)

if (savedToken) {
  perpsClient.setToken(savedToken)
}

function clearAuth() {
  token.value = null
  accountId.value = null
  perpsClient.setToken(null)
  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(STORAGE_KEY_ACCOUNT)
}

perpsClient.setOnUnauthorized(() => {
  clearAuth()
})

export function usePerpsAuth() {
  const store = useWalletStore()
  const { wallet, isWalletConnected } = storeToRefs(store)

  async function login() {
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
      localStorage.setItem(STORAGE_KEY_TOKEN, token.value)
      localStorage.setItem(STORAGE_KEY_ACCOUNT, accountId.value)

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

    function poll() {
      if (token.value) {
        fetchBalance()
      } else {
        balance.value = null
      }
    }

    poll()
    setInterval(poll, 5_000)

    let lastRefreshKey = refreshKey.value
    setInterval(() => {
      if (refreshKey.value !== lastRefreshKey) {
        lastRefreshKey = refreshKey.value
        poll()
      }
    }, 500)

    _sharedFetchBalance = fetchBalance
  }

  return { balance, loading, refetch: _sharedFetchBalance! }
}
