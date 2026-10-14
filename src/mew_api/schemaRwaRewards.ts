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
  /** 1 or 2. Missing on season-1 entries — treat as round 1. */
  round?: number
  /** Round-2 entries only: the claimed round-1 entry this one continues. */
  parent_uuid?: string
  /**
   * Pending entry whose balance check failed but is still inside the
   * confirmation debounce. Stays in `pending` with `is_disqualified: false`
   * and a `disqualified_reason` — not disqualified yet.
   */
  dq_unconfirmed?: boolean
  disqualified_reason?: string
  disqualified_timestamp?: string
  /** Set on claimed entries ('CLAIMED'). */
  status?: string
  claim?: RwaClaimDetail
  /**
   * Marker on the claimed round-1 entry: the round-2 entry it spawned, or why
   * it couldn't be opened. Informational — render from the response's
   * top-level `round2` summary instead.
   */
  round2?: {
    uuid?: string
    spawned_timestamp?: string
    skipped?: string
    skipped_timestamp?: string
  }
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

/** One reward denomination: hex amount in the token's smallest unit. */
export interface RwaRewardDenomination {
  id: string
  amount: string
}

export interface RwaSeasonInfo {
  now: string
  end: string
  season?: string
  rewards: RwaRewardDenomination[]
  qualification_value: string
  /** Number of reward rounds this season pays: 2 for season2, 1 for season1. */
  rounds?: number
  /** Round-2 configuration — present only on seasons with a second round. */
  round2?: {
    /** Hold length after the round-1 claim before round 2 qualifies. */
    days_to_hold: number
    /** How long round 2 stays claimable after qualifying (rolling per user). */
    days_to_claim: number
    /**
     * Round-2 reward per chain. Not final and may differ from round 1 —
     * always render from here, never assume it equals `rewards`.
     */
    rewards: RwaRewardDenomination[]
  }
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

/**
 * State of the second reward round. Authoritative for round-2 rendering —
 * the UI must read it rather than deriving the round from the buckets.
 * Terminal (no retry, no round 3): UNAVAILABLE, EXPIRED, CLAIMED, DISQUALIFIED.
 */
export type RwaRound2State =
  /** Round 1 not claimed yet — nothing to show for round 2. */
  | 'NOT_ELIGIBLE'
  /** Round 1 claimed, round-2 entry still being opened (background repair, ≤6h). */
  | 'ELIGIBLE'
  /** Round 1 claimed but the season pool was exhausted — no second round. */
  | 'UNAVAILABLE'
  /** Round-2 entry exists, hold in progress. */
  | 'PENDING'
  /** Hold complete — claimable until `expiration_timestamp`. */
  | 'QUALIFIED'
  /** Qualified but not claimed in time. */
  | 'EXPIRED'
  /** Round 2 paid. `complete` is true; nothing follows. */
  | 'CLAIMED'
  /** Sold / dropped below the qualifying amount during the round-2 hold. */
  | 'DISQUALIFIED'

/** Top-level `round2` summary on season-2 info/claim responses. */
export interface RwaRound2Summary {
  /** True once the wallet has a claimed round-1 entry. */
  eligible: boolean
  status: RwaRound2State
  /** True only when round 2 has been claimed. */
  complete: boolean
  /** The round-2 entry's uuid — the uuid signed to claim round 2. */
  uuid?: string
  /** The round-1 entry it continues from. */
  parent_uuid?: string
  /** When the round-2 hold began (= the round-1 claim time). */
  start_timestamp?: string
  /** When the hold completes — the countdown target while PENDING. */
  qualification_timestamp?: string
  /** Claim deadline, present once QUALIFIED. Rolling per user. */
  expiration_timestamp?: string
  /** Only with UNAVAILABLE. Currently always 'BUDGET'. */
  unavailable_reason?: string
}

export interface RwaInfoResponse extends RwaBuckets {
  info: RwaSeasonInfo
  metas?: RwaRewardMeta[]
  /** Absent on season-1 responses and on addressless campaign loads. */
  round2?: RwaRound2Summary
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
  /** Which round this payout is for. */
  round?: number
  from?: string
  token?: string
  chainId?: number
  /** Hex amount in the token's smallest unit. */
  amount?: string
}

export interface RwaClaimDetail {
  status: string
  claimed_timestamp: string
  signer: string
  wallet_id: string
  /** Which round this claim paid. */
  round?: number
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
