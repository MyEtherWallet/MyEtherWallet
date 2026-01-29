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
              v-if="orders.length > 0"
              class="bg-primary text-white text-s-12 font-bold px-2 py-0.5 rounded-full"
            >
              {{ orders.length }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="orders.length > 0"
              @click="clearAllOrders"
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

        <!-- Orders List -->
        <div
          v-if="orders.length > 0"
          class="p-3 space-y-3 flex-1 overflow-y-auto"
        >
          <div
            v-for="order in orders"
            :key="order.hash"
            :class="[
              'relative p-4 rounded-16 border-2 transition-colors',
              getOrderBorderClass(order.status),
            ]"
          >
            <!-- Close Button -->
            <button
              @click="removeOrder(order.hash)"
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
                    getStatusBadgeClass(order.status),
                  ]"
                >
                  {{ order.status }}
                </span>
                <span
                  v-if="order.status === 'pending'"
                  class="text-s-14 font-mono text-primary"
                >
                  {{ formatCountdown(order.remainingTime) }}
                </span>
              </div>
              <span class="text-s-12 text-info">{{
                formatTime(order.createdAt)
              }}</span>
            </div>

            <!-- Filled Transaction -->
            <div
              v-if="order.status === 'filled' && order.fills.length > 0"
              class="mb-3"
            >
              <div class="flex items-center gap-2 text-s-12">
                <span class="w-2 h-2 bg-success rounded-full"></span>
                <span class="text-info">Filled in</span>
                <a
                  :href="getExplorerLink(order.fills[0].txHash, order.chainId)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary font-mono hover:underline"
                >
                  {{ truncateHash(order.fills[0].txHash) }}
                </a>
              </div>
            </div>

            <!-- From / To -->
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <p class="text-s-12 text-info">From</p>
                <p class="font-bold text-s-17">
                  {{ order.fromAmount }} {{ order.fromSymbol }}
                </p>
              </div>
              <arrow-right-icon class="w-4 h-4 text-info flex-shrink-0" />
              <div class="flex-1 text-right">
                <p class="text-s-12 text-info">To</p>
                <p
                  v-if="order.status === 'filled' && order.finalToAmount"
                  class="flex flex-col items-end"
                >
                  <span class="text-s-12 text-info line-through"
                    >{{ order.expectedToAmount }} {{ order.toSymbol }}</span
                  >
                  <span class="font-bold text-s-17 text-success"
                    >{{ order.finalToAmount }} {{ order.toSymbol }}</span
                  >
                  <span
                    v-if="order.percentageDiff"
                    :class="[
                      'text-s-12',
                      order.percentageDiff > 0 ? 'text-success' : 'text-error',
                    ]"
                  >
                    {{ order.percentageDiff > 0 ? '+' : ''
                    }}{{ order.percentageDiff.toFixed(2) }}%
                  </span>
                </p>
                <p v-else class="font-bold text-s-17">
                  ~ {{ order.expectedToAmount }} {{ order.toSymbol }}
                </p>
              </div>
            </div>

            <!-- Order Hash and USD Value -->
            <div
              class="flex items-center justify-between mt-3 pt-3 border-t border-grey-10"
            >
              <span class="text-s-12 text-info font-mono">{{
                truncateHash(order.hash)
              }}</span>
              <span v-if="order.usdValue" class="text-s-12 text-info"
                >${{ order.usdValue }}</span
              >
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center">
          <bell-icon class="w-12 h-12 text-grey-30 mx-auto mb-3" />
          <p class="text-info text-s-14">No notifications yet</p>
          <p class="text-info text-s-12 mt-1">
            Your trade orders will appear here
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue'
import { BellIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import type { OrderStatusOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'
import { SUPPORTED_CHAINS } from '@/modules/trade/providers/oneinch_fusion/configs'
import { formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
} from '@/stores/tradeOrdersStore'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
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
const { walletAddress } = storeToRefs(walletStore)
const { isOverflowHidden } = storeToRefs(appLayoutStore)

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

// Get orders for current wallet address with runtime remainingTime
const orders = computed<TradeOrder[]>(() => {
  if (!walletAddress.value) return []
  const savedOrders = tradeOrdersStore.getOrdersByAddress(walletAddress.value)
  return savedOrders.map(order => ({
    ...order,
    remainingTime: remainingTimes.value[order.hash] ?? order.duration,
  }))
})

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
  }

  if (status.status === 'cancelled' || status.status === 'expired') {
    // Mark as unseen when status changes
    updates.seen = false
    stopPolling(hash)
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

// Remove an order
const removeOrder = (hash: string) => {
  if (!walletAddress.value) return

  stopPolling(hash)
  delete remainingTimes.value[hash]
  tradeOrdersStore.removeOrder(walletAddress.value, hash)

  if (orders.value.length === 0) {
    stopCountdown()
  }
}

// Clear all orders
const clearAllOrders = () => {
  if (!walletAddress.value) return

  Object.keys(pollIntervals).forEach(stopPolling)
  remainingTimes.value = {}
  tradeOrdersStore.clearOrdersForAddress(walletAddress.value)
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
