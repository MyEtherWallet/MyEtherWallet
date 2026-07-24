// src/modules/perps/sdk/wsTypes.ts

export type WsPublicChannel =
  | 'topOfBooksPerps'
  | 'markPricesPerps'
  | 'tradesPerps'
  | 'fundingRatesPerps'

export type WsPrivateChannel =
  | 'balancePerps'
  | 'positionsPerps'
  | 'ordersPerps'
  | 'fillsPerps'
  | 'deposits'
  | 'withdrawals'

export type WsChannel = WsPublicChannel | WsPrivateChannel

export type WsOutboundOp = 'subscribe' | 'unsubscribe' | 'ping' | 'login' | 'logout'

export interface WsOutboundFrame {
  op: WsOutboundOp
  channel?: WsChannel
  markets?: string[]
  // Login payload — Ondo wire format: { op:'login', args:{ token } }
  args?: { token?: string }
}

export type WsInboundType =
  | 'pong'
  | 'loggedIn'
  | 'loggedOut'
  | 'subscribed'
  | 'unsubscribed'
  | 'update'
  | 'error'

export interface WsInboundFrame<T = unknown> {
  type: WsInboundType
  channel?: WsChannel
  data?: T | T[]
  message?: string
}

export type WsConnectionState =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'closing'
  | 'closed'
  | 'reconnecting'

export type WsAuthStatus = 'unauthenticated' | 'authenticating' | 'authenticated'

export type WsFrameHandler<T = unknown> = (data: T) => void
