// src/modules/perps/sdk/wsTypes.ts

/** Channels the public client subscribes to. Private channels are added in Spec B. */
export type PublicChannelName =
  | 'topOfBooksPerps'
  | 'markPricesPerps'
  | 'tradesPerps'
  | 'fundingRatesPerps'

export type PrivateChannelName =
  | 'ordersPerps'
  | 'fillsPerps'
  | 'positionsPerps'
  | 'balancePerps'
  | 'deposits'
  | 'withdrawals'

export type ChannelName = PublicChannelName | PrivateChannelName

/** Outbound frames (op envelopes). */
export interface SubscribeFrame {
  op: 'subscribe'
  channel: ChannelName
  market?: string
  markets?: string[]
}

export interface UnsubscribeFrame {
  op: 'unsubscribe'
  channel: ChannelName
  market?: string
  markets?: string[]
}

export interface PingFrame {
  op: 'ping'
}

export interface LoginFrame {
  op: 'login'
  args: { token: string }
}

export interface LogoutFrame {
  op: 'logout'
}

export type ClientFrame = SubscribeFrame | UnsubscribeFrame | PingFrame | LoginFrame | LogoutFrame

/** Inbound frames. The server emits one event per channel name in `type`. */
export interface PongFrame {
  type: 'pong'
}

export interface SubscribedFrame {
  type: 'subscribed'
  channel: ChannelName
}

export interface UnsubscribedFrame {
  type: 'unsubscribed'
  channel: ChannelName
}

export interface ErrorFrame {
  type: 'error'
  code?: string
  message?: string
}

export interface TopOfBookUpdate {
  type: 'topOfBooksPerps'
  data: { market: string; bid: string; ask: string }
}

export interface MarkPriceUpdate {
  type: 'markPricesPerps'
  data: { market: string; markPrice: string; indexPrice?: string }
}

export interface TradeUpdate {
  type: 'tradesPerps'
  data: { market: string; price: string; size: string; ts: number; side?: 'buy' | 'sell' }
}

export interface FundingRateUpdate {
  type: 'fundingRatesPerps'
  data: {
    market: string
    fundingRate: string
    nextFundingRate?: string
    nextFundingRateTimestamp?: string
    premiums?: { mark: string; bid: string; ask: string; premiumIndex: string }[]
  }
}

export interface LoggedInFrame {
  type: 'loggedIn'
}

export interface LoggedOutFrame {
  type: 'loggedOut'
}

export interface OrderUpdate {
  type: 'ordersPerps'
  data: { orderId: string; [k: string]: unknown }
}

export interface FillUpdate {
  type: 'fillsPerps'
  data: { fillId?: string; orderId?: string; [k: string]: unknown }
}

export interface PositionUpdate {
  type: 'positionsPerps'
  data: { market: string; [k: string]: unknown }
}

export interface BalanceUpdate {
  type: 'balancePerps'
  data: { [k: string]: unknown }
}

export interface DepositUpdate {
  type: 'deposits'
  data: { id?: string; txHash?: string; [k: string]: unknown }
}

export interface WithdrawalUpdate {
  type: 'withdrawals'
  data: { id?: string; txHash?: string; [k: string]: unknown }
}

export type ServerFrame =
  | PongFrame
  | SubscribedFrame
  | UnsubscribedFrame
  | ErrorFrame
  | TopOfBookUpdate
  | MarkPriceUpdate
  | TradeUpdate
  | FundingRateUpdate
  | LoggedInFrame
  | LoggedOutFrame
  | OrderUpdate
  | FillUpdate
  | PositionUpdate
  | BalanceUpdate
  | DepositUpdate
  | WithdrawalUpdate

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated'
