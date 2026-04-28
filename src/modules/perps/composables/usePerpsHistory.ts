import { ref, watchEffect, onUnmounted } from 'vue'
import { perpsClient, PERPS_PAGE_SIZE } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import { useCursorPaginate } from './useCursorPaginate'
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
  const pagination = useCursorPaginate<ApiFill>(
    opts => perpsClient.getFills(opts),
    PERPS_PAGE_SIZE,
  )
  let pollTimer: ReturnType<typeof setInterval> | null = null

  async function refreshFirstPageIfActive() {
    if (pagination.currentPage.value === 0) {
      await pagination.refetch()
    }
  }

  watchEffect(() => {
    void refreshKey.value
    if (pollTimer) clearInterval(pollTimer)
    if (token.value) {
      pagination.refetch()
      pollTimer = setInterval(refreshFirstPageIfActive, 10_000)
    } else {
      pagination.reset()
      pollTimer = null
    }
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

  return {
    fills: pagination.items,
    loading: pagination.loading,
    refetch: pagination.refetch,
    currentPage: pagination.currentPage,
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev,
    nextPage: pagination.nextPage,
    prevPage: pagination.prevPage,
  }
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
