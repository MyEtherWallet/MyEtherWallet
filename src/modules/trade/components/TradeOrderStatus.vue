<template>
  <transition
    enter-from-class="opacity-0 -translate-x-full"
    enter-active-class="transform ease-out duration-300 transition"
    enter-to-class="translate-x-0 opacity-100"
    leave-from-class="translate-x-0 opacity-100"
    leave-active-class="transform ease-in duration-200 transition"
    leave-to-class="opacity-0 -translate-x-full"
  >
    <div
      v-if="orders.length > 0"
      class="fixed left-4 top-24 z-[100] w-[320px] max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-20 shadow-lg border border-grey-10"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 border-b border-grey-10"
      >
        <div class="flex items-center gap-2">
          <h3 class="font-bold text-s-17">Orders</h3>
          <span
            class="bg-primary text-white text-s-12 font-bold px-2 py-0.5 rounded-full"
          >
            {{ orders.length }}
          </span>
        </div>
        <button
          @click="clearAllOrders"
          class="text-primary text-s-14 font-medium hover:underline"
        >
          Clear
        </button>
      </div>

      <!-- Orders List -->
      <div class="p-3 space-y-3">
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
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue'
import { XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import type { OrderStatusOutputType } from '../providers/oneinch_fusion/oneInchTypes'
import { SUPPORTED_CHAINS } from '../providers/oneinch_fusion/configs'
import { formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
} from '@/stores/tradeOrdersStore'
import { useWalletStore } from '@/stores/walletStore'

// Extended TradeOrder with runtime-only remainingTime
export interface TradeOrder extends SavedTradeOrder {
  remainingTime: number
}

// Store and wallet
const tradeOrdersStore = useTradeOrdersStore()
const walletStore = useWalletStore()
const { walletAddress } = storeToRefs(walletStore)

// Runtime state (not persisted)
const remainingTimes = ref<Record<string, number>>({})
const pollIntervals: Record<string, number> = {}
let countdownInterval: number | null = null

// Get orders for current wallet address with runtime remainingTime
const orders = computed<TradeOrder[]>(() => {
  if (!walletAddress.value) return []
  const savedOrders = tradeOrdersStore.getOrdersByAddress(walletAddress.value)
  return savedOrders.map(order => ({
    ...order,
    remainingTime: remainingTimes.value[order.hash] ?? order.duration,
  }))
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

// Add a new order to track
const addOrder = (
  order: Omit<SavedTradeOrder, 'fromAddress'> & { fromAddress?: string },
) => {
  const address = order.fromAddress || walletAddress.value
  if (!address) return

  const savedOrder: SavedTradeOrder = {
    ...order,
    fromAddress: address,
  }

  tradeOrdersStore.addOrder(savedOrder)

  // Initialize remaining time
  remainingTimes.value[order.hash] = order.duration

  startCountdown()
  startPolling(order.hash, order.chainId)
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

    // Stop polling for this order
    stopPolling(hash)
  }

  if (status.status === 'cancelled' || status.status === 'expired') {
    stopPolling(hash)
  }

  tradeOrdersStore.updateOrder(walletAddress.value, hash, updates)
}

// Start polling for order status
const startPolling = async (hash: string, chainId: number) => {
  if (pollIntervals[hash]) return

  const pollStatus = async () => {
    try {
      const { default: OneInchFusion } =
        await import('../providers/oneinch_fusion/oneInchFusion')
      // We need a wallet instance to create fusion, but for status check we can use a mock
      const fusion = new OneInchFusion(null as any, chainId)
      const status = await fusion.getOrderStatus(hash)
      updateOrderStatus(hash, status)
    } catch (e) {
      console.error('Failed to fetch order status:', e)
    }
  }

  // Initial poll
  await pollStatus()

  // Poll every 5 seconds
  pollIntervals[hash] = window.setInterval(pollStatus, 5000)
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
      const pendingOrders = tradeOrdersStore.getPendingOrders(newAddress)
      if (pendingOrders.length > 0) {
        pendingOrders.forEach(order => {
          // Calculate remaining time based on creation time and duration
          const elapsed = Math.floor(Date.now() / 1000) - order.createdAt
          const remaining = Math.max(0, order.duration - elapsed)
          remainingTimes.value[order.hash] = remaining
          startPolling(order.hash, order.chainId)
        })
        startCountdown()
      }
    }
  },
  { immediate: true },
)

// Expose methods
defineExpose({
  addOrder,
  updateOrderStatus,
  removeOrder,
  clearAllOrders,
})
</script>
