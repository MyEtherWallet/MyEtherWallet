/**
 * Maps short chain codes returned by the MEW purchase API (`/v5/purchase/info`)
 * to the canonical chain names used by `chainsStore` (v7).
 */
export const PURCHASE_CHAIN_TO_V7: Record<string, string> = {
  ETH: 'ETHEREUM',
  POL: 'POLYGON',
  ARB: 'ARBITRUM',
  OP: 'OPTIMISTIC_ETHEREUM',
  BSC: 'BSC',
  BTC: 'BITCOIN',
  DOGE: 'DOGECOIN',
  LTC: 'LITECOIN',
  SOL: 'SOLANA',
}

export interface MarketData {
  name: string
  symbol: string
  contract_address: string
  icon: string
  price: string
  price_change_percentage_24h: string
  sparkline: string[]
  market_cap: string
}

export interface PurchaseAsset {
  chain: string
  symbol: string
  name: string
  coingecko_id: string
  contract_address: string
  providers: string[]
  is_sell_supported: boolean
  market_data?: MarketData
}

export interface PurchaseChain {
  chain: string
  name: string
  assets: PurchaseAsset[]
}

export interface PurchaseProviderIso {
  iso: string
  allowed: {
    buy: boolean
    sell: boolean
  }
}

export interface PurchaseFiat {
  fiat_currency: string
  limits: {
    min: number
    max: number
  }
  payment_methods: string[]
  is_sell_supported: boolean
}

export interface PurchaseProvider {
  provider: string
  isos_list: string[]
  isos: PurchaseProviderIso[]
  fiats_list: string[]
  fiats: PurchaseFiat[]
}

export interface PurchaseInfo {
  assets: PurchaseChain[]
  providers: PurchaseProvider[]
}

export interface BuyQuote {
  provider: string
  crypto_amount: string
  crypto_currency: string
  crypto_price: string
  fiat_amount: string
  fiat_currency: string
  fiat_fees: string
  chain: string
  payment_methods: string[]
  url: string
}

export interface SellQuote extends BuyQuote {
  network_fee?: string
  network_fee_fiat?: string
}


export interface FetchBuyQuotesParams {
  address: string
  fiatCurrency: string
  amount: string
  cryptoCurrency: string
  chain: string
  iso?: string
}

export interface FetchSellQuoteParams {
  address: string
  fiatCurrency: string
  amount: string
  cryptoCurrency: string
  chain: string
}
