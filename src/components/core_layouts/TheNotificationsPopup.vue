<template>
  <div ref="containerRef" class="relative">
    <!-- Notification Button (hidden on mobile, shown on desktop) -->
    <app-btn-icon
      v-show="!hideButton"
      :label="$t('menu.open-notifications')"
      @click="togglePopup"
    >
      <div class="relative">
        <bell-icon class="w-6 h-6" />
        <!-- Red dot indicator for unseen orders -->
        <span
          v-if="hasUnseen"
          class="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-white"
        ></span>
      </div>
    </app-btn-icon>

    <!-- Popup -->
    <transition
      enter-from-class="opacity-0 scale-95"
      enter-active-class="transform ease-out duration-200 transition"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-active-class="transform ease-in duration-150 transition"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed left-4 right-auto sm:left-auto sm:right-24 top-20 bottom-4 sm:bottom-auto z-[9999] w-[calc(100vw-80px)] sm:w-[360px] sm:max-h-[calc(100vh-100px)] overflow-hidden bg-white rounded-20 shadow-lg border border-grey-10 flex flex-col"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-grey-10"
        >
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-s-17">Notifications</h3>
            <span
              v-if="notifications.length > 0"
              class="bg-primary text-white text-s-12 font-bold px-2 py-0.5 rounded-full"
            >
              {{ notifications.length }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="notifications.length > 0"
              @click="clearAllNotifications"
              class="text-primary text-s-14 font-medium hover:underline"
            >
              Clear all
            </button>
            <button
              @click="isOpen = false"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey-10 transition-colors"
            >
              <x-mark-icon class="w-5 h-5 text-info" />
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div
          v-if="notifications.length > 0"
          class="p-3 space-y-3 flex-1 overflow-y-auto"
        >
          <template v-for="item in notifications" :key="item.hash">
            <!-- Transaction Notification -->
            <div
              v-if="isTransaction(item)"
              class="relative p-4 rounded-16 border-2 transition-colors border-success bg-success-10/30"
            >
              <!-- Close Button -->
              <button
                @click="removeNotification(item.hash)"
                class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-grey-10 transition-colors"
              >
                <x-mark-icon class="w-4 h-4 text-info" />
              </button>

              <!-- Status and Time -->
              <div class="flex items-center justify-between mb-3 pr-6">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-1 rounded-full text-s-10 font-bold uppercase tracking-wider bg-success-10 text-success"
                  >
                    Sent
                  </span>
                  <div class="flex items-center gap-1">
                    <img
                      v-if="item.chainIcon"
                      :src="item.chainIcon"
                      class="w-4 h-4 rounded-full"
                    />
                    <span class="text-s-12 text-info">{{
                      item.chainName
                    }}</span>
                  </div>
                </div>
                <span class="text-s-12 text-info">{{
                  formatTime(item.createdAt)
                }}</span>
              </div>

              <!-- Transaction Link -->
              <div class="mb-3">
                <div class="flex items-center gap-2 text-s-12">
                  <span class="w-2 h-2 bg-success rounded-full"></span>
                  <span class="text-info">Transaction</span>
                  <a
                    :href="item.blockExplorerUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary font-mono hover:underline flex items-center gap-1"
                  >
                    {{ truncateHash(item.hash) }}
                    <arrow-up-right-icon class="w-3 h-3" />
                  </a>
                </div>
              </div>

              <!-- Amount and Recipient -->
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <p class="text-s-12 text-info">Amount</p>
                  <p class="font-bold text-s-17">
                    {{ item.amount }} {{ item.symbol }}
                  </p>
                  <p v-if="item.usdValue" class="text-s-12 text-info">
                    ${{ item.usdValue }}
                  </p>
                </div>
                <arrow-right-icon class="w-4 h-4 text-info flex-shrink-0" />
                <div class="flex-1 text-right">
                  <p class="text-s-12 text-info">To</p>
                  <a
                    :href="item.blockExplorerAddrUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-mono text-s-14 text-primary hover:underline flex items-center justify-end gap-1"
                  >
                    {{ truncateHash(item.toAddress) }}
                    <arrow-up-right-icon class="w-3 h-3" />
                  </a>
                </div>
              </div>

              <!-- Network Fee -->
              <div
                v-if="item.networkFee"
                class="flex items-center justify-between mt-3 pt-3 border-t border-grey-10"
              >
                <span class="text-s-12 text-info">Network Fee</span>
                <div class="text-right">
                  <span class="text-s-12 text-black">{{
                    item.networkFee
                  }}</span>
                  <span
                    v-if="item.networkFeeUSD"
                    class="text-s-12 text-info ml-1"
                    >(${{ item.networkFeeUSD }})</span
                  >
                </div>
              </div>
            </div>

            <!-- Trade Order Notification -->
            <div
              v-else
              :class="[
                'relative p-4 rounded-16 border-2 transition-colors',
                getOrderBorderClass((item as SavedTradeOrder).status),
              ]"
            >
              <!-- Close Button -->
              <button
                @click="removeNotification(item.hash)"
                class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-grey-10 transition-colors"
              >
                <x-mark-icon class="w-4 h-4 text-info" />
              </button>

              <!-- Status and Time -->
              <div class="flex items-center justify-between mb-3 pr-6">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-s-10 font-bold uppercase tracking-wider',
                      getStatusBadgeClass((item as SavedTradeOrder).status),
                    ]"
                  >
                    {{ (item as SavedTradeOrder).status }}
                  </span>
                  <span
                    v-if="(item as SavedTradeOrder).status === 'pending'"
                    class="text-s-14 font-mono text-primary"
                  >
                    {{
                      formatCountdown(
                        getOrderWithRemainingTime(item as SavedTradeOrder)
                          .remainingTime,
                      )
                    }}
                  </span>
                </div>
                <span class="text-s-12 text-info">{{
                  formatTime(item.createdAt)
                }}</span>
              </div>

              <!-- Filled Transaction -->
              <div
                v-if="
                  (item as SavedTradeOrder).status === 'filled' &&
                  (item as SavedTradeOrder).fills.length > 0
                "
                class="mb-3"
              >
                <div class="flex items-center gap-2 text-s-12">
                  <span class="w-2 h-2 bg-success rounded-full"></span>
                  <span class="text-info">Filled in</span>
                  <a
                    :href="
                      getExplorerLink(
                        (item as SavedTradeOrder).fills[0].txHash,
                        (item as SavedTradeOrder).chainId,
                      )
                    "
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary font-mono hover:underline"
                  >
                    {{
                      truncateHash((item as SavedTradeOrder).fills[0].txHash)
                    }}
                  </a>
                </div>
              </div>

              <!-- From / To -->
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <p class="text-s-12 text-info">From</p>
                  <p class="font-bold text-s-17">
                    {{ (item as SavedTradeOrder).fromAmount }}
                    {{ (item as SavedTradeOrder).fromSymbol }}
                  </p>
                </div>
                <arrow-right-icon class="w-4 h-4 text-info flex-shrink-0" />
                <div class="flex-1 text-right">
                  <p class="text-s-12 text-info">To</p>
                  <p
                    v-if="
                      (item as SavedTradeOrder).status === 'filled' &&
                      (item as SavedTradeOrder).finalToAmount
                    "
                    class="flex flex-col items-end"
                  >
                    <span class="text-s-12 text-info line-through"
                      >{{ (item as SavedTradeOrder).expectedToAmount }}
                      {{ (item as SavedTradeOrder).toSymbol }}</span
                    >
                    <span class="font-bold text-s-17 text-success"
                      >{{ (item as SavedTradeOrder).finalToAmount }}
                      {{ (item as SavedTradeOrder).toSymbol }}</span
                    >
                    <span
                      v-if="(item as SavedTradeOrder).percentageDiff"
                      :class="[
                        'text-s-12',
                        (item as SavedTradeOrder).percentageDiff! > 0
                          ? 'text-success'
                          : 'text-error',
                      ]"
                    >
                      {{
                        (item as SavedTradeOrder).percentageDiff! > 0
                          ? '+'
                          : ''
                      }}{{
                        (item as SavedTradeOrder).percentageDiff!.toFixed(2)
                      }}%
                    </span>
                  </p>
                  <p v-else class="font-bold text-s-17">
                    ~ {{ (item as SavedTradeOrder).expectedToAmount }}
                    {{ (item as SavedTradeOrder).toSymbol }}
                  </p>
                </div>
              </div>

              <!-- Order Hash and USD Value -->
              <div
                class="flex items-center justify-between mt-3 pt-3 border-t border-grey-10"
              >
                <span class="text-s-12 text-info font-mono">{{
                  truncateHash(item.hash)
                }}</span>
                <span
                  v-if="(item as SavedTradeOrder).usdValue"
                  class="text-s-12 text-info"
                  >${{ (item as SavedTradeOrder).usdValue }}</span
                >
              </div>
            </div>
          </template>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center">
          <bell-icon class="w-12 h-12 text-grey-30 mx-auto mb-3" />
          <p class="text-info text-s-14">No notifications yet</p>
          <p class="text-info text-s-12 mt-1">
            Your trade orders and transactions will appear here
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue'
import {
  BellIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import type { OrderStatusOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'
import { SUPPORTED_CHAINS } from '@/modules/trade/providers/oneinch_fusion/configs'
import { formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
  type NotificationItem,
  isTransactionNotification,
} from '@/stores/tradeOrdersStore'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { onClickOutside } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

// Props
defineProps<{
  hideButton?: boolean
}>()

// Extended TradeOrder with runtime-only remainingTime
interface TradeOrder extends SavedTradeOrder {
  remainingTime: number
}

// Store and wallet
const tradeOrdersStore = useTradeOrdersStore()
const walletStore = useWalletStore()
const walletMenuStore = useWalletMenuStore()
const appLayoutStore = useAppLayoutStore()
const toastStore = useToastStore()
const { walletAddress } = storeToRefs(walletStore)
const { isOverflowHidden, isNotificationsOpen } = storeToRefs(appLayoutStore)

// Router for closing AppViewAsDialog
const route = useRoute()
const router = useRouter()

// Container ref for click outside
const containerRef = ref<HTMLElement | null>(null)

// Popup state
const isOpen = ref(false)

// Click outside handler
onClickOutside(containerRef, () => {
  if (isOpen.value) {
    isOpen.value = false
    isNotificationsOpen.value = false
  }
})

// Watch for external trigger to open notifications
watch(isNotificationsOpen, newValue => {
  if (newValue && !isOpen.value) {
    togglePopup()
  }
})

// Runtime state (not persisted)
const remainingTimes = ref<Record<string, number>>({})
const pollIntervals: Record<string, number> = {}
let countdownInterval: number | null = null

// Check if there are unseen orders
const hasUnseen = computed(() => {
  if (!walletAddress.value) return false
  return tradeOrdersStore.hasUnseenOrders(walletAddress.value)
})

// Get all notifications (trade orders + transactions) sorted by time
const notifications = computed<NotificationItem[]>(() => {
  if (!walletAddress.value) return []
  return tradeOrdersStore.getAllNotifications(walletAddress.value)
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

// Check if notification is a transaction
const isTransaction = isTransactionNotification

// Toggle popup
const togglePopup = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Close side menu when opening notifications
    walletMenuStore.setIsOpenSideMenu(false)

    // Close AppViewAsDialog if open (detected by nested routes)
    if (route.matched.length > 1) {
      // Navigate to parent route to close the dialog
      const parentRouteName = route.matched[route.matched.length - 2].name
      isOverflowHidden.value = false
      router.push({ name: parentRouteName })
    }

    if (walletAddress.value) {
      // Mark all orders as seen when opening
      tradeOrdersStore.markAllOrdersAsSeen(walletAddress.value)
    }
  }
  isNotificationsOpen.value = isOpen.value
}

// Open popup (for programmatic access from parent)
const openPopup = () => {
  if (!isOpen.value) {
    togglePopup()
  }
}

// Expose openPopup for parent component access
defineExpose({
  openPopup,
})

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

  if (status.status === 'filled' && status.finalToAmount) {
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

    // Show success toast with trade info
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Trade Order Filled',
      duration: 10000,
      tradeInfo: {
        fromToken: order.fromSymbol,
        fromtTokenIcon: order.fromTokenIcon || '',
        fromTokenIsStock: false,
        fromAmount: formatFloatingPointValue(order.fromAmount).value,
        toToken: order.toSymbol,
        toTokenIcon: order.toTokenIcon || '',
        toTokenIsStock: false,
        toAmount: formatFloatingPointValue(finalAmount).value,
      },
    })
  }

  if (status.status === 'cancelled' || status.status === 'expired') {
    // Mark as unseen when status changes
    updates.seen = false
    stopPolling(hash)

    // Show error toast with trade info
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: `Trade Order ${status.status === 'cancelled' ? 'Cancelled' : 'Expired'}`,
      duration: 10000,
      tradeInfo: {
        fromToken: order.fromSymbol,
        fromtTokenIcon: order.fromTokenIcon || '',
        fromTokenIsStock: false,
        fromAmount: formatFloatingPointValue(order.fromAmount).value,
        toToken: order.toSymbol,
        toTokenIcon: order.toTokenIcon || '',
        toTokenIsStock: false,
        toAmount: formatFloatingPointValue(order.expectedToAmount).value,
      },
    })
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
      console.error('Failed to fetch order status:', e)
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
  delete remainingTimes.value[hash]
  tradeOrdersStore.removeNotification(walletAddress.value, hash)

  if (orders.value.length === 0) {
    stopCountdown()
  }
}

