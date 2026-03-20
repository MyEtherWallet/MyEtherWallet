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
  network?: string
  token?: string
  errorMsg?: string
}

export const SendEventError = {
  PRELIMINARY_ERROR: 'Send_Preliminary_Error',
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

// select Address
// buy button clicked
// swap button clicked
// trade button clicked
