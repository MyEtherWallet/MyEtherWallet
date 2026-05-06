import { ref, watchEffect, onUnmounted } from 'vue'
import { perpsClient, PERPS_PAGE_SIZE } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import { usePerpsMarkets } from './usePerpsMarkets'
import { usePerpsToasts } from './usePerpsToasts'
import { useCursorPaginate } from './useCursorPaginate'
import type {
  ApiOrder,
  ApiFill,
  WalletDeposit,
  WalletWithdrawal,
} from '../sdk/types'

type OrderSnapshot = Pick<
  ApiOrder,
  'orderId' | 'filledSize' | 'filledCost' | 'size' | 'status'
>

export function usePerpsOrders() {
  const { token, refreshKey } = usePerpsAuth()
  const { markets } = usePerpsMarkets()
  const perpsToasts = usePerpsToasts()
  const orders = ref<ApiOrder[]>([])
  const loading = ref(false)
  // True when the server signals more orders beyond the fetched window via
  // pageInfo.nextCursor. Lets callers distinguish "exactly N orders" from
  // "N orders fetched and more exist" without guessing from list length.
  const hasMore = ref(false)
  // Snapshot keyed by orderId — used to diff filledSize between polls so we
  // can fire Order Filled / Order Partially Filled exactly on the transition.
  // First poll after login seeds the snapshot without firing toasts to avoid
  // re-announcing orders that already had fills before the user opened the page.
  let prevOrdersById = new Map<string, OrderSnapshot>()
  let isSeedFetch = true
  let lastToken: string | null | undefined = undefined
  // Monotonic sequence so an out-of-order in-flight response doesn't roll the
  // diff snapshot backward and replay or drop fill toasts.
  let fetchSeq = 0
  let pollTimer: ReturnType<typeof setInterval> | null = null

  function resolveDisplayMarket(market: string): string {
    const m = markets.value.find(x => x.market === market)
    return m?.longName ?? m?.displayName ?? market
  }

  function detectFillsAndToast(next: ApiOrder[]) {
    if (isSeedFetch) {
      isSeedFetch = false
      prevOrdersById = new Map(
        next.map(o => [
          o.orderId,
          {
            orderId: o.orderId,
            filledSize: o.filledSize,
            filledCost: o.filledCost,
            size: o.size,
            status: o.status,
          },
        ]),
      )
      return
    }
    for (const curr of next) {
      const prev = prevOrdersById.get(curr.orderId)
      const prevFilled = prev ? Number(prev.filledSize || '0') : 0
      const currFilled = Number(curr.filledSize || '0')
      if (currFilled > prevFilled) {
        const prevCost = prev ? Number(prev.filledCost || '0') : 0
        const currCost = Number(curr.filledCost || '0')
        const deltaSize = currFilled - prevFilled
        const deltaCost = currCost - prevCost
        const fillPrice = deltaSize > 0 ? deltaCost / deltaSize : 0
        const totalSize = Number(curr.size || '0')
        const isFullyFilled =
          curr.status === 'fullyfilled' ||
          (totalSize > 0 && currFilled >= totalSize)
        const args = {
          side: curr.side,
          filledSize: curr.filledSize,
          size: curr.size,
          category: curr.type,
          market: resolveDisplayMarket(curr.market),
          fillPrice,
        }
        if (isFullyFilled) perpsToasts.toastOrderFilled(args)
        else perpsToasts.toastOrderPartiallyFilled(args)
      }
    }
    prevOrdersById = new Map(
      next.map(o => [
        o.orderId,
        {
          orderId: o.orderId,
          filledSize: o.filledSize,
          filledCost: o.filledCost,
          size: o.size,
          status: o.status,
        },
      ]),
    )
  }

  async function fetchOrders() {
    if (!token.value) {
      orders.value = []
      return
    }
    const seq = ++fetchSeq
    loading.value = true
    try {
      const res = await perpsClient.getOrders({ limit: 100 })
      if (seq !== fetchSeq) return
      const next = res.result ?? []
      detectFillsAndToast(next)
      orders.value = next
      hasMore.value = !!res.pageInfo?.nextCursor
    } catch {
      if (seq !== fetchSeq) return
      orders.value = []
      hasMore.value = false
    } finally {
      if (seq === fetchSeq) loading.value = false
    }
  }

  watchEffect(() => {
    void refreshKey.value
    if (pollTimer) clearInterval(pollTimer)
    // Reset diff state only on actual auth changes. triggerRefresh() bumps
    // refreshKey for any post-mutation refetch (place/cancel/close) and must
    // not silently re-seed the snapshot — otherwise the next poll's fills
    // would be swallowed instead of toasted.
    if (token.value !== lastToken) {
      prevOrdersById = new Map()
      isSeedFetch = true
      lastToken = token.value
    }
    if (token.value) {
      fetchOrders()
      pollTimer = setInterval(fetchOrders, 10_000)
    } else {
      orders.value = []
      hasMore.value = false
      pollTimer = null
    }
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

  return { orders, loading, hasMore, refetch: fetchOrders }
}

export function usePerpsFills() {
  const { token, refreshKey } = usePerpsAuth()
  const pagination = useCursorPaginate<ApiFill>(
    opts => perpsClient.getFills(opts),
    PERPS_PAGE_SIZE,
  )
  let pollTimer: ReturnType<typeof setInterval> | null = null
  let isRefreshing = false

  async function refreshFirstPageIfActive() {
    if (isRefreshing) return
    if (pagination.loading.value) return
    if (pagination.currentPage.value !== 0) return
    isRefreshing = true
    try {
      await pagination.refetch()
    } finally {
      isRefreshing = false
    }
  }

  watchEffect(() => {
    void refreshKey.value
    if (pollTimer) clearInterval(pollTimer)
    // Reset before fetching so any in-flight request from the previous auth
    // context is invalidated and prior fills don't briefly remain visible
    // after a wallet switch / logout.
    pagination.reset()
    if (token.value) {
      pagination.refetch()
      pollTimer = setInterval(refreshFirstPageIfActive, 10_000)
    } else {
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
