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
  fromAmountUSD: string
  toToken: string
  toAmount: string
  toAmountUSD: string
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
  qualifyingTradeAmount?: string
  qualifyingTradeToken?: string
  qualifiedSince?: string
  holdCampaignStatus?: string
}

// =============================================================================
// PERPS SHARED ENUMS
// =============================================================================

export const PerpsEventSource = {
  MAIN_BANNER: 'Perps_Main_Banner',
  MARKET_INFO: 'Perps_Market_Info',
  PORTFOLIO: 'Perps_Portfolio',
  TRADE: 'Perps_Trade',
} as const
export type PerpsEventSource =
  (typeof PerpsEventSource)[keyof typeof PerpsEventSource]

export const PerpsEventLocation = {
  MARKET: 'Perps_Market',
  POSITIONS_TABLE: 'Perps_Positions_Table',
  MARKET_INFO: 'Perps_Market_Info',
  TRADE: 'Perps_Trade',
  ORDER_INFO: 'Perps_Order_Info',
} as const
export type PerpsEventLocation =
  (typeof PerpsEventLocation)[keyof typeof PerpsEventLocation]

// =============================================================================
// PERPS SIGN IN
// =============================================================================

export const PerpsSignInEvent = {
  CLICKED: 'Perps_Sign_In_Clicked',
  SUCCESS: 'Perps_Sign_In_Success',
  ERROR: 'Perps_Sign_In_Error',
  CANCEL: 'Perps_Sign_In_Cancel',
} as const
export type PerpsSignInEvent =
  (typeof PerpsSignInEvent)[keyof typeof PerpsSignInEvent]

export type PerpsSignInPayload = {
  source?: PerpsEventSource
}

export type PerpsSignInErrorPayload = PerpsSignInPayload & {
  errorMessage: string
  walletType?: string
}

// =============================================================================
// DEPOSIT
// =============================================================================

export const DepositEvent = {
  SHOWN: 'Deposit_Shown',
} as const
export type DepositEvent = (typeof DepositEvent)[keyof typeof DepositEvent]

// =============================================================================
// PERPS DEPOSIT
// =============================================================================

export const PerpsDepositEvent = {
  CLICKED: 'Perps_Deposit_Clicked',
  SUBMIT: 'Perps_Deposit_Submit',
  SUCCESS: 'Perps_Deposit_Success',
  ERROR: 'Perps_Deposit_Error',
  COMPLETED: 'Perps_Deposit_Completed',
} as const
export type PerpsDepositEvent =
  (typeof PerpsDepositEvent)[keyof typeof PerpsDepositEvent]

export type PerpsDepositPayload = {
  depositAmount?: string
  token?: string
}

export type PerpsDepositErrorPayload = PerpsDepositPayload & {
  errorMessage: string
}

// =============================================================================
// PERPS WITHDRAW
// =============================================================================

export const PerpsWithdrawEvent = {
  CLICKED: 'Perps_Withdraw_Clicked',
  SUBMIT: 'Perps_Withdraw_Submit',
  SUCCESS: 'Perps_Withdraw_Success',
  ERROR: 'Perps_Withdraw_Error',
  COMPLETED: 'Perps_Withdraw_Completed',
} as const
export type PerpsWithdrawEvent =
  (typeof PerpsWithdrawEvent)[keyof typeof PerpsWithdrawEvent]

export type PerpsWithdrawPayload = {
  withdrawAmount?: string
  token?: string
}

export type PerpsWithdrawErrorPayload = PerpsWithdrawPayload & {
  errorMessage: string
}

// =============================================================================
// PERPS WITHDRAW AUTHORIZE
// =============================================================================

export const PerpsWithdrawAuthorizeEvent = {
  SUBMIT: 'Perps_Withdraw_Authorize_Submit',
  SUCCESS: 'Perps_Withdraw_Authorize_Success',
  ERROR: 'Perps_Withdraw_Authorize_Error',
} as const
export type PerpsWithdrawAuthorizeEvent =
  (typeof PerpsWithdrawAuthorizeEvent)[keyof typeof PerpsWithdrawAuthorizeEvent]

export type PerpsWithdrawAuthorizeErrorPayload = {
  errorMessage: string
}

// =============================================================================
// PERPS TRADE ORDER
// =============================================================================

