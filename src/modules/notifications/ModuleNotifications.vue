<template>
  <div class="space-y-3">
    <!-- Category Filter -->
    <app-btn-group
      v-model:selected="selectedCategory"
      :btn-list="categories"
      size="xs"
      class="mb-5"
    >
      <template #btn-content="{ data }">
        {{ data.label }}
      </template>
    </app-btn-group>

    <div
      v-for="(item, index) in filteredNotifications"
      :key="item.hash"
      class="relative"
    >
      <!-- Transaction Notification -->
      <transaction-container
        v-if="isTransaction(item)"
        :transaction="item"
        @remove="removeNotification"
      />

      <!-- Swap Notification -->
      <swap-container
        v-else-if="isSwap(item)"
        :swap="item"
        @remove="removeNotification"
      />

      <!-- Bridge Notification -->
      <bridge-container
        v-else-if="isBridge(item)"
        :bridge="item"
        @remove="removeNotification"
      />

      <!-- Trade Order Notification -->
      <trade-order-container
        v-else
        :order="item as SavedTradeOrder"
        :remaining-time="
          getOrderWithRemainingTime(item as SavedTradeOrder).remainingTime
        "
        @remove="removeNotification"
      />
      <div
        v-if="item.seen === false"
        class="absolute top-0 left-0 -translate-x-1/2 -translate-y-[70%] rounded-full bg-primary w-2 h-2"
      ></div>
      <hr
        v-if="index < filteredNotifications.length - 1"
        class="border-t border-grey-10 mt-4"
      />
    </div>
    <empty-container v-if="!filteredNotifications.length" :text="emptyText" />
    <div class="flex justify-center">
      <app-btn-text
        v-if="notificationsCount > 1"
        @click="deleteAllNotifications"
        class="text-primary text-s-14"
      >
        Delete all
      </app-btn-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue'
//Components
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import TransactionContainer from './components/TransactionContainer.vue'
import TradeOrderContainer from './components/TradeOrderContainer.vue'
import SwapContainer from './components/SwapContainer.vue'
import BridgeContainer from './components/BridgeContainer.vue'
import EmptyContainer from './components/EmptyContainer.vue'
import AppBtnText from '@/components/AppBtnText.vue'

