// =============================================================================
// CONSENT
// =============================================================================

export const ConsentEvent = {
  USER_OPT_OUT_TRACKING: 'User_OptOut_Tracking',
  USER_OPT_IN_TRACKING: 'User_OptIn_Tracking',
} as const
export type ConsentEvent = (typeof ConsentEvent)[keyof typeof ConsentEvent]

// =============================================================================
// CREATE WALLET
// =============================================================================
export const CreateWalletEvent = {
  SHOWN: 'Create_Wallet_Shown',
  CLICKED: 'Create_Wallet_Clicked',
  SELECT_WALLET: 'Create_Wallet_Selected_Wallet',
  SUCCESS: 'Create_Wallet_Success',
} as const
export type CreateWalletEvent =
  (typeof CreateWalletEvent)[keyof typeof CreateWalletEvent]

export type CreateWalletPayload = {
  source?: string
}

// =============================================================================
// CONNECT WALLET
// =============================================================================

export const ConnectWalletEvent = {
  SHOWN: 'Connect_Wallet_Shown',
  CLICKED: 'Connect_Wallet_Clicked',
  SELECT_WALLET: 'Connect_Wallet_Selected_Wallet',
  SUCCESS: 'Connect_Wallet_Success',
  FAILED: 'Connect_Wallet_Failed',
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
  PRELIMINARY_SHOWN: 'Swap_Preliminary_Rate_Shown',
  CLICK_BUY: 'Swap_Clicked_Buy',
  CLICK_SWAP: 'Swap_Clicked_Swap',
  OFFER_SHOWN: 'Swap_Offer_Shown',
  OFFER_SELECT_NEW: 'Swap_Offer_Selected_New',
  OFFER_DECLINED: 'Swap_Offer_Declined',
  OFFER_PROCEED: 'Swap_Offer_Clicked_Proceed',
} as const

export type SwapEvent = (typeof SwapEvent)[keyof typeof SwapEvent]

export type SwapPayloadShared = {
  fromNetwork: string
  fromToken: string
  fromAmount: string
  toNetwork: string
  toToken: string
  toAmount: string
  swapPair: string
  isBridge: boolean
  providerName?: string
}

export const SwapEventError = {
  PRELIMINARY_ERROR: 'Swap_Preliminary_Rate_Error',
  OFFER_ERROR: 'Swap_Offer_Error',
  SIGN_ERROR: 'Swap_Sign_Error',
} as const
export type SwapEventError =
  (typeof SwapEventError)[keyof typeof SwapEventError]
export type SwapErrorPayload = SwapPayloadShared & {
  errorMsg: string
}

export const SwapEventStatus = {
  SUCCESS: 'Swap_Success',
  FAILED: 'Swap_Failed',
  INITIATED: 'Swap_Initiated',
} as const

export type SwapEventStatus =
  (typeof SwapEventStatus)[keyof typeof SwapEventStatus]

export type SwapStatusPayload = SwapPayloadShared & {
  hash: string
  canEarnReward?: boolean
}
// =============================================================================
// SEND
// =============================================================================

export const SendEvent = {
  CLICK_SEND: 'Send_Clicked_Send',
  CONFIRM_SHOWN: 'Send_Confirm_Shown',
  CONFIRM_PROCEED: 'Send_Confirm_Clicked_Proceed',
} as const
export type SendEvent = (typeof SendEvent)[keyof typeof SendEvent]

export type SendPayload = {
  token?: string
  errorMsg?: string
}

export const SendEventError = {
  SIGN_ERROR: 'Send_Sign_Error',
} as const
export type SendEventError =
  (typeof SendEventError)[keyof typeof SendEventError]
export type SendErrorPayload = SendPayload & {
  errorMsg: string
}

export const SendEventStatus = {
  SUCCESS: 'Send_Success',
  FAILED: 'Send_Failed',
  INITIATED: 'Send_Initiated',
} as const

export type SendEventStatus =
  (typeof SendEventStatus)[keyof typeof SendEventStatus]

export type SendStatusPayload = SendPayload & {
  hash: string
}

// =============================================================================
// TRADE
// =============================================================================

export const TradeEvent = {
  PRELIMINARY_SHOWN: 'Trade_Preliminary_Rate_Shown',
  CLICK_APPROVE: 'Trade_Clicked_Approve',
  CLICK_TRADE: 'Trade_Clicked_Trade',
  OFFER_SHOWN: 'Trade_Offer_Shown',
  OFFER_SELECT_NEW: 'Trade_Offer_Selected_New',
  OFFER_DECLINED: 'Trade_Offer_Declined',
  OFFER_PROCEED: 'Trade_Offer_Clicked_Proceed',
} as const

export type TradeEvent = (typeof TradeEvent)[keyof typeof TradeEvent]

export type TradePayloadShared = {
  network: string
  fromToken: string
  fromAmount: string
  toToken: string
  toAmount: string
  tradePair: string
  providerName?: string
  orderHash?: string
}

export const TradeEventError = {
  PRELIMINARY_ERROR: 'Trade_Preliminary_Rate_Error',
  OFFER_ERROR: 'Trade_Offer_Error',
  SIGN_ERROR: 'Trade_Sign_Error',
  APPROVAL_ERROR: 'Trade_Approval_Error',
} as const
export type TradeEventError =
  (typeof TradeEventError)[keyof typeof TradeEventError]
