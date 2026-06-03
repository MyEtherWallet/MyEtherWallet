// src/modules/perps/sdk/wsTypes.ts

/** Channels the public client subscribes to. Private channels are added in Spec B. */
export type PublicChannelName =
  | 'topOfBooksPerps'
  | 'markPricesPerps'
  | 'tradesPerps'
  | 'fundingRatesPerps'

export type ChannelName = PublicChannelName

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

export type ClientFrame = SubscribeFrame | UnsubscribeFrame | PingFrame

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

export type ServerFrame =
  | PongFrame
  | SubscribedFrame
  | UnsubscribedFrame
  | ErrorFrame
  | TopOfBookUpdate
  | MarkPriceUpdate
  | TradeUpdate
  | FundingRateUpdate

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'