//Helpers
import type { OrderStatusOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'
import { formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { ToastType } from '@/types/notification'
import Configs from '@/configs'
import { captureException } from '@sentry/vue'

// Stores
import { storeToRefs } from 'pinia'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
  type NotificationItem,
  type SwapNotification,
  type BridgeNotification,
  type TransactionNotification,
  isTransactionNotification,
  isSwapNotification,
  isBridgeNotification,
} from '@/stores/tradeOrdersStore'
import { useWalletStore } from '@/stores/walletStore'
import { useToastStore } from '@/stores/toastStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { useStocksStore } from '@/stores/stocksStore'
import { useRewardsStore } from '@/stores/rewardsStore'
import useBalanceHandler from '@/utils/balanceHandler'
import type { TokenBalancesRaw } from '@/mew_api/types'
import {
  analytics,
  SwapEventStatus,
  SendEventStatus,
  TradeEventStatus,
  type TradeEventStatusPayload,
} from '@/analytics'

const appLayoutStore = useAppLayoutStore()
const stocksStore = useStocksStore()
const { isNotificationsOpen } = storeToRefs(appLayoutStore)
// Extended TradeOrder with runtime-only remainingTime
interface TradeOrder extends SavedTradeOrder {
  remainingTime: number
}

// Category filter types
interface CategoryOption {
  value: 'all' | 'trade' | 'txs' | 'swap' | 'bridge'
  label: string
}

const categories: CategoryOption[] = [
  { value: 'all', label: 'All' },
  { value: 'trade', label: 'Trades' },
  { value: 'txs', label: 'Transactions' },
  { value: 'swap', label: 'Swaps' },
  { value: 'bridge', label: 'Bridge' },
]

const selectedCategory = ref<CategoryOption>(categories[0])

const emptyText = computed<string | undefined>(() => {
  const category = selectedCategory.value.value
  switch (category) {
    case 'trade':
      return 'Your stock trade orders will appear here.'
    case 'txs':
      return 'Your send transactions will appear here.'
    case 'bridge':
      return 'Your token bridges will appear here.'
    case 'swap':
      return 'Your token swaps will appear here.'
    default:
      return undefined
  }
})

// Store and wallet
const tradeOrdersStore = useTradeOrdersStore()
const walletStore = useWalletStore()
const toastStore = useToastStore()
const { walletAddress, wallet } = storeToRefs(walletStore)
const { setTokens, setIsLoadingBalances } = walletStore

// Get notifications count based on selected category
const notificationsCount = computed(() => {
  return filteredNotifications.value.length
})

// Clear all notifications via child component
const deleteAllNotifications = () => {
  if (!walletAddress.value) return
  switch (selectedCategory.value.value) {
    case 'trade':
      // Stop polling for trade orders
      Object.keys(pollIntervals).forEach(stopPolling)
      Object.keys(remainingTimes.value).forEach(hash => {
        delete remainingTimes.value[hash]
      })
      stopCountdown()
      tradeOrdersStore.clearOrdersForAddress(walletAddress.value)
      break
    case 'txs':
      // Stop polling for transactions
      tradeOrdersStore
        .getTransactionsByAddress(walletAddress.value)
        .forEach(tx => {
          stopStatusPolling(tx.hash)
        })
      tradeOrdersStore.clearTransactionsForAddress(walletAddress.value)
      break
    case 'swap':
      // Stop polling for swaps
      tradeOrdersStore.getSwapsByAddress(walletAddress.value).forEach(swap => {
        stopStatusPolling(swap.hash)
      })
      tradeOrdersStore.clearSwapsForAddress(walletAddress.value)
      break
    case 'bridge':
      // Stop polling for bridges
      tradeOrdersStore
        .getBridgesByAddress(walletAddress.value)
        .forEach(bridge => {
          stopStatusPolling(bridge.hash)
        })
      tradeOrdersStore.clearBridgesForAddress(walletAddress.value)
      break
    default:
      // Stop all polling
      Object.keys(pollIntervals).forEach(stopPolling)
      Object.keys(statusPollIntervals).forEach(stopStatusPolling)
      remainingTimes.value = {}
      stopCountdown()
      tradeOrdersStore.clearAllNotificationsForAddress(walletAddress.value)
  }
}
// Fetch balances after status changes
const fetchBalances = () => {
  setIsLoadingBalances(true)
  wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
    useBalanceHandler(balances, setTokens, setIsLoadingBalances)
  })
}

// Runtime state (not persisted)
const remainingTimes = ref<Record<string, number>>({})
const pollIntervals: Record<string, number> = {}
const statusPollIntervals: Record<string, number> = {}
let countdownInterval: number | null = null

// Get all notifications (trade orders + transactions) sorted by time
const notifications = computed<NotificationItem[]>(() => {
  if (!walletAddress.value) return []
  return tradeOrdersStore.getAllNotifications(walletAddress.value)
})

// Filter notifications based on selected category
const filteredNotifications = computed<NotificationItem[]>(() => {
  if (selectedCategory.value.value === 'all') {
    return notifications.value
  }
  if (selectedCategory.value.value === 'txs') {
    return notifications.value.filter(item => isTransactionNotification(item))
  }
  if (selectedCategory.value.value === 'trade') {
    return notifications.value.filter(
      item =>
        !isTransactionNotification(item) &&
        !isSwapNotification(item) &&
        !isBridgeNotification(item),
    )
  }
  if (selectedCategory.value.value === 'swap') {
    return notifications.value.filter(item => isSwapNotification(item))
  }
  if (selectedCategory.value.value === 'bridge') {
    return notifications.value.filter(item => isBridgeNotification(item))
  }
  return notifications.value
})

// Get orders for current wallet address with runtime remainingTime
const orders = computed<TradeOrder[]>(() => {
  if (!walletAddress.value) return []
  const savedOrders = tradeOrdersStore.getOrdersByAddress(walletAddress.value)
  return savedOrders.map(order => ({
    ...order,
    remainingTime: remainingTimes.value[order.hash] ?? order.duration,
  }))
})

// Helper to get order with remaining time
const getOrderWithRemainingTime = (order: SavedTradeOrder): TradeOrder => ({
  ...order,
  remainingTime: remainingTimes.value[order.hash] ?? order.duration,
})

// Type guards for notifications
const isTransaction = isTransactionNotification
const isSwap = isSwapNotification
const isBridge = isBridgeNotification

