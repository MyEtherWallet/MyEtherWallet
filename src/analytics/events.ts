// =============================================================================
// CONSENT
// =============================================================================

export const ConsentEvent = {
  USER_OPT_OUT_TRACKING: 'UserOptOutTracking',
  USER_OPT_IN_TRACKING: 'UserOptInTracking',
} as const
export type ConsentEvent = (typeof ConsentEvent)[keyof typeof ConsentEvent]

// =============================================================================
// ACCESS WALLET
// =============================================================================

export const AccessWalletEvent = {
  SHOWN: 'AccessWallet_Shown',
  CLICKED: 'AccessWallet_Clicked',
  SUCCESS: 'AccessWallet_Success',
  FAILED: 'AccessWallet_Failed',
  USER_ERROR: 'AccessWallet_UserError',
  NETWORK: 'AccessWallet_Network',
  WALLET: 'AccessWallet_Wallet',
} as const
export type AccessWalletEvent =
  (typeof AccessWalletEvent)[keyof typeof AccessWalletEvent]

export type AccessWalletPayload = {
  product?: string
  sourceUrl?: string
  destinationUrl?: string
  network?: string
  wallet?: string
  type?: string
  errorMsg?: string
}

// =============================================================================
// SWAP
// =============================================================================

export const SwapEvent = {
  SHOWN: 'Swap_Shown',
  SUCCESS: 'Swap_Success',
  FAILED: 'Swap_Failed',
  USER_ERROR: 'Swap_UserError',
  USER_ACTIVITY: 'Swap_UserActivity',
} as const
export type SwapEvent = (typeof SwapEvent)[keyof typeof SwapEvent]

export type SwapPayload = {
  walletConnected?: boolean
  sourceUrl?: string
  destinationUrl?: string
  fromNetwork?: string
  fromToken?: string
  fromAmount?: string
  toNetwork?: string
  toToken?: string
  toAmount?: string
  swapPair?: string
  wallet?: string
  type?: string
  errorMsg?: string
  activity?: string
}

// =============================================================================
// SEND
// =============================================================================

export const SendEvent = {
  SHOWN: 'Send_Shown',
  SUCCESS: 'Send_Success',
  FAILED: 'Send_Failed',
  USER_ERROR: 'Send_UserError',
} as const
export type SendEvent = (typeof SendEvent)[keyof typeof SendEvent]

export type SendPayload = {
  walletConnected?: boolean
  sourceUrl?: string
  destinationUrl?: string
  fromNetwork?: string
  fromToken?: string
  fromAmount?: string
  toNetwork?: string
  toToken?: string
  toAmount?: string
  wallet?: string
  type?: string
  errorMsg?: string
}

// =============================================================================
// BRIDGE
// =============================================================================

export const BridgeEvent = {
  SHOWN: 'Bridge_Shown',
  SUCCESS: 'Bridge_Success',
  FAILED: 'Bridge_Failed',
  USER_ERROR: 'Bridge_UserError',
  USER_ACTIVITY: 'Bridge_UserActivity',
} as const
export type BridgeEvent = (typeof BridgeEvent)[keyof typeof BridgeEvent]

export type BridgePayload = {
  walletConnected?: boolean
  sourceUrl?: string
  destinationUrl?: string
  fromNetwork?: string
  fromToken?: string
  fromAmount?: string
  toNetwork?: string
  toToken?: string
  toAmount?: string
  bridgePair?: string
  wallet?: string
  type?: string
  errorMsg?: string
  activity?: string
}

// =============================================================================
// DEPOSIT
// =============================================================================

export const DepositEvent = {
  SHOWN: 'Deposit_Shown',
  USER_ACTIVITY: 'Deposit_UserActivity',
} as const
export type DepositEvent = (typeof DepositEvent)[keyof typeof DepositEvent]

export type DepositPayload = {
  walletConnected?: boolean
  sourceUrl?: string
  destinationUrl?: string
  copy?: boolean
  ethVm?: boolean
}

// =============================================================================
// BUY
// =============================================================================

export const BuyEvent = {
  SHOWN: 'Buy_Shown',
} as const
export type BuyEvent = (typeof BuyEvent)[keyof typeof BuyEvent]

export type BuyPayload = {
  walletConnected?: boolean
  sourceUrl?: string
  destinationUrl?: string
}

// =============================================================================
// SELL
// =============================================================================

export const SellEvent = {
  SHOWN: 'Sell_Shown',
} as const
export type SellEvent = (typeof SellEvent)[keyof typeof SellEvent]

export type SellPayload = {
  walletConnected?: boolean
  sourceUrl?: string
  destinationUrl?: string
}

// =============================================================================
// WALLET CONNECTION
// =============================================================================

export const WalletConnectionEvent = {
  CONNECTION: 'Wallet_Connection',
} as const
export type WalletConnectionEvent =
  (typeof WalletConnectionEvent)[keyof typeof WalletConnectionEvent]

export type WalletConnectionPayload = {
  network?: string
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export const NotificationEvent = {
  SHOWN: 'Notification_Shown',
  USER_ACTIVITY: 'Notification_UserActivity',
} as const
export type NotificationEvent =
  (typeof NotificationEvent)[keyof typeof NotificationEvent]

export type NotificationPayload = {
  network?: string
  openTime?: number
  pinned?: boolean
  filter?: string
  delete?: boolean
  moreDetails?: boolean
  ethVm?: boolean
}
