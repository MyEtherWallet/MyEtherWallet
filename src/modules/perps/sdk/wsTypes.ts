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

export interface LoggedInFrame {
  type: 'loggedIn'
}

export interface LoggedOutFrame {
  type: 'loggedOut'
}

// All channel data updates share this envelope; the per-item shape depends on
// `channel` and is cast by individual handlers.
export interface ChannelDataFrame {
  type: 'update'
  channel: ChannelName
  timestamp?: string
  data: unknown
}

export type ServerFrame =
  | PongFrame
  | SubscribedFrame
  | UnsubscribedFrame
  | ErrorFrame
  | LoggedInFrame
  | LoggedOutFrame
  | ChannelDataFrame

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated'
