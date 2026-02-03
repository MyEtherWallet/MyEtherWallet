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

export interface TransactionNotification {
  type: 'transaction'
  hash: string
  status: 'sent' | 'confirmed' | 'failed'
  fromAddress: string
  toAddress: string
  amount: string
  symbol: string
  usdValue?: string
  networkFee?: string
  networkFeeUSD?: string
  chainName: string
  chainIcon?: string
  blockExplorerUrl: string
  blockExplorerAddrUrl: string
  createdAt: number
  seen?: boolean
}

export type NotificationItem = SavedTradeOrder | TransactionNotification

// Type guard for transaction notifications
export const isTransactionNotification = (
  item: NotificationItem,
): item is TransactionNotification => {
  return 'type' in item && item.type === 'transaction'
}

interface TradeOrdersByAddress {
  [address: string]: SavedTradeOrder[]
}

interface TransactionsByAddress {
  [address: string]: TransactionNotification[]
}

const MAX_ORDERS_PER_ADDRESS = 10
const MAX_TRANSACTIONS_PER_ADDRESS = 20

export const useTradeOrdersStore = defineStore('tradeOrdersStore', () => {
  const tradeOrders = useLocalStorage<TradeOrdersByAddress>(
    'tradeOrders',
    {},
    {
      mergeDefaults: true,
    },
  )

  const transactions = useLocalStorage<TransactionsByAddress>(
    'transactionNotifications',
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

  // Get transactions for a specific address
  const getTransactionsByAddress = (
    address: string,
  ): TransactionNotification[] => {
    const normalizedAddress = address.toLowerCase()
    return transactions.value[normalizedAddress] || []
  }

  // Get all notifications (orders + transactions) sorted by createdAt
  const getAllNotifications = (address: string): NotificationItem[] => {
    const orders = getOrdersByAddress(address)
    const txs = getTransactionsByAddress(address)
    return [...orders, ...txs].sort((a, b) => b.createdAt - a.createdAt)
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
    const txs = transactions.value[normalizedAddress] || []
    return orders.filter(o => !o.seen).length + txs.filter(t => !t.seen).length
  }

  // Check if there are any unseen orders for an address
  const hasUnseenOrders = (address: string): boolean => {
    return getUnseenOrdersCount(address) > 0
  }

  // Mark all orders as seen for an address
  const markAllOrdersAsSeen = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress]
    if (orders) {
      tradeOrders.value[normalizedAddress] = orders.map(order => ({
        ...order,
        seen: true,
      }))
    }

    const txs = transactions.value[normalizedAddress]
    if (txs) {
      transactions.value[normalizedAddress] = txs.map(tx => ({
        ...tx,
        seen: true,
      }))
    }
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

  // Add a transaction notification
  const addTransaction = (tx: TransactionNotification) => {
    const normalizedAddress = tx.fromAddress.toLowerCase()

    if (!transactions.value[normalizedAddress]) {
      transactions.value[normalizedAddress] = []
    }

    // Check if transaction already exists
    const existingIndex = transactions.value[normalizedAddress].findIndex(
      t => t.hash === tx.hash,
    )

    if (existingIndex >= 0) {
      // Update existing transaction
      transactions.value[normalizedAddress][existingIndex] = tx
    } else {
      // Add new transaction at the beginning
      transactions.value[normalizedAddress].unshift(tx)

      // Keep only the most recent transactions
      if (
        transactions.value[normalizedAddress].length >
        MAX_TRANSACTIONS_PER_ADDRESS
      ) {
        transactions.value[normalizedAddress] = transactions.value[
          normalizedAddress
        ].slice(0, MAX_TRANSACTIONS_PER_ADDRESS)
      }
    }
  }

  // Remove a transaction notification
  const removeTransaction = (address: string, hash: string) => {
    const normalizedAddress = address.toLowerCase()
    const txs = transactions.value[normalizedAddress]

    if (!txs) return

    transactions.value[normalizedAddress] = txs.filter(t => t.hash !== hash)

    // Clean up empty address entries
    if (transactions.value[normalizedAddress].length === 0) {
      delete transactions.value[normalizedAddress]
    }
  }

  // Remove any notification (order or transaction)
  const removeNotification = (address: string, hash: string) => {
    removeOrder(address, hash)
    removeTransaction(address, hash)
  }

  // Clear all transactions for an address
  const clearTransactionsForAddress = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    delete transactions.value[normalizedAddress]
  }

  // Clear all notifications for an address
  const clearAllNotificationsForAddress = (address: string) => {
    clearOrdersForAddress(address)
    clearTransactionsForAddress(address)
  }

  return {
    tradeOrders,
    transactions,
    getOrdersByAddress,
    getTransactionsByAddress,
    getAllNotifications,
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
    addTransaction,
    removeTransaction,
    removeNotification,
    clearTransactionsForAddress,
    clearAllNotificationsForAddress,
  }
})
