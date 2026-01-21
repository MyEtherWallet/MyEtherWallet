export interface PurchaseAsset {
  chain: string
  symbol: string
  name: string
  coingecko_id: string
  contract_address: string
  providers: string[]
  is_sell_supported: boolean
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
