import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface SavedTradeOrder {
  hash: string
  status: string
  fromAmount: string
  fromSymbol: string
  fromDecimals: number
  fromTokenIcon?: string
  fromTokenAddress: string
  expectedToAmount: string
  toSymbol: string
  toDecimals: number
  toTokenIcon?: string
  toTokenAddress: string
  createdAt: number
  duration: number
  fills: { txHash: string }[]
  finalToAmount?: string
  percentageDiff?: number
  usdValue?: string
  toUsdValue?: string
  chainId: number
  chainName: string
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
  tokenIcon?: string
  usdValue?: string
  networkFee?: string
  networkFeeUSD?: string
  chainId: string
  chainName: string
  chainIcon?: string
  chainSymbol: string
  blockExplorerUrl: string
  blockExplorerAddrUrl: string
  createdAt: number
  seen?: boolean
}

export interface NotificationBaseSwapBridge {
  hash: string
  status: 'sent' | 'confirmed' | 'failed'
  fromAddress: string
  toAddress: string
  fromAmount: string
  fromSymbol: string
  fromTokenIcon: string
  fromUsdValue?: string
  fromTokenAddress: string
  toAmount: string
  toSymbol: string
  toTokenIcon: string
  toUsdValue?: string
  toTokenAddress: string
  networkFee?: string
  networkFeeUSD?: string
  fromChainId: string
  fromChainName: string
  fromChainIcon?: string
  fromChainSymbol: string
  blockExplorerUrl: string
  createdAt: number
  seen?: boolean
}
export interface SwapNotification extends NotificationBaseSwapBridge {
  type: 'swap'
}

export interface BridgeNotification extends NotificationBaseSwapBridge {
  type: 'bridge'
  destinationBlockExplorerAddressUrl?: string
  toChainId: string
  toChainName: string
  toChainIcon?: string
  toChainSymbol: string
}

export type NotificationItem =
  | SavedTradeOrder
  | TransactionNotification
  | SwapNotification
  | BridgeNotification

// Type guard for transaction notifications
export const isTransactionNotification = (
  item: NotificationItem,
): item is TransactionNotification => {
  return 'type' in item && item.type === 'transaction'
}

// Type guard for swap notifications
export const isSwapNotification = (
  item: NotificationItem,
): item is SwapNotification => {
  return 'type' in item && item.type === 'swap'
}

// Type guard for bridge notifications
export const isBridgeNotification = (
  item: NotificationItem,
): item is BridgeNotification => {
  return 'type' in item && item.type === 'bridge'
}

interface TradeOrdersByAddress {
  [address: string]: SavedTradeOrder[]
}

interface TransactionsByAddress {
  [address: string]: TransactionNotification[]
}

interface SwapsByAddress {
  [address: string]: SwapNotification[]
}

interface BridgesByAddress {
  [address: string]: BridgeNotification[]
}

const MAX_ORDERS_PER_ADDRESS = 10
const MAX_TRANSACTIONS_PER_ADDRESS = 20
const MAX_SWAPS_PER_ADDRESS = 20
const MAX_BRIDGES_PER_ADDRESS = 20

// Notification event types
export type NotificationType = 'order' | 'transaction' | 'swap' | 'bridge'
export type NotificationAddedCallback = (
  item: NotificationItem,
  type: NotificationType,
) => void