// Start countdown timer
const startCountdown = () => {
  if (countdownInterval) return
  countdownInterval = window.setInterval(() => {
    orders.value.forEach(order => {
      if (
        order.status === 'pending' &&
        (remainingTimes.value[order.hash] ?? order.duration) > 0
      ) {
        remainingTimes.value[order.hash] = Math.max(
          0,
          (remainingTimes.value[order.hash] ?? order.duration) - 1,
        )
      }
    })
  }, 1000)
}

// Stop countdown timer
const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Update order status
const updateOrderStatus = (hash: string, status: OrderStatusOutputType) => {
  if (!walletAddress.value) return

  const order = orders.value.find(o => o.hash === hash)
  if (!order) return

  const updates: Partial<SavedTradeOrder> = {
    status: status.status,
    fills: status.fills,
  }
  const analyticsPayload: TradeEventStatusPayload = {
    orderHash: hash,
    fromAmount: order.fromAmount,
    toAmount: order.expectedToAmount,
    fromToken: order.fromSymbol,
    toToken: order.toSymbol,
    network: order.chainName,
    tradePair: `${order.fromSymbol}-${order.toSymbol}`,
    expectedToAmount: order.expectedToAmount,
    txHash: status.fills.length > 0 ? status.fills[0].txHash : '',
    finalToAmount: order.finalToAmount,
    percentageDiff: order.percentageDiff,
  }

  if (status.status === 'filled' && status.finalToAmount) {
    analytics.trackTradeEventStatus(TradeEventStatus.SUCCESS, analyticsPayload)
    const finalAmount = formatFloatingPointValue(
      formatUnits(status.finalToAmount, order.toDecimals),
    ).value
    updates.finalToAmount = finalAmount

    // Calculate percentage difference
    const expected = parseFloat(order.expectedToAmount)
    const actual = parseFloat(finalAmount)
    if (expected > 0) {
      updates.percentageDiff = ((actual - expected) / expected) * 100
    }

    // Mark as unseen when status changes to filled (important update)
    updates.seen = false

    // Stop polling for this order
    stopPolling(hash)
    if (!isNotificationsOpen.value) {
      // Show success toast with trade info
      toastStore.addToastMessage({
        type: ToastType.Success,
        text: 'Trade Order Filled',
        duration: 10000,
        tradeInfo: {
          fromToken: order.fromSymbol,
          fromtTokenIcon: order.fromTokenIcon || '',
          fromTokenIsStock: stocksStore.isStock(
            order.fromTokenAddress || '',
            order.chainName,
          ),
          fromAmount: formatFloatingPointValue(order.fromAmount).value,
          toToken: order.toSymbol,
          toTokenIcon: order.toTokenIcon || '',
          toTokenIsStock: stocksStore.isStock(
            order.toTokenAddress || '',
            order.chainName,
          ),
          toAmount: formatFloatingPointValue(finalAmount).value,
        },
      })
    }

    // Refresh balances after trade order is filled
    fetchBalances()
  }

  if (status.status === 'cancelled' || status.status === 'expired') {
    // Mark as unseen when status changes
    updates.seen = false
    stopPolling(hash)
    const rewardsStore = useRewardsStore()
    if (rewardsStore.earnedPotentialReward) {
      rewardsStore.setEarnedPotentialReward(false)
    }
    const event =
      status.status === 'cancelled'
        ? TradeEventStatus.CANCELLED
        : TradeEventStatus.EXPIRED
    analytics.trackTradeEventStatus(event, analyticsPayload)
    // Show error toast with trade info
    if (!isNotificationsOpen.value) {
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: `Trade Order ${status.status === 'cancelled' ? 'Cancelled' : 'Expired'}`,
        duration: 10000,
        tradeInfo: {
          fromToken: order.fromSymbol,
          fromtTokenIcon: order.fromTokenIcon || '',
          fromTokenIsStock: stocksStore.isStock(
            order.fromTokenAddress || '',
            order.chainName,
          ),
          fromAmount: formatFloatingPointValue(order.fromAmount).value,
          toToken: order.toSymbol,
          toTokenIcon: order.toTokenIcon || '',
          toTokenIsStock: stocksStore.isStock(
            order.toTokenAddress || '',
            order.chainName,
          ),
          toAmount: formatFloatingPointValue(order.expectedToAmount).value,
        },
      })
    }
  }

  tradeOrdersStore.updateOrder(walletAddress.value, hash, updates)
}

// Start polling for order status
const startPolling = async (hash: string, chainId: number) => {
  if (pollIntervals[hash]) return

  // Set a placeholder immediately to prevent duplicate calls during async operation
  pollIntervals[hash] = -1

  const pollStatus = async () => {
    try {
      const { default: OneInchFusion } =
        await import('@/modules/trade/providers/oneinch_fusion/oneInchFusion')
      const fusion = new OneInchFusion(null as any, chainId)
      const status = await fusion.getOrderStatus(hash)
      updateOrderStatus(hash, status)
    } catch (e) {
      captureException(e)
    }
  }

  // Initial poll
  await pollStatus()

  // Poll every 5 seconds (replace placeholder with actual interval)
  // Only set interval if the order is still pending (might have been filled/expired during initial poll)
  if (pollIntervals[hash] === -1) {
    pollIntervals[hash] = window.setInterval(pollStatus, 5000)
  }
}

// Stop polling for a specific order
const stopPolling = (hash: string) => {
  if (pollIntervals[hash]) {
    clearInterval(pollIntervals[hash])
    delete pollIntervals[hash]
  }
}

// Remove a notification (order or transaction)
const removeNotification = (hash: string) => {
  if (!walletAddress.value) return

  stopPolling(hash)
  stopStatusPolling(hash)
  delete remainingTimes.value[hash]
  tradeOrdersStore.removeNotification(walletAddress.value, hash)

  if (orders.value.length === 0) {
    stopCountdown()
  }
}

// Helper to start polling for all pending orders
const startPollingForPendingOrders = (address: string) => {
  const pendingOrders = tradeOrdersStore.getPendingOrders(address)
  if (pendingOrders.length > 0) {
    pendingOrders.forEach(order => {
      // Calculate remaining time based on creation time and duration
      const elapsed = Math.floor(Date.now() / 1000) - order.createdAt
      const remaining = Math.max(0, order.duration - elapsed)
      remainingTimes.value[order.hash] = remaining

      // Only start polling if not already polling this order
      if (!pollIntervals[order.hash]) {
        startPolling(order.hash, order.chainId)
      }
    })
    startCountdown()
  }
}

// Status polling API

// Notification type for status polling
type StatusNotificationType = 'transaction' | 'swap' | 'bridge'

