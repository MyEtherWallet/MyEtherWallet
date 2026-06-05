import { ref, watchEffect, onUnmounted, type Ref } from 'vue'
import { perpsClient, PERPS_PAGE_SIZE } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import { usePerpsMarkets } from './usePerpsMarkets'
import { usePerpsToasts } from './usePerpsToasts'
import { useCursorPaginate } from './useCursorPaginate'
import { perpsWs } from '../sdk/ws'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'
import type {
  ApiOrder,
  ApiFill,
  WalletDeposit,
  WalletWithdrawal,
} from '../sdk/types'

export type OrdersStatusFilter = 'all' | 'pending'

type OrderSnapshot = Pick<
  ApiOrder,
  'orderId' | 'filledSize' | 'filledCost' | 'size' | 'status'
>

export function usePerpsOrders(statusFilter?: Ref<OrdersStatusFilter>) {
  ensurePerpsWsLifecycle()
  const { token, refreshKey } = usePerpsAuth()
  const { markets } = usePerpsMarkets()
  const perpsToasts = usePerpsToasts()
  const filter = statusFilter ?? ref<OrdersStatusFilter>('all')
  const pagination = useCursorPaginate<ApiOrder>(
    opts =>
      perpsClient.getOrders({
        ...opts,
        status: filter.value === 'pending' ? 'open' : undefined,
      }),
    PERPS_PAGE_SIZE,
  )
  let prevOrdersById = new Map<string, OrderSnapshot>()
  let isSeedFetch = true
  let lastToken: string | null | undefined = undefined
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

  const unsubscribeOrdersWs = perpsWs.subscribe<ApiOrder>('ordersPerps', () => {
    if (token.value) void refreshFirstPageIfActive()
  })

  let lastFilter: OrdersStatusFilter | null = null
  watchEffect(() => {
    void refreshKey.value
    void filter.value
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
    }
  })

  onUnmounted(() => {
    unsubscribeOrdersWs()
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
