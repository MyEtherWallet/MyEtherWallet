import { ref, watchEffect, onUnmounted } from 'vue'
import { perpsClient } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import type {
  ApiOrder,
  ApiFill,
  WalletDeposit,
  WalletWithdrawal,
} from '../sdk/types'

export function usePerpsOrders() {
  const { token, refreshKey } = usePerpsAuth()
  const orders = ref<ApiOrder[]>([])
  const loading = ref(false)
  let pollTimer: ReturnType<typeof setInterval> | null = null

  async function fetchOrders() {
    if (!token.value) {
      orders.value = []
      return
    }
    loading.value = true
    try {
      const res = await perpsClient.getOrders({ limit: 100 })
      orders.value = res.result ?? []
    } catch {
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    void refreshKey.value
    if (pollTimer) clearInterval(pollTimer)
    if (token.value) {
      fetchOrders()
      pollTimer = setInterval(fetchOrders, 10_000)
    } else {
      orders.value = []
      pollTimer = null
    }
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

  return { orders, loading, refetch: fetchOrders }
}

export function usePerpsFills() {
  const { token, refreshKey } = usePerpsAuth()
  const fills = ref<ApiFill[]>([])
  const loading = ref(false)
  let pollTimer: ReturnType<typeof setInterval> | null = null

  async function fetchFills() {
    if (!token.value) {
      fills.value = []
      return
    }
    loading.value = true
    try {
      const res = await perpsClient.getFills({ limit: 100 })
      fills.value = res.result ?? []
    } catch {
      fills.value = []
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    void refreshKey.value
    if (pollTimer) clearInterval(pollTimer)
    if (token.value) {
      fetchFills()
      pollTimer = setInterval(fetchFills, 10_000)
    } else {
      fills.value = []
      pollTimer = null
    }
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

  return { fills, loading, refetch: fetchFills }
}

export function usePerpsDepositsWithdrawals() {
  const { token, refreshKey } = usePerpsAuth()
  const deposits = ref<WalletDeposit[]>([])
  const withdrawals = ref<WalletWithdrawal[]>([])
  const loading = ref(false)
  let pollTimer: ReturnType<typeof setInterval> | null = null

  async function fetchAll() {
    if (!token.value) {
      deposits.value = []
      withdrawals.value = []
      return
    }
    loading.value = true
    try {
      const [dRes, wRes] = await Promise.all([
        perpsClient.getDeposits(),
        perpsClient.getWithdrawals(),
      ])
      deposits.value = dRes.result ?? []
      withdrawals.value = wRes.result ?? []
    } catch {
      deposits.value = []
      withdrawals.value = []
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    void refreshKey.value
    if (pollTimer) clearInterval(pollTimer)
    if (token.value) {
      fetchAll()
      pollTimer = setInterval(fetchAll, 15_000)
    } else {
      deposits.value = []
      withdrawals.value = []
      pollTimer = null
    }
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

  return { deposits, withdrawals, loading, refetch: fetchAll }
}