// Clear all notifications
const clearAllNotifications = () => {
  if (!walletAddress.value) return

  Object.keys(pollIntervals).forEach(stopPolling)
  remainingTimes.value = {}
  tradeOrdersStore.clearAllNotificationsForAddress(walletAddress.value)
  stopCountdown()
}

// Format countdown time
const formatCountdown = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Format time
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Truncate hash
const truncateHash = (hash: string): string => {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

// Get explorer link based on chainId
const getExplorerLink = (txHash: string, chainId: number): string => {
  const chainConfig = SUPPORTED_CHAINS.find(c => c.chainId === chainId)
  const blockExplorer = chainConfig?.chain.blockExplorers?.default?.url || ''
  return `${blockExplorer}/tx/${txHash}`
}

// Get status badge class
const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'filled':
      return 'bg-success-10 text-success'
    case 'pending':
      return 'bg-primary-10 text-primary'
    case 'cancelled':
    case 'expired':
      return 'bg-error-10 text-error'
    default:
      return 'bg-grey-10 text-info'
  }
}

// Get order border class
const getOrderBorderClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'filled':
      return 'border-success bg-success-10/30'
    case 'pending':
      return 'border-grey-10 bg-white'
    case 'cancelled':
    case 'expired':
      return 'border-error bg-error-10/30'
    default:
      return 'border-grey-10 bg-white'
  }
}

// Cleanup on unmount
onUnmounted(() => {
  Object.keys(pollIntervals).forEach(stopPolling)
  stopCountdown()
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

// Watch for wallet address changes to resume polling
watch(
  walletAddress,
  newAddress => {
    // Stop all current polling
    Object.keys(pollIntervals).forEach(stopPolling)
    stopCountdown()
    remainingTimes.value = {}

    if (newAddress) {
      // Resume polling for pending orders
      startPollingForPendingOrders(newAddress)
    }
  },
  { immediate: true },
)

// Watch for new orders added to the store
watch(
  () =>
    walletAddress.value
      ? tradeOrdersStore.getOrdersByAddress(walletAddress.value)
      : [],
  (newOrders, oldOrders) => {
    if (!walletAddress.value) return

    // Find newly added orders (orders in new list but not in old list)
    const oldHashes = new Set((oldOrders || []).map(o => o.hash))
    const newlyAdded = newOrders.filter(o => !oldHashes.has(o.hash))

    // Start polling for new orders
    newlyAdded.forEach(order => {
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
    })

    // Also check for any pending orders that aren't being polled
    startPollingForPendingOrders(walletAddress.value)
  },
  { deep: true },
)
</script>