export type TradeErrorPayload = TradePayloadShared & {
  errorMsg: string
}

export const TradeEventStatus = {
  SUCCESS: 'Trade_Success',
  // FAILED: 'Trade_Failed',
  CANCELLED: 'Trade_Cancelled',
  EXPIRED: 'Trade_Expired',
  INITIATED: 'Trade_Initiated',
} as const

export type TradeEventStatus =
  (typeof TradeEventStatus)[keyof typeof TradeEventStatus]

export type TradeEventStatusPayload = TradePayloadShared & {
  finalToAmount?: string
  expectedToAmount?: string
  txHash?: string
  percentageDiff?: number
  canEarnReward?: boolean
}

// =============================================================================
// DEPOSIT
// =============================================================================

export const DepositEvent = {
  SHOWN: 'Deposit_Shown',
} as const
export type DepositEvent = (typeof DepositEvent)[keyof typeof DepositEvent]

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export const NotificationEvent = {
  SHOWN: 'Notification_Shown',
  CLOSED: 'Notification_Closed',
  PINNED: 'Notification_Pinned',
} as const
export type NotificationEvent =
  (typeof NotificationEvent)[keyof typeof NotificationEvent]

export type NotificationPayload = {
  duration?: number
}

// =============================================================================
// Click Token Trade
// =============================================================================

export const ClickTokenTradeEvent = {
  TRADE: 'Clicked_Token_Trade',
  BUY: 'Clicked_Token_Buy',
  BRIDGE: 'Clicked_Token_Bridge',
  SWAP: 'Clicked_Token_Swap',
} as const

export type ClickTokenTradePayload = {
  location:
    | 'balance_table'
    | 'token_details_page'
    | 'stocks_table'
    | 'crypto_table'
    | 'trade_module'
    | 'trade'
    | 'swap'
    | 'bridge'
    | 'send'
    | 'portfolio_no_balance'
    | 'select_fee'

  token?: string
  isMobile?: boolean
  stock?: string
}
// =============================================================================
// Main Menu
// =============================================================================

export const ClickMainMenuEvent = 'Clicked_Wallet_Menu' as const

export type ClickMainMenuPayload = {
  button: 'trade' | 'swap' | 'bridge' | 'buy' | 'sell' | 'send'
}

// =============================================================================
// Select New Address
// =============================================================================

export const SelectNewAddressEvent = 'Selected_New_Address' as const

// =============================================================================
// REWARDS
// =============================================================================

export const RewardsEvent = {
  MAIN_BANNER_SHOWN: 'Rewards_Main_Banner_Shown',
  LEARN_MORE_CLICKED: 'Rewards_Clicked_Learn_More',
  CLICK_SWAP: 'Rewards_Clicked_Swap',
  REWARD_EARNED: 'Rewards_Earned',
} as const

export type RewardsEvent = (typeof RewardsEvent)[keyof typeof RewardsEvent]

export type RewardsPayload = {
  location?:
    | 'main-banner'
    | 'small-banner-swap'
    | 'small-banner-trade'
    | 'small-banner-bridge'
    | 'learn-more-dialog'
}

// =============================================================================
// STOCK MARKET
// =============================================================================

export const StockMarketEvent = {
  SELECTED_FILTER: 'Stock_Market_Selected_Filter',
  SEARCH_STOCK: 'Stock_Market_Search_Stock',
  CLICK_STOCK: 'Stock_Market_Click_Stock',
  CLICK_SORT: 'Stock_Market_Click_Sort',
} as const
export type StockMarketEvent =
  (typeof StockMarketEvent)[keyof typeof StockMarketEvent]

export type StockMarketFilterPayload = {
  value: string
}

export type StockMarketSearchPayload = {
  searchValue: string
}

export type StockMarketClickStockPayload = {
  location: 'token_row' | 'trade_button'
  stockName: string
  stockSymbol: string
}

export type StockMarketClickSortPayload = {
  sortOption: string
}

// =============================================================================
// CRYPTO MARKET
// =============================================================================

export const CryptoMarketEvent = {
  SELECTED_FILTER: 'Crypto_Market_Selected_Filter',
  SEARCH_TOKEN: 'Crypto_Market_Search_Token',
  CLICK_TOKEN: 'Crypto_Market_Click_Token',
  CLICK_SORT: 'Crypto_Market_Click_Sort',
  SELECT_NETWORK: 'Crypto_Market_Select_Network',
} as const
export type CryptoMarketEvent =
  (typeof CryptoMarketEvent)[keyof typeof CryptoMarketEvent]

export type CryptoMarketFilterPayload = {
  value: string
}

export type CryptoMarketSearchPayload = {
  searchValue: string
}

export type CryptoMarketClickTokenPayload = {
  location: 'token_row' | 'buy_button' | 'swap_button' | 'bridge_button'
  tokenName: string
  tokenSymbol: string
}

export type CryptoMarketClickSortPayload = {
  sortOption: string
}

export type CryptoMarketSelectNetworkPayload = {
  networkName: string
  networkNameLong: string
}

// =============================================================================
// TRADE / SWAP SORT
// =============================================================================

export const TradeClickSortEvent = 'Trade_Click_Sort' as const
export const SwapClickSortEvent = 'Swap_Click_Sort' as const

export type ClickSortPayload = {
  sortOption: string
  isFromView?: boolean
}