export const PerpsTradeOrderEvent = {
  CLICKED_PREVIEW: 'Perps_Trade_Order_Clicked_Preview',
  CLICKED_SUBMIT: 'Perps_Trade_Order_Clicked_Submit',
  SUBMIT_SUCCESS: 'Perps_Trade_Order_Submit_Success',
  SUBMIT_FAIL: 'Perps_Trade_Order_Submit_Fail',
  CLICKED_CANCEL: 'Perps_Trade_Order_Clicked_Cancel',
  FILLED: 'Perps_Trade_Order_Filled',
} as const
export type PerpsTradeOrderEvent =
  (typeof PerpsTradeOrderEvent)[keyof typeof PerpsTradeOrderEvent]

export type PerpsTradeOrderPayload = {
  market?: string
  currentPrice?: number
  orderSide?: 'buy' | 'sell'
  orderType?: 'market' | 'limit'
  leverage?: number
  previousLeverage?: number
  maxLeverage?: number
  margin?: string
  estimatedLiquidation?: number | null
  takeProfit?: number | null
  stopLoss?: number | null
  marginRatio?: number | null
  feeRate?: string
}

export type PerpsTradeOrderFailPayload = PerpsTradeOrderPayload & {
  errorMessage: string
  higherThanReasonablePrice?: boolean
}

// =============================================================================
// PERPS TP/SL
// =============================================================================

export const PerpsTpSlEvent = {
  CLICKED: 'Perps_Tp_Sl_Clicked',
  CLICKED_ADD_TP: 'Perps_Tp_Sl_Clicked_Add_Tp',
  CLICKED_ADD_SL: 'Perps_Tp_Sl_Clicked_Add_Sl',
  CLICKED_SAVE: 'Perps_Tp_Sl_Clicked_Save',
  CLICKED_CANCEL: 'Perps_Tp_Sl_Clicked_Cancel',
} as const
export type PerpsTpSlEvent =
  (typeof PerpsTpSlEvent)[keyof typeof PerpsTpSlEvent]

export type PerpsTpSlSavePayload = {
  tpAmount?: string
  tpPercentageDiffFromCurrent?: string
  slAmount?: string
  slPercentageDiffFromCurrent?: string
}

// =============================================================================
// PERPS CHANGE LEVERAGE
// =============================================================================

export const PerpsChangeLeverageEvent = {
  CLICKED_SUBMIT: 'Perps_Change_Leverage_Clicked_Submit',
  SUBMIT_SUCCESS: 'Perps_Change_Leverage_Submit_Success',
  SUBMIT_FAIL: 'Perps_Change_Leverage_Submit_Fail',
} as const
export type PerpsChangeLeverageEvent =
  (typeof PerpsChangeLeverageEvent)[keyof typeof PerpsChangeLeverageEvent]

export type PerpsChangeLeveragePayload = {
  assetName: string
  oldLeverage: number
  maxLeverage: number
  newLeverage: number
}

export type PerpsChangeLeverageFailPayload = PerpsChangeLeveragePayload & {
  errorMessage: string
}

// =============================================================================
// PERPS CLOSE POSITION
// =============================================================================

export const PerpsClosePositionEvent = {
  CLICKED: 'Perps_Close_Position_Clicked',
  CLICKED_SUBMIT: 'Perps_Close_Position_Clicked_Submit',
  SUBMIT_SUCCESS: 'Perps_Close_Position_Submit_Success',
  SUBMIT_FAIL: 'Perps_Close_Position_Submit_Fail',
  FILLED: 'Perps_Close_Position_Filled',
} as const
export type PerpsClosePositionEvent =
  (typeof PerpsClosePositionEvent)[keyof typeof PerpsClosePositionEvent]

export type PerpsClosePositionPayload = {
  assetName: string
  orderDirection: 'buy' | 'sell'
  orderType: 'market' | 'limit'
  newPositionSize: string
  oldPositionSize: string
  isClosedInFull: boolean
  marketPrice: number
  currentUPnL: number
  amountToClose: string
}

export type PerpsClosePositionFailPayload = PerpsClosePositionPayload & {
  errorMessage: string
}

// =============================================================================
// PERPS MANAGE (entry-point click events)
// =============================================================================

export const PerpsManageEvent = {
  NEW_POSITION: 'Perps_Clicked_New_Position',
  CHANGE_LEVERAGE: 'Perps_Clicked_Change_Leverage',
  ADD_TO_POSITION: 'Perps_Clicked_Add_To_Position',
  CLOSE_POSITION: 'Perps_Clicked_Close_Position',
} as const
export type PerpsManageEvent =
  (typeof PerpsManageEvent)[keyof typeof PerpsManageEvent]