export const useTradeOrdersStore = defineStore('tradeOrdersStore', () => {
  // Subscription system for notification events
  const subscribers = new Set<NotificationAddedCallback>()

  const subscribe = (callback: NotificationAddedCallback) => {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
  }

  const notifySubscribers = (
    item: NotificationItem,
    type: NotificationType,
  ) => {
    subscribers.forEach(callback => callback(item, type))
  }
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

  const swaps = useLocalStorage<SwapsByAddress>(
    'swapNotifications',
    {},
    {
      mergeDefaults: true,
    },
  )

  const bridges = useLocalStorage<BridgesByAddress>(
    'bridgeNotifications',
    {},
    {
      mergeDefaults: true,
    },
  )
  //TEMP

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

  // Get swaps for a specific address
  const getSwapsByAddress = (address: string): SwapNotification[] => {
    const normalizedAddress = address.toLowerCase()
    return swaps.value[normalizedAddress] || []
  }

  // Get bridges for a specific address
  const getBridgesByAddress = (address: string): BridgeNotification[] => {
    const normalizedAddress = address.toLowerCase()
    return bridges.value[normalizedAddress] || []
  }

  // Get all notifications (orders + transactions + swaps + bridges) sorted by createdAt
  const getAllNotifications = (address: string): NotificationItem[] => {
    const orders = getOrdersByAddress(address)
    const txs = getTransactionsByAddress(address)
    const swapList = getSwapsByAddress(address)
    const bridgeList = getBridgesByAddress(address)
    return [...orders, ...txs, ...swapList, ...bridgeList].sort(
      (a, b) => b.createdAt - a.createdAt,
    )
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

      // Notify subscribers of new order
      notifySubscribers(order, 'order')
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

  // Get pending transactions for an address (status === 'sent')
  const getPendingTransactions = (
    address: string,
  ): TransactionNotification[] => {
    const normalizedAddress = address.toLowerCase()
    const txs = transactions.value[normalizedAddress] || []
    return txs.filter(t => t.status === 'sent')
  }

  // Update an existing transaction
  const updateTransaction = (
    address: string,
    hash: string,
    updates: Partial<TransactionNotification>,
  ) => {
    const normalizedAddress = address.toLowerCase()
    const txs = transactions.value[normalizedAddress]

    if (!txs) return

    const txIndex = txs.findIndex(t => t.hash === hash)
    if (txIndex >= 0) {
      transactions.value[normalizedAddress][txIndex] = {
        ...txs[txIndex],
        ...updates,
      }
    }
  }

  // Get count of all unseen notifications for an address
  const getUnseenNotificationsCount = (address: string): number => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress] || []
    const txs = transactions.value[normalizedAddress] || []
    const swapList = swaps.value[normalizedAddress] || []
    const bridgeList = bridges.value[normalizedAddress] || []
    return (
      orders.filter(o => !o.seen && o.status !== 'pending').length +
      txs.filter(t => !t.seen && t.status !== 'sent').length +
      swapList.filter(s => !s.seen && s.status !== 'sent').length +
      bridgeList.filter(b => !b.seen && b.status !== 'sent').length
    )
  }

  // Check if there are any unseen orders for an address
  const hasUnseenOrders = (address: string): boolean => {
    return getUnseenNotificationsCount(address) > 0
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

    const swapList = swaps.value[normalizedAddress]
    if (swapList) {
      swaps.value[normalizedAddress] = swapList.map(swap => ({
        ...swap,
        seen: true,
      }))
    }

    const bridgeList = bridges.value[normalizedAddress]
    if (bridgeList) {
      bridges.value[normalizedAddress] = bridgeList.map(bridge => ({
        ...bridge,
        seen: true,
      }))
    }
  }

  // Mark all orders as unseen for an address
  const markAllOrdersAsUnseen = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    const orders = tradeOrders.value[normalizedAddress]
    if (orders) {
      tradeOrders.value[normalizedAddress] = orders.map(order => ({
        ...order,
        seen: false,
      }))
    }

    const txs = transactions.value[normalizedAddress]
    if (txs) {
      transactions.value[normalizedAddress] = txs.map(tx => ({
        ...tx,
        seen: false,
      }))
    }

    const swapList = swaps.value[normalizedAddress]
    if (swapList) {
      swaps.value[normalizedAddress] = swapList.map(swap => ({
        ...swap,
        seen: false,
      }))
    }

    const bridgeList = bridges.value[normalizedAddress]
    if (bridgeList) {
      bridges.value[normalizedAddress] = bridgeList.map(bridge => ({
        ...bridge,
        seen: false,
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

      // Notify subscribers of new transaction
      notifySubscribers(tx, 'transaction')
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

  // Add a swap notification
  const addSwap = (swap: SwapNotification) => {
    const normalizedAddress = swap.fromAddress.toLowerCase()

    if (!swaps.value[normalizedAddress]) {
      swaps.value[normalizedAddress] = []
    }

    // Check if swap already exists
    const existingIndex = swaps.value[normalizedAddress].findIndex(
      s => s.hash === swap.hash,
    )

    if (existingIndex >= 0) {
      // Update existing swap
      swaps.value[normalizedAddress][existingIndex] = swap
    } else {
      // Add new swap at the beginning
      swaps.value[normalizedAddress].unshift(swap)

      // Keep only the most recent swaps
      if (swaps.value[normalizedAddress].length > MAX_SWAPS_PER_ADDRESS) {
        swaps.value[normalizedAddress] = swaps.value[normalizedAddress].slice(
          0,
          MAX_SWAPS_PER_ADDRESS,
        )
      }

      // Notify subscribers of new swap
      notifySubscribers(swap, 'swap')
    }
  }

  // Update an existing swap
  const updateSwap = (
    address: string,
    hash: string,
    updates: Partial<SwapNotification>,
  ) => {
    const normalizedAddress = address.toLowerCase()
    const swapList = swaps.value[normalizedAddress]

    if (!swapList) return

    const swapIndex = swapList.findIndex(s => s.hash === hash)
    if (swapIndex >= 0) {
      swaps.value[normalizedAddress][swapIndex] = {
        ...swapList[swapIndex],
        ...updates,
      }
    }
  }

  // Remove a swap notification
  const removeSwap = (address: string, hash: string) => {
    const normalizedAddress = address.toLowerCase()
    const swapList = swaps.value[normalizedAddress]

    if (!swapList) return

    swaps.value[normalizedAddress] = swapList.filter(s => s.hash !== hash)

    // Clean up empty address entries
    if (swaps.value[normalizedAddress].length === 0) {
      delete swaps.value[normalizedAddress]
    }
  }

  // Get pending swaps for an address (status === 'sent')
  const getPendingSwaps = (address: string): SwapNotification[] => {
    const normalizedAddress = address.toLowerCase()
    const swapList = swaps.value[normalizedAddress] || []
    return swapList.filter(s => s.status === 'sent')
  }

  // Add a bridge notification
  const addBridge = (bridge: BridgeNotification) => {
    const normalizedAddress = bridge.fromAddress.toLowerCase()

    if (!bridges.value[normalizedAddress]) {
      bridges.value[normalizedAddress] = []
    }

    // Check if bridge already exists
    const existingIndex = bridges.value[normalizedAddress].findIndex(
      b => b.hash === bridge.hash,
    )

    if (existingIndex >= 0) {
      // Update existing bridge
      bridges.value[normalizedAddress][existingIndex] = bridge
    } else {
      // Add new bridge at the beginning
      bridges.value[normalizedAddress].unshift(bridge)

      // Keep only the most recent bridges
      if (bridges.value[normalizedAddress].length > MAX_BRIDGES_PER_ADDRESS) {
        bridges.value[normalizedAddress] = bridges.value[
          normalizedAddress
        ].slice(0, MAX_BRIDGES_PER_ADDRESS)
      }

      // Notify subscribers of new bridge
      notifySubscribers(bridge, 'bridge')
    }
  }

  // Update an existing bridge
  const updateBridge = (
    address: string,
    hash: string,
    updates: Partial<BridgeNotification>,
  ) => {
    const normalizedAddress = address.toLowerCase()
    const bridgeList = bridges.value[normalizedAddress]

    if (!bridgeList) return

    const bridgeIndex = bridgeList.findIndex(b => b.hash === hash)
    if (bridgeIndex >= 0) {
      bridges.value[normalizedAddress][bridgeIndex] = {
        ...bridgeList[bridgeIndex],
        ...updates,
      }
    }
  }

  // Remove a bridge notification
  const removeBridge = (address: string, hash: string) => {
    const normalizedAddress = address.toLowerCase()
    const bridgeList = bridges.value[normalizedAddress]

    if (!bridgeList) return

    bridges.value[normalizedAddress] = bridgeList.filter(b => b.hash !== hash)

    // Clean up empty address entries
    if (bridges.value[normalizedAddress].length === 0) {
      delete bridges.value[normalizedAddress]
    }
  }

  // Get pending bridges for an address (status === 'sent')
  const getPendingBridges = (address: string): BridgeNotification[] => {
    const normalizedAddress = address.toLowerCase()
    const bridgeList = bridges.value[normalizedAddress] || []
    return bridgeList.filter(b => b.status === 'sent')
  }

  // Remove any notification (order or transaction or swap or bridge)
  const removeNotification = (address: string, hash: string) => {
    removeOrder(address, hash)
    removeTransaction(address, hash)
    removeSwap(address, hash)
    removeBridge(address, hash)
  }

  // Clear all transactions for an address
  const clearTransactionsForAddress = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    delete transactions.value[normalizedAddress]
  }

  // Clear all swaps for an address
  const clearSwapsForAddress = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    delete swaps.value[normalizedAddress]
  }

  // Clear all bridges for an address
  const clearBridgesForAddress = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    delete bridges.value[normalizedAddress]
  }

  // Clear all notifications for an address
  const clearAllNotificationsForAddress = (address: string) => {
    clearOrdersForAddress(address)
    clearTransactionsForAddress(address)
    clearSwapsForAddress(address)
    clearBridgesForAddress(address)
  }

  return {
    tradeOrders,
    transactions,
    swaps,
    bridges,
    subscribe,
    getOrdersByAddress,
    getTransactionsByAddress,
    getSwapsByAddress,
    getBridgesByAddress,
    getAllNotifications,
    ordersForAddress,
    addOrder,
    updateOrder,
    removeOrder,
    clearOrdersForAddress,
    clearAllOrders,
    getPendingOrders,
    getPendingTransactions,
    getPendingSwaps,
    getPendingBridges,
    getUnseenNotificationsCount,
    hasUnseenOrders,
    markAllOrdersAsSeen,
    markAllOrdersAsUnseen,
    markOrderAsSeen,
    addTransaction,
    updateTransaction,
    removeTransaction,
    addSwap,
    updateSwap,
    removeSwap,
    addBridge,
    updateBridge,
    removeBridge,
    removeNotification,
    clearTransactionsForAddress,
    clearSwapsForAddress,
    clearBridgesForAddress,
    clearAllNotificationsForAddress,
  }
})
