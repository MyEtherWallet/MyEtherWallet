import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface SavedTradeOrder {
  hash: string
  status: string
  fromAmount: string
  fromSymbol: string
  fromDecimals: number
  expectedToAmount: string
  toSymbol: string
  toDecimals: number
  createdAt: number
  duration: number
  fills: { txHash: string }[]
  finalToAmount?: string
  percentageDiff?: number
  usdValue?: string
  chainId: number
  fromAddress: string
  seen?: boolean
}

interface TradeOrdersByAddress {
  [address: string]: SavedTradeOrder[]
}

const MAX_ORDERS_PER_ADDRESS = 10

export const useTradeOrdersStore = defineStore('tradeOrdersStore', () => {
  const tradeOrders = useLocalStorage<TradeOrdersByAddress>(
    'tradeOrders',
    {},
    {
      mergeDefaults: true,
    },
  )

  // Get orders for a specific address
  const getOrdersByAddress = (address: string): SavedTradeOrder[] => {
    const normalizedAddress = address.toLowerCase()
    return tradeOrders.value[normalizedAddress] || []
  }

  // Get orders for address as a computed (reactive)
  const ordersForAddress = (address: string) => {
    return computed(() => getOrdersByAddress(address))
  }

  // Add a new order
  const addOrder = (order: SavedTradeOrder) => {
    const normalizedAddress = order.fromAddress.toLowerCase()

    if (!tradeOrders.value[normalizedAddress]) {
      tradeOrders.value[normalizedAddress] = []
    }

    // Check if order already exists
    const existingIndex = tradeOrders.value[normalizedAddress].findIndex(
      o => o.hash === order.hash,
    )

    if (existingIndex >= 0) {
      // Update existing order
      tradeOrders.value[normalizedAddress][existingIndex] = order
    } else {
      // Add new order at the beginning
      tradeOrders.value[normalizedAddress].unshift(order)

      // Keep only the most recent orders
      if (
        tradeOrders.value[normalizedAddress].length > MAX_ORDERS_PER_ADDRESS
      ) {
        tradeOrders.value[normalizedAddress] = tradeOrders.value[
          normalizedAddress
        ].slice(0, MAX_ORDERS_PER_ADDRESS)
      }
    }
  }

  // Update an existing order
  const updateOrder = (
    address: string,
    hash: string,
    updates: Partial<SavedTradeOrder>,
  ) => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress]

    if (!orders) return

    const orderIndex = orders.findIndex(o => o.hash === hash)
    if (orderIndex >= 0) {
      tradeOrders.value[normalizedAddress][orderIndex] = {
        ...orders[orderIndex],
        ...updates,
      }
    }
  }

  // Remove an order
  const removeOrder = (address: string, hash: string) => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress]

    if (!orders) return

    tradeOrders.value[normalizedAddress] = orders.filter(o => o.hash !== hash)

    // Clean up empty address entries
    if (tradeOrders.value[normalizedAddress].length === 0) {
      delete tradeOrders.value[normalizedAddress]
    }
  }

  // Clear all orders for an address
  const clearOrdersForAddress = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    delete tradeOrders.value[normalizedAddress]
  }

  // Clear all orders
  const clearAllOrders = () => {
    tradeOrders.value = {}
  }

  // Get pending orders for an address (useful for resuming polling)
  const getPendingOrders = (address: string): SavedTradeOrder[] => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress] || []
    return orders.filter(o => o.status === 'pending')
  }

  // Get unseen orders count for an address
  const getUnseenOrdersCount = (address: string): number => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress] || []
    return orders.filter(o => !o.seen).length
  }

  // Check if there are any unseen orders for an address
  const hasUnseenOrders = (address: string): boolean => {
    return getUnseenOrdersCount(address) > 0
  }

  // Mark all orders as seen for an address
  const markAllOrdersAsSeen = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress]
    if (!orders) return

    tradeOrders.value[normalizedAddress] = orders.map(order => ({
      ...order,
      seen: true,
    }))
  }

  // Mark a specific order as seen
  const markOrderAsSeen = (address: string, hash: string) => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress]
    if (!orders) return

    const orderIndex = orders.findIndex(o => o.hash === hash)
    if (orderIndex >= 0) {
      tradeOrders.value[normalizedAddress][orderIndex] = {
        ...orders[orderIndex],
        seen: true,
      }
    }
  }

  return {
    tradeOrders,
    getOrdersByAddress,
    ordersForAddress,
    addOrder,
    updateOrder,
    removeOrder,
    clearOrdersForAddress,
    clearAllOrders,
    getPendingOrders,
    getUnseenOrdersCount,
    hasUnseenOrders,
    markAllOrdersAsSeen,
    markOrderAsSeen,
  }
})