export const PerpsNewPositionAction = {
  MANAGE_LONG: 'Manage Long',
  MANAGE_SHORT: 'Manage Short',
  LONG: 'Long',
  SHORT: 'Short',
} as const
export type PerpsNewPositionAction =
  (typeof PerpsNewPositionAction)[keyof typeof PerpsNewPositionAction]

export type PerpsManagePayload = {
  assetName: string
  location: PerpsEventLocation
}

export type PerpsNewPositionPayload = PerpsManagePayload & {
  action: PerpsNewPositionAction
}

// =============================================================================
// PERPS ORDERS
// =============================================================================

export const PerpsOrderEvent = {
  CLICKED_VIEW_INFO: 'Perps_Order_Clicked_View_Info',
  CLICKED_CANCEL: 'Perps_Order_Clicked_Cancel',
  CANCEL_SUBMIT: 'Perps_Order_Cancel_Submit',
  CANCEL_SUBMIT_SUCCESS: 'Perps_Order_Cancel_Submit_Success',
  CANCEL_SUBMIT_ERROR: 'Perps_Order_Cancel_Submit_Error',
} as const
export type PerpsOrderEvent =
  (typeof PerpsOrderEvent)[keyof typeof PerpsOrderEvent]

export type PerpsOrderViewInfoPayload = {
  assetName: string
  status: string
  orderId: string
  type: string
  location: PerpsEventLocation
}

export type PerpsOrderCancelClickedPayload = {
  assetName: string
  orderId: string
  type: string
  price: string
  size: string
  direction: 'buy' | 'sell'
  location: PerpsEventLocation
}

export type PerpsOrderCancelSubmitPayload = {
  assetName: string
  orderId: string
  type: string
  price: string
  size: string
  direction: 'buy' | 'sell'
}

export type PerpsOrderCancelErrorPayload = PerpsOrderCancelSubmitPayload & {
  errorMessage: string
}

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
  | 'hold_rewards_banner'

  token?: string
  isMobile?: boolean
  stock?: string
}
// =============================================================================
// Main Menu
// =============================================================================

export const ClickMainMenuEvent = 'Clicked_Wallet_Menu' as const

export type ClickMainMenuPayload = {
  button: 'trade' | 'swap' | 'bridge' | 'send' | 'purchase' | 'perps'
}

// =============================================================================
// Select New Address
// =============================================================================

export const SelectNewAddressEvent = 'Selected_New_Address' as const

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
  location: 'token_row' | 'trade_button' | 'spacex_annoucement_banner'
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
// GLOBAL SEARCH
// =============================================================================

export const GlobalSearchEvent = {
  SHOWN: 'Global_Search_Shown',
  SELECT_TOKEN: 'Global_Search_Select_Token',
  TOKEN_NOT_FOUND: 'Global_Search_Token_Not_Found',
} as const
export type GlobalSearchEvent =
  (typeof GlobalSearchEvent)[keyof typeof GlobalSearchEvent]

export const GlobalSearchCategory = {
  STOCK: 'stock',
  CRYPTO: 'crypto',
} as const
export type GlobalSearchCategory =
  (typeof GlobalSearchCategory)[keyof typeof GlobalSearchCategory]

export type GlobalSearchSelectTokenPayload = {
  symbol: string
  name: string
  category: GlobalSearchCategory
  isRecent: boolean
}