// Update status based on notification type
const updateNotificationStatus = (
  hash: string,
  type: StatusNotificationType,
  apiStatus: { status: string },
) => {
  if (!walletAddress.value) return
  const _status = apiStatus.status.toLowerCase()
  let newStatus: 'sent' | 'confirmed' | 'failed' = 'sent'

  if (_status === 'confirmed' || _status === 'success') {
    newStatus = 'confirmed'
  } else if (_status === 'fail') {
    newStatus = 'failed'
  }
  // Only refresh balances if status actually changed from 'sent'
  const shouldRefreshBalances = newStatus !== 'sent'
  if (!shouldRefreshBalances) return
  if (type === 'transaction') {
    const txs = tradeOrdersStore.getTransactionsByAddress(walletAddress.value)
    const tx = txs.find(t => t.hash === hash)
    if (!tx) return

    tradeOrdersStore.updateTransaction(walletAddress.value, hash, {
      status: newStatus,
      seen: false,
    })
    stopStatusPolling(hash)
    if (newStatus === 'confirmed' || newStatus === 'failed') {
      const event =
        newStatus === 'confirmed'
          ? SendEventStatus.SUCCESS
          : SendEventStatus.FAILED
      analytics.trackSendEventStatus(event, {
        hash: hash,
        token: tx.symbol,
      })
    }

    if (!isNotificationsOpen.value) {
      // Show toast for transaction status update
      toastStore.addToastMessage({
        type: newStatus === 'confirmed' ? ToastType.Success : ToastType.Error,
        text: `Transaction ${newStatus === 'confirmed' ? 'Successful' : 'Failed'}`,
        duration: 10000,
      })
    }
  } else if (type === 'swap') {
    const swaps = tradeOrdersStore.getSwapsByAddress(walletAddress.value)
    const swap = swaps.find(s => s.hash === hash)
    if (!swap) return
    tradeOrdersStore.updateSwap(walletAddress.value, hash, {
      status: newStatus,
      seen: false,
    })
    stopStatusPolling(hash)
    if (newStatus !== 'confirmed') {
      const rewardsStore = useRewardsStore()
      if (rewardsStore.earnedPotentialReward) {
        rewardsStore.setEarnedPotentialReward(false)
      }
    }
    if (newStatus === 'confirmed' || newStatus === 'failed') {
      const event =
        newStatus === 'confirmed'
          ? SwapEventStatus.SUCCESS
          : SwapEventStatus.FAILED
      analytics.trackSwapEventStatus(event, {
        hash: hash,
        fromAmount: swap.fromAmount,
        toAmount: swap.toAmount,
        fromToken: swap.fromSymbol,
        toToken: swap.toSymbol,
        fromNetwork: swap.fromChainName,
        toNetwork: swap.fromChainName,
        isBridge: false,
        swapPair: `${swap.fromSymbol}-${swap.toSymbol}`,
      })
    }

    if (!isNotificationsOpen.value) {
      // Show toast for swap status update
      toastStore.addToastMessage({
        type: newStatus === 'confirmed' ? ToastType.Success : ToastType.Error,
        text: `Swap ${newStatus === 'confirmed' ? 'Successful' : 'Failed'}`,
        duration: 10000,
        tradeInfo: {
          fromToken: swap.fromSymbol,
          fromtTokenIcon: swap.fromTokenIcon || '',
          fromTokenIsStock: stocksStore.isStock(
            swap.fromTokenAddress || '',
            swap.fromChainName,
          ),
          fromAmount: formatFloatingPointValue(swap.fromAmount).value,
          toToken: swap.toSymbol,
          toTokenIcon: swap.toTokenIcon || '',
          toTokenIsStock: stocksStore.isStock(
            swap.toTokenAddress || '',
            swap.fromChainName,
          ),
          toAmount: formatFloatingPointValue(swap.toAmount).value,
        },
      })
    }
  } else if (type === 'bridge') {
    const bridges = tradeOrdersStore.getBridgesByAddress(walletAddress.value)
    const bridge = bridges.find(b => b.hash === hash)
    if (!bridge) return

    tradeOrdersStore.updateBridge(walletAddress.value, hash, {
      status: newStatus,
      seen: false,
    })
    stopStatusPolling(hash)
    if (newStatus === 'confirmed' || newStatus === 'failed') {
      const event =
        newStatus === 'confirmed'
          ? SwapEventStatus.SUCCESS
          : SwapEventStatus.FAILED
      analytics.trackSwapEventStatus(event, {
        hash: hash,
        fromAmount: bridge.fromAmount,
        toAmount: bridge.toAmount,
        fromToken: bridge.fromSymbol,
        toToken: bridge.toSymbol,
        fromNetwork: bridge.fromChainName,
        toNetwork: bridge.toChainName,
        isBridge: true,
        swapPair: `${bridge.fromSymbol}-${bridge.toSymbol}`,
      })
    }
    if (!isNotificationsOpen.value) {
      // Show toast for bridge status update

      toastStore.addToastMessage({
        type: newStatus === 'confirmed' ? ToastType.Success : ToastType.Error,
        text: `Bridge ${newStatus === 'confirmed' ? 'Successful' : 'Failed'}`,
        textSecondary: `${bridge.fromChainName} → ${bridge.toChainName}`,
        duration: 10000,
        tradeInfo: {
          fromToken: bridge.fromSymbol,
          fromtTokenIcon: bridge.fromTokenIcon || '',
          fromTokenIsStock: stocksStore.isStock(
            bridge.fromTokenAddress || '',
            bridge.fromChainName,
          ),
          fromAmount: formatFloatingPointValue(bridge.fromAmount).value,
          toToken: bridge.toSymbol,
          toTokenIcon: bridge.toTokenIcon || '',
          toTokenIsStock: stocksStore.isStock(
            bridge.toTokenAddress || '',
            bridge.toChainName,
          ),
          toAmount: formatFloatingPointValue(bridge.toAmount).value,
        },
      })
    }
  }
  fetchBalances()
}

// Get the correct transaction status URL based on chain
const getTransactionStatusUrl = (
  hash: string,
  chainId: string,
  chainName: string,
): string => {
  if (chainName.toLowerCase() === 'bitcoin') {
    return `${Configs.MEW_API_URL}/v1/btc/${chainName.toLowerCase()}/transactions/${hash}/status`
  }
  return `${Configs.MEW_API_URL}/v1/evm/chains/${chainId}/transactions/${hash}/status`
}

