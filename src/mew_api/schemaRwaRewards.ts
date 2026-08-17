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
  /**
   * Remaining payout budget for this platform's budget group (web has its own).
   * False once the season is full: existing entries are still shown and still
   * claimable, but no new trade can be registered. A wallet with no entries of
   * its own never sees this — `/info` answers 404 for it instead.
   */
  is_available?: boolean
  /**
   * True when the wallet is on the ban list but has entries, so it gets a normal
   * 200 instead of a 403. Its status is under review and claims will not pay.
   */
  under_review?: boolean
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
  /**
   * On the ban list but holding entries, so the backend returns them flagged
   * rather than hiding the program. Distinct from `banned`: the wallet still
   * sees its own progress while its status is reviewed.
   */
  | 'underReview'
  | 'notEligible'
  | 'temporarilyPaused'
  /** Season payout budget spent — entries run on, no new ones are accepted. */
  | 'campaignFull'
  | 'campaignEnded'

/**
 * Why the season is refusing new entries, as reported by `/info` and
 * `/register`. Kept separate from the per-wallet buckets so a wallet that
 * already holds an entry still sees its own progress.
 */
export type RwaAccessBlock =
  /** 404 — out of budget for this platform group and no entries of our own. */
  | 'campaignFull'
  /** 423 — register/info kill-switch. */
  | 'temporarilyPaused'
  /** 403 — restricted region, or banned with no entries. */
  | 'notEligible'

/**
 * The claim payload that gets JSON-stringified, base64-encoded into
 * `transaction`, and signed. For web only `uuid` + `platform` are required;
 * the device/integrity fields are mobile-only.
 */
export interface RwaClaimPayload {
  uuid: string
  platform: 'ios' | 'android' | 'web'
  device_token?: string
  integrity_token?: string
  nonce?: string
  version?: string
}

export interface RwaClaimReward {
  status: 'SUBMITTED' | 'FAILED' | 'PENDING'
  chain: string
  to: string
  hash: string | null
  nonce: number
  attempts: number
  submitted_timestamp: string
  error: string | null
}

export interface RwaClaimDetail {
  status: string
  claimed_timestamp: string
  signer: string
  wallet_id: string
  reward: RwaClaimReward
}

/**
 * Response of `POST /rwa-rewards/:seasonId/claim`. Same buckets as
 * `RwaInfoResponse` (recomputed across the whole wallet) plus confirmation
 * fields.
 */
export interface RwaClaimResponse extends RwaInfoResponse {
  msg: string
  uuid: string
  claim: RwaClaimDetail
}

/** Reasons a claim can fail — mapped to i18n keys under `rwaRewards.claim_errors`. */
export type RwaClaimErrorKey =
  | 'walletMissing'
  | 'wrongAddress'
  | 'signatureFailed'
  | 'restricted'
  | 'notClaimable'
  | 'platformMismatch'
  | 'alreadyClaimed'
  | 'windowClosed'
  | 'invalidRequest'
  | 'locked'
  | 'generic'

export type RwaClaimResult =
  | { success: true; response: RwaClaimResponse }
  | { success: false; errorKey: RwaClaimErrorKey }
