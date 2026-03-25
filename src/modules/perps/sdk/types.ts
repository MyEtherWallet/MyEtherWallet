export interface GenericResponse<T> {
  success: boolean
  result: T
}

export interface ErrorResponse {
  success: false
  error: string
  error_code?: string
}

export interface StatusResult {
  marketStatus: string
}

export interface LoginGetChallengeRequest {
  walletAddress: string
  chainId: string
}

export interface LoginChallengeResult {
  id: string
  message: string
}

export interface LoginCompleteChallengeRequest {
  id: string
  signature: string
}

export interface LoginCompleteChallengeResult {
  identifier: string
  authType: string
  accountId: string
  issuedAtSecs: number
  expirationSecs: number
  token: string
  newAccount: boolean
}

export interface AgreementRequest {
  termsVersion: number
  privacyVersion: number
}

export interface TradingPair {
  market: string
  pair: {
    base: string
    quote: string
  }
  displayName: string
  baseIncrement: string
  quoteIncrement: string
}

export interface MarketsResult {
  perps: {
    tradingPairs: TradingPair[]
  }
  tokenConfig: TokenConfig[]
}

export interface TokenConfig {
  id: string
  name: string
  decimals: number
  tokenDecimals: number
  networks: Record<string, unknown>
}

export interface Sparkline {
  price: string[]
}

export interface Contract {
  market: string
  productType: string
  contractType: string
  baseCurrency: string
  quoteCurrency: string
  disabled: boolean
  lastPrice?: string
  baseVolume?: string
  quoteVolume?: string
  usdVolume?: string
  bid?: string
  ask?: string
  high?: string
  low?: string
  openInterest?: string
  openInterestUsd?: string
  indexPrice?: string
  indexCurrency?: string
  fundingRate?: string
  nextFundingRate?: string
  nextFundingRateTimestamp?: string
  makerFee?: string
  takerFee?: string
  priceChangePercent?: string
  sparkline?: Sparkline
  tags?: string[]
}

export interface HistoryResult {
  s: string
  t: number[]
  o: number[]
  h: number[]
  l: number[]
  c: number[]
  v: number[]
}

export interface AccountWalletKey {
  id: string
  wallet: 'main' | 'margin'
}

export interface AccountInfo {
  accountID: string
  identifier: string
  authType: string
  accountState: string
  withdrawalFeeUSD: string
}

export interface DepositAddressListRequest {
  coins: string[]
  network?: 'avalanche' | 'ethereum' | 'solana'
  depositDestination?: AccountWalletKey
}

export interface DepositAddress {
  coin: string
  network: string
  address: string
  depositDestination: AccountWalletKey
}

export interface ProvisionAddressRequest {
  network: 'avalanche' | 'ethereum' | 'solana'
  symbol: string
  deposit_destination: AccountWalletKey
}

export interface ProvisionAddressResult {
  chain: string
  accountId: string
  symbol: string
  address: string
}

export interface PortfolioSummary {
  marginBalance: string
  netInvested: string
  totalPnL: string
  realizedPnl: string
  volume7d: string
  volume30d: string
  volumeAllTime: string
}

export interface PerpsBalance {
  walletBalance: string
  realizedPnl: string
  unrealizedPnl: string
  marginBalance: string
  usedMargin: string
  availableMargin: string
  withdrawableMargin: string
  maintenanceMarginRequirement: string
  totalMaintenanceMargin: string
  marginRatio: string
  leverage: string
  underLiquidation: boolean
  totalFundingPayments: string
  totalTradingFees: string
  totalPnL: string
  netInvested: string
}

export interface AddressBookEntry {
  withdrawalAddress: string
  label: string
  lastUpdated: string
}

export interface AddressBookResult {
  addressBook: AddressBookEntry[]
}

export interface AddressBookGetChallengeRequest {
  walletAddress: string
  chainId: string
  withdrawalAddress: string
}

export interface AddressBookCompleteChallengeRequest {
  id: string
  signature: string
  addressLabel: string
}

export interface WithdrawRequest {
  customer_withdrawal_id: string
  symbol: string
  network: 'avalanche' | 'ethereum' | 'solana'
  amount: string
  address: string
  from?: AccountWalletKey
}

export interface WithdrawResult {
  withdrawal_status: string
  withdrawal_id: string
  customer_withdrawal_id: string
}

export interface Position {
  market: string
  direction: 'long' | 'short' | 'neutral'
  netQuantity: string
  averageEntryPrice: string
  usedMargin: string
  unrealizedPnl: string
  markPrice: string
  liquidationPrice: string
  bankruptcyPrice: string
  maintenanceMargin: string
  notionalValue: string
  leverage: string
  netFundingSinceNeutral: string
  returnOnEquity: string
  stopLossTriggerPrice?: string
  takeProfitTriggerPrice?: string
}

export interface StopOrderReq {
  triggerPrice: string
}

export interface CreateOrderRequest {
  market: string
  side: 'buy' | 'sell'
  size: string
  type: 'limit' | 'market' | 'stopMarket' | 'takeProfitMarket'
  price?: string
  triggerPrice?: string
  clientOrderId?: string
  timeInForce?: 'GTC' | 'IOC'
  postOnly?: boolean
  reduceOnly?: boolean
  takeProfit?: StopOrderReq
  stopLoss?: StopOrderReq
}

export interface LeverageSetting {
  market: string
  leverage: string
}

export interface MarkPrice {
  pair: {
    base: string
    quote: string
  }
  price: string
  time: string
}

export interface MaxOrderSizeLevel {
  maxBidBaseSize: string
  maxAskBaseSize: string
}

export interface MaxOrderSizeResult {
  percent100: MaxOrderSizeLevel
  percent75: MaxOrderSizeLevel
  percent50: MaxOrderSizeLevel
  percent25: MaxOrderSizeLevel
}

export interface OrderResult {
  orderId: string
  clientOrderId?: string
  side: string
  price: string
  size: string
  market: string
  filledSize: string
  filledCost: string
  fee: string
  status: string
  createdAt: string
  type: string
}

export interface PageInfo {
  prevCursor?: string
  nextCursor?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  result: T[]
  pageInfo?: PageInfo
}

export interface ApiOrder {
  orderId: string
  clientOrderId?: string
  side: 'buy' | 'sell'
  price: string
  size: string
  market: string
  filledSize: string
  lastFillSize: string
  filledCost: string
  fee: string
  status: 'open' | 'fullyfilled' | 'canceled' | 'pending' | 'untriggered'
  createdAt: string
  filledAt?: string
  canceledAt?: string
  cancelReason?: string
  type: 'limit' | 'market' | 'stopMarket' | 'takeProfitMarket'
  timeInForce?: 'GTC' | 'IOC'
  reduceOnly?: boolean
  realizedPnl?: string
}

export interface ApiFill {
  id: string
  orderId: string
  market: string
  price: string
  size: string
  side: 'buy' | 'sell'
  direction?: string
  filledCost: string
  fee: string
  pnl?: string
  time: string
  isMaker: boolean
}

export interface WalletDeposit {
  coin: string
  size: string
  status: 'pending' | 'confirmed'
  txid: string
  fromAddress: string
  time: string
  currentConfirmations?: number
  requiredConfirmations?: number
  chainId: string
  usdValue: string
}

export interface WalletWithdrawal {
  coin: string
  size: string
  status: string
  address: string
  withdrawal_id: string
  txid: string
  customer_withdrawal_id: string
  time: string
  usdValue?: string
  usdFee?: string
  chainId: string
}