// Start polling for notification status (works for transactions, swaps, and bridges)
const startStatusPolling = async (
  hash: string,
  chainId: string,
  chainName: string,
  type: StatusNotificationType,
) => {
  if (statusPollIntervals[hash]) return
  statusPollIntervals[hash] = -1

  const pollStatus = async () => {
    try {
      const response = await fetch(
        getTransactionStatusUrl(hash, chainId, chainName),
      )
      const data = await response.json()

      if (data) {
        updateNotificationStatus(hash, type, data)
      }
    } catch (e) {
      captureException(e)
    }
  }

  await pollStatus()

  if (statusPollIntervals[hash] === -1) {
    statusPollIntervals[hash] = window.setInterval(pollStatus, 10000)
  }
}

// Stop polling for a specific notification
const stopStatusPolling = (hash: string) => {
  if (statusPollIntervals[hash]) {
    clearInterval(statusPollIntervals[hash])
    delete statusPollIntervals[hash]
  }
}

// Helper to start polling for all pending notifications (transactions, swaps, bridges)
const startPollingForPendingNotifications = (address: string) => {
  // Transactions
  const pendingTxs = tradeOrdersStore.getPendingTransactions(address)
  pendingTxs.forEach(tx => {
    if (!statusPollIntervals[tx.hash]) {
      startStatusPolling(tx.hash, tx.chainId, tx.chainName, 'transaction')
    }
  })

  // Swaps
  const pendingSwaps = tradeOrdersStore.getPendingSwaps(address)
  pendingSwaps.forEach(swap => {
    if (!statusPollIntervals[swap.hash]) {
      startStatusPolling(
        swap.hash,
        swap.fromChainId,
        swap.fromChainName,
        'swap',
      )
    }
  })

  // Bridges
  const pendingBridges = tradeOrdersStore.getPendingBridges(address)
  pendingBridges.forEach(bridge => {
    if (!statusPollIntervals[bridge.hash]) {
      startStatusPolling(
        bridge.hash,
        bridge.fromChainId,
        bridge.fromChainName,
        'bridge',
      )
    }
  })
}

// Cleanup on unmount
let unsubscribe: (() => void) | null = null

onUnmounted(() => {
  Object.keys(pollIntervals).forEach(stopPolling)
  Object.keys(statusPollIntervals).forEach(stopStatusPolling)
  stopCountdown()
  unsubscribe?.()
})

// Watch for empty orders to stop countdown
watch(
  () => orders.value.length,
  newLen => {
    if (newLen === 0) {
      stopCountdown()
    }
  },
)

// Watch for wallet address changes to resume polling
watch(
  walletAddress,
  newAddress => {
    // Stop all current polling
    Object.keys(pollIntervals).forEach(stopPolling)
    Object.keys(statusPollIntervals).forEach(stopStatusPolling)
    stopCountdown()
    remainingTimes.value = {}

    if (newAddress) {
      // Resume polling for pending orders
      startPollingForPendingOrders(newAddress)
      // Resume polling for pending notifications (transactions, swaps, bridges)
      startPollingForPendingNotifications(newAddress)
    }
  },
  { immediate: true },
)

// Subscribe to new notifications from the store
unsubscribe = tradeOrdersStore.subscribe((item, type) => {
  if (!walletAddress.value) return

  if (type === 'order') {
    const order = item as SavedTradeOrder
    if (order.status === 'pending') {
      // Initialize remaining time
      const elapsed = Math.floor(Date.now() / 1000) - order.createdAt
      const remaining = Math.max(0, order.duration - elapsed)
      remainingTimes.value[order.hash] = remaining

      if (!pollIntervals[order.hash]) {
        startPolling(order.hash, order.chainId)
      }
      startCountdown()
    }
  } else if (type === 'transaction') {
    const tx = item as TransactionNotification
    if (tx.status === 'sent' && !statusPollIntervals[tx.hash]) {
      startStatusPolling(tx.hash, tx.chainId, tx.chainName, 'transaction')
    }
  } else if (type === 'swap') {
    const swap = item as SwapNotification
    if (swap.status === 'sent' && !statusPollIntervals[swap.hash]) {
      startStatusPolling(
        swap.hash,
        swap.fromChainId,
        swap.fromChainName,
        'swap',
      )
    }
  } else if (type === 'bridge') {
    const bridge = item as BridgeNotification
    if (bridge.status === 'sent' && !statusPollIntervals[bridge.hash]) {
      startStatusPolling(
        bridge.hash,
        bridge.fromChainId,
        bridge.fromChainName,
        'bridge',
      )
    }
  }
})
</script>
