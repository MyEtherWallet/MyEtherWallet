import { ref, watchEffect, onUnmounted, type Ref } from 'vue'
import { perpsClient, PERPS_PAGE_SIZE } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import { usePerpsMarkets } from './usePerpsMarkets'
import { usePerpsToasts } from './usePerpsToasts'
import { useCursorPaginate } from './useCursorPaginate'
import { perpsWs } from '../sdk/ws'
import type {
  ApiOrder,
  ApiFill,
  WalletDeposit,
  WalletWithdrawal,
} from '../sdk/types'

export type OrdersStatusFilter = 'all' | 'pending'

let _ordersWsSubscribed = false
let _ordersWsUnsubscribe: (() => void) | null = null

type OrderSnapshot = Pick<
  ApiOrder,
  'orderId' | 'filledSize' | 'filledCost' | 'size' | 'status'
>

export function usePerpsOrders(statusFilter?: Ref<OrdersStatusFilter>) {
  const { token, refreshKey } = usePerpsAuth()
  const { markets } = usePerpsMarkets()
  const perpsToasts = usePerpsToasts()
  const filter = statusFilter ?? ref<OrdersStatusFilter>('all')
  // The Pending sub-tab paginates over only open orders so empty middle pages
  // can't appear. The API's status filter only accepts 'open' | 'canceled' |
  // 'fullyfilled', so 'untriggered' (stop orders) and the transient 'pending'
  // state aren't shown under the Pending filter — acceptable trade-off.
  const pagination = useCursorPaginate<ApiOrder>(
    opts =>
      perpsClient.getOrders({
        ...opts,
        status: filter.value === 'pending' ? 'open' : undefined,
      }),
    PERPS_PAGE_SIZE,
  )
  // Snapshot keyed by orderId — used to diff filledSize between polls so we
  // can fire Order Filled / Order Partially Filled exactly on the transition.
  // First poll after login seeds the snapshot without firing toasts to avoid
  // re-announcing orders that already had fills before the user opened the page.
  // With cursor pagination, fill detection only runs while the user is on
  // page 0; fills on orders that have scrolled past page 0 won't toast — same
  // trade-off the Fills tab already accepts.
  let prevOrdersById = new Map<string, OrderSnapshot>()
  let isSeedFetch = true
  let lastToken: string | null | undefined = undefined
  let pollTimer: ReturnType<typeof setInterval> | null = null
  let isRefreshing = false

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

  async function refreshFirstPageIfActive() {
    if (isRefreshing) return
    if (pagination.loading.value) return
    if (pagination.currentPage.value !== 0) return
    isRefreshing = true
    try {
      const ok = await pagination.refetch()
      if (ok && pagination.currentPage.value === 0) {
        detectFillsAndToast(pagination.items.value)
      }
    } finally {
      isRefreshing = false
    }
  }

  let lastFilter: OrdersStatusFilter | null = null
  watchEffect(() => {
    void refreshKey.value
    void filter.value
    if (pollTimer) clearInterval(pollTimer)
    // Reset diff state only on actual auth changes. triggerRefresh() bumps
    // refreshKey for any post-mutation refetch (place/cancel/close) and must
    // not silently re-seed the snapshot — otherwise the next poll's fills
    // would be swallowed instead of toasted. Filter changes also re-seed since
    // the result set differs and stale snapshots would generate false diffs.
    if (token.value !== lastToken || filter.value !== lastFilter) {
      prevOrdersById = new Map()
      isSeedFetch = true
      lastToken = token.value
      lastFilter = filter.value
    }
    pagination.reset()
    if (token.value) {
      void (async () => {
        const ok = await pagination.refetch()
        if (ok) detectFillsAndToast(pagination.items.value)
      })()
      pollTimer = setInterval(refreshFirstPageIfActive, 60_000)
    } else {
      pollTimer = null
    }
  })

  if (!_ordersWsSubscribed) {
    _ordersWsSubscribed = true
    _ordersWsUnsubscribe = perpsWs.subscribe('ordersPerps', {}, (data: unknown) => {
      if (!token.value) return
      if (!data || typeof data !== 'object') return
      const next = data as ApiOrder
      if (!next.orderId) return
      if (pagination.currentPage.value !== 0) return
      const items = pagination.items.value
      const idx = items.findIndex(o => o.orderId === next.orderId)
      if (idx >= 0) {
        pagination.items.value = [
          ...items.slice(0, idx),
          { ...items[idx], ...next },
          ...items.slice(idx + 1),
        ]
      } else {
        pagination.items.value = [next, ...items].slice(0, PERPS_PAGE_SIZE)
      }
      detectFillsAndToast([next])
    })
  }

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

  return {
    orders: pagination.items,
    loading: pagination.loading,
    refetch: pagination.refetch,
    currentPage: pagination.currentPage,
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev,
    nextPage: pagination.nextPage,
    prevPage: pagination.prevPage,
  }
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
