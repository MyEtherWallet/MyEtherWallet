// =============================================================================
// CONSENT
// =============================================================================

export const ConsentEvent = {
  USER_OPT_OUT_TRACKING: 'UserOptOutTracking',
  USER_OPT_IN_TRACKING: 'UserOptInTracking',
} as const
export type ConsentEvent = (typeof ConsentEvent)[keyof typeof ConsentEvent]

// =============================================================================
// CREATE WALLET
// =============================================================================
export const CreateWalletEvent = {
  SHOWN: 'CreateWallet_Shown',
  CLICKED: 'CreateWallet_Clicked',
  SELECT_WALLET: 'CreateWallet_Select_Wallet',
  SUCCESS: 'CreateWallet_Success',
} as const
export type CreateWalletEvent =
  (typeof CreateWalletEvent)[keyof typeof CreateWalletEvent]

export type CreateWalletPayload = {
  source?: string
  walletName?: string
  walletType?: string
  destination?: string
}

// =============================================================================
// CONNECT WALLET
// =============================================================================

export const ConnectWalletEvent = {
  SHOWN: 'ConnectWallet_Shown',
  CLICKED: 'ConnectWallet_Clicked',
  SELECT_WALLET: 'ConnectWallet_Select_Wallet',
  SUCCESS: 'ConnectWallet_Success',
  FAILED: 'ConnectWallet_Failed',
} as const
export type ConnectWalletEvent =
  (typeof ConnectWalletEvent)[keyof typeof ConnectWalletEvent]

export type ConnectWalletPayload = {
  source?: string
  network?: string
  walletName?: string
  walletType?: string
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