export type GlobalSearchTokenNotFoundPayload = {
  searchString: string
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

// =============================================================================
// WEEKEND TRADING ANNOUNCEMENT (MEW-1958)
// =============================================================================

export const WeekendTradingAnnouncementEvent = {
  MODAL_SHOWN: '24/7_Banner_Shown',
  MODAL_CLICK_TRADE_NOW: '24/7_Banner_Clicked_Trade',
  MODAL_DISMISSED: '24/7_Banner_Dismissed',
  TOOLTIP_SHOWN: '24/7_Toast_Shown',
  TOOLTIP_DISMISSED: '24/7_Toast_Dismissed',
} as const

export type WeekendTradingAnnouncementEvent =
  (typeof WeekendTradingAnnouncementEvent)[keyof typeof WeekendTradingAnnouncementEvent]

// =============================================================================
// REWARDS/ TRADE
// =============================================================================

export const RewardsEvent = {
  MAIN_BANNER_SHOWN: 'Rewards_Main_Banner_Shown',
  LEARN_MORE_CLICKED: 'Rewards_Clicked_Learn_More',
  CLICK_SWAP: 'Rewards_Clicked_Swap',
  CLICK_TRADE: 'Rewards_Clicked_Trade',
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
  type?: 'swap' | 'trade'
}
// =============================================================================
// Rewards Hold
// =============================================================================

export const campaigns = ['hold', 'trade', 'buy_no_fees'] as const

type Campaign = (typeof campaigns)[number]
export const HoldRewardsBannerEvent = {
  MODAL_SHOWN: 'Hold_Rewards_Banner_Shown',
  MODAL_DISMISSED: 'Hold_Rewards_Banner_Dismissed',
} as const

export const HoldRewardsMainCardEvent = {
  MODAL_SHOWN: 'Hold_Rewards_Main_Card_Shown',
} as const

export type HoldRewardsMainCardEventPayload = {
  status: string
}

export const RerwadsAndOffersEvent = {
  CLICKED_CTA: 'Clicked_Reward_Offer_CTA',
  CLICKED_MORE_INFO: 'Clicked_Reward_Offer_More_Info',
} as const

export type RerwadsAndOffersEventPayload = {
  campaign: Campaign
  cta: string
  card_status?: string
  location?:
  | 'main-banner'
  | 'main_card'
  | 'offers_card'
  | 'trade_confirmation'
  | 'info_modal'
}

export const TradeConfirmationBannerEvent = {
  SHOWN: 'Trade_Confirmation_Banner_Shown',
} as const

export type TradeConfirmationBannerEventPayload = {
  campaign: Campaign
  isQualified: boolean
}

// =============================================================================
// BUY (Fiat Onramp)
// =============================================================================
export const BuyEvent = {
  SHOWN: 'Buy_Shown',
  PRELIMINARY_SHOWN: 'Buy_Preliminary_Rate_Shown',
  CLICK_CONTINUE: 'Buy_Clicked_Continue',
} as const
export type BuyEvent = (typeof BuyEvent)[keyof typeof BuyEvent]

export type BuyPayloadShared = {
  network?: string
  token: string
  currency: string
  amountUSD: string
  amountOriginalCurrency: string
}

export const BuyOfferEvent = {
  OFFER_SHOWN: 'Buy_Offer_Shown',
  OFFER_CANCELED: 'Buy_Offer_Canceled',
  OFFER_PROCEED: 'Buy_Offer_Clicked_Continue',
} as const
export type BuyOfferEvent = (typeof BuyOfferEvent)[keyof typeof BuyOfferEvent]

export const PROVIDER_NAMES = [
  'moonpay',
  'simplex',
  'topper',
  'coinbase',
] as const
export type ProviderName = (typeof PROVIDER_NAMES)[number]

export type BuyOfferPayloadShared = BuyPayloadShared & {
  MoonpayRate?: string
  SimplexRate?: string
  TopperRate?: string
  CoinbaseRate?: string
  bestProviderRate: string
  selectedRate: string
  selectedProvider: ProviderName
}

export const BuyEventError = {
  PRELIMINARY_ERROR: 'Buy_Preliminary_Rate_Error',
  OFFER_ERROR: 'Buy_Offer_Error',
} as const
export type BuyEventError = (typeof BuyEventError)[keyof typeof BuyEventError]

export type BuyErrorPayload = BuyPayloadShared & {
  errorMsg: string
}

// =============================================================================
// SELL (Fiat Offramp)
// =============================================================================

export const SellEvent = {
  SHOWN: 'Sell_Shown',
  PRELIMINARY_SHOWN: 'Sell_Preliminary_Rate_Shown',
  CLICK_CONTINUE: 'Sell_Clicked_Continue',
} as const
export type SellEvent = (typeof SellEvent)[keyof typeof SellEvent]

export type SellPayloadShared = {
  network?: string
  token: string
  currency: string
  amountToken: string
  amountUSD?: string
  amountOriginalCurrency?: string
  networkFeeUSD?: string
}

export const SellOfferEvent = {
  OFFER_SHOWN: 'Sell_Offer_Shown',
  OFFER_CANCELED: 'Sell_Offer_Canceled',
  OFFER_PROCEED: 'Sell_Offer_Clicked_Continue',
} as const
export type SellOfferEvent = (typeof SellOfferEvent)[keyof typeof SellOfferEvent]

export type SellOfferPayload = SellPayloadShared & {
  moonpayRate: string
}

export const SellEventError = {
  PRELIMINARY_ERROR: 'Sell_Preliminary_Rate_Error',
  OFFER_ERROR: 'Sell_Offer_Error',
} as const
export type SellEventError =
  (typeof SellEventError)[keyof typeof SellEventError]

export type SellErrorPayload = SellPayloadShared & {
  errorMsg: string
}
