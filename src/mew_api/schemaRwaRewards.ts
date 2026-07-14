export interface RwaRewardItem {
  uuid: string
  id: string
  season: string
  address: string
  chain_id: number
  contract_address: string
  timestamp: string
  start_timestamp: string
  initial_timestamp: string
  qualification_timestamp: string
  expiration_timestamp?: string
  value: string
  current_amount: string
  original_amount: string
  qualifying_amount: string
  is_qualified: boolean
  is_disqualified: boolean
}

export interface RwaBuckets {
  qualified: RwaRewardItem[]
  disqualified: RwaRewardItem[]
  claimed: RwaRewardItem[]
  pending: RwaRewardItem[]
}

export interface RwaCheckResponse extends RwaBuckets {
  address: string
}

export interface RwaRewardMeta {
  id: string
  name: string
  symbol: string
  icon: string
  crypto: {
    ids: string[]
    decimals: number[]
    price: string
    market_data: { change: string }
  }
}

export interface RwaSeasonInfo {
  now: string
  end: string
  rewards: { id: string; amount: string }[]
  qualification_value: string
  is_available?: boolean
}

export interface RwaInfoResponse extends RwaBuckets {
  info: RwaSeasonInfo
  metas?: RwaRewardMeta[]
}

export type RwaStatus =
  | 'default'
  | 'holding'
  | 'earned'
  | 'claimed'
  | 'lost'
  | 'expired'
  | 'banned'
  | 'notEligible'
  | 'temporarilyPaused'
  | 'campaignEnded'