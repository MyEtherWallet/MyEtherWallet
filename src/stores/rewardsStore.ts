import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { mainnet, bsc } from 'viem/chains'
import type { components } from '@/mew_api/schemaRewards'
import Configs from '@/configs'
import i18n from '@/i18n'
import { ToastType } from '@/types/notification'
import { useWalletStore } from './walletStore'
import { useChainsStore } from './chainsStore'
import { useToastStore } from './toastStore'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
  type TradeRewardClaimState,
} from './tradeOrdersStore'
import { analytics, RewardsEvent } from '@/analytics'

type RewardsPool = components['schemas']['RewardsPool']
type Eligibility = components['schemas']['Eligibility']
type IneligibilityReason = components['schemas']['IneligibilityReason']
type Reward = components['schemas']['Reward']
type RewardStatus = components['schemas']['RewardStatus']
type RewardsNetwork = components['schemas']['Network']
type ClaimFailReason = components['schemas']['ClaimFailReason']
type ClaimError = components['schemas']['ClaimError']
type ApiError = components['schemas']['Error']
type GetAddressRewardsResponse =
  components['schemas']['GetAddressRewardsResponse']

export type { Reward, RewardStatus, IneligibilityReason, ClaimFailReason }

/**
 * Why a claim did not go through. Backend reasons come straight from
 * `ClaimFailReason`; the rest are client-side outcomes.
 */
export type TradeRewardClaimResult =
  | { ok: true; duplicate?: boolean }
  | {
      ok: false
      reason: ClaimFailReason | 'UNSUPPORTED_NETWORK' | 'REQUEST_FAILED'
      /** True when the claim may be retried later (transport / 5xx). */
      retryable: boolean
    }

const REWARDS_BASE_URL = Configs.MEW_REWARDS_API_URL

/** Chains the rewards API pays out on, keyed by chain id. */
const REWARDS_NETWORK_BY_CHAIN_ID: Record<number, RewardsNetwork> = {
  [mainnet.id]: 'ETH',
  [bsc.id]: 'BSC',
}

export const rewardsNetworkForChain = (
  chainId: number | string,
): RewardsNetwork | null => REWARDS_NETWORK_BY_CHAIN_ID[Number(chainId)] ?? null

/** Reward statuses the backend will not move out of. */
const TERMINAL_REWARD_STATUSES: readonly RewardStatus[] = [
  'REWARDED',
  'REJECTED',
  'ERRORED',
  'EXPIRED',
  'FAILED',
  'REVOKED',
]
const isTerminalStatus = (status: RewardStatus) =>
  TERMINAL_REWARD_STATUSES.includes(status)

/** Claim rejections the user can act on, so they get a toast; the rest are logged only. */
const USER_FACING_CLAIM_REASONS: readonly ClaimFailReason[] = [
  'REWARD_EXPIRED',
  'MAKER_INELIGIBLE',
  'SPEND_TOO_LOW',
  'REWARDS_DEACTIVATED',
]

/** Only a recently filled order is worth a late claim — anything older is expired server-side anyway. */
const LATE_CLAIM_WINDOW_MS = 3 * 24 * 60 * 60 * 1000

const POOL_POLL_INTERVAL_MS = 60_000
const REWARD_STATUS_POLL_INTERVAL_MS = 15_000
/** ~10 minutes of status polling after a claim; `fetchUserRewards` reconciles anything slower. */
const REWARD_STATUS_POLL_MAX_ATTEMPTS = 40

export class RewardsApiError extends Error {
  readonly status: number
  readonly body: unknown
  constructor(status: number, body: unknown, message: string) {
    super(message)
    this.name = 'RewardsApiError'
    this.status = status
    this.body = body
  }
}

const apiErrorMessage = (body: unknown): string | null => {
  const err = (body as Partial<ApiError> | null)?.error
  return err && typeof err.message === 'string' ? err.message : null
}

const claimFailReason = (body: unknown): ClaimFailReason | null => {
  const err = (body as Partial<ClaimError> | null)?.error
  return err && typeof err.reason === 'string' ? err.reason : null
}

const fetchRewards = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${REWARDS_BASE_URL}${path}`, {
    mode: 'cors',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
  })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    throw new RewardsApiError(
      response.status,
      body,
      apiErrorMessage(body) ??
        `Rewards API request failed (${response.status})`,
    )
  }
  return body as T
}

export const useRewardsStore = defineStore('rewardsStore', () => {
  const walletStore = useWalletStore()
  const { walletAddress } = storeToRefs(walletStore)
  const chainsStore = useChainsStore()
  const { isBitcoinChain } = storeToRefs(chainsStore)
  const toastStore = useToastStore()
  const tradeOrdersStore = useTradeOrdersStore()

  const t = (key: string, params?: Record<string, unknown>) =>
    i18n.global.t(key, params ?? {})

  /** ------------------------------------------------------------------
   * "Earned potential reward" badge
   *
   * Tracks addresses that just placed a qualifying trade so the badge shows
   * immediately, without waiting for the backend to process the claim.
   * ------------------------------------------------------------------ */
  const earnedPotentialRewardAddresses = ref<string[]>([])

  const earnedPotentialReward = computed(() => {
    if (isBitcoinChain.value) return false
    if (!walletAddress.value) return false
    return earnedPotentialRewardAddresses.value.includes(walletAddress.value)
  })

  const setEarnedPotentialReward = (earned: boolean) => {
    if (earned && walletAddress.value) {
      if (!earnedPotentialRewardAddresses.value.includes(walletAddress.value)) {
        earnedPotentialRewardAddresses.value.push(walletAddress.value)
      }
    } else {
      earnedPotentialRewardAddresses.value =
        earnedPotentialRewardAddresses.value.filter(
          a => a !== walletAddress.value,
        )
    }
  }

  const pool = ref<RewardsPool | null>(null)
  const eligibility = ref<Eligibility | null>(null)
  const rewards = ref<Reward[]>([])
  const isLoadingPool = ref(false)
  const isLoadingEligibility = ref(false)
  const isLoadingRewards = ref(false)
  const hadInitialLoad = ref(false)

  /** ------------------------------------------------------------------
   * Pool — one global counter for the campaign (`total` / `remaining`).
   * ------------------------------------------------------------------ */
  const toCount = (value: string | undefined): number | null => {
    if (value == null) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  const tradeTotal = computed(() => toCount(pool.value?.total))
  const tradeRemainingCount = computed(() => toCount(pool.value?.remaining))
  const tradeRemainingPct = computed(() => {
    const total = tradeTotal.value
    const remaining = tradeRemainingCount.value
    if (!total || remaining == null) return 100
    return Math.round((remaining / total) * 100)
  })
  const isPoolOpen = computed(() => (tradeRemainingCount.value ?? 0) > 0)

  const fetchPool = async () => {
    if (isBitcoinChain.value) return
    isLoadingPool.value = true
    try {
      pool.value = await fetchRewards<RewardsPool>('/v1/rewards/pool')
    } catch (error) {
      console.error('Failed to fetch reward pool status:', error)
    } finally {
      isLoadingPool.value = false
    }
  }

  /** Keep the "rewards left" counter fresh while there is anything left to show. */
  let poolPollInterval: ReturnType<typeof setInterval> | null = null

  const stopPoolPoll = () => {
    if (poolPollInterval) {
      clearInterval(poolPollInterval)
      poolPollInterval = null
    }
  }

  const startPoolPoll = () => {
    stopPoolPoll()
    if (!isPoolOpen.value) return
    poolPollInterval = setInterval(async () => {
      await fetchPool()
      if (!isPoolOpen.value) {
        stopPoolPoll()
        fetchEligibility()
      }
    }, POOL_POLL_INTERVAL_MS)
  }

  /** ------------------------------------------------------------------
   * Eligibility — a single verdict for the address plus reason codes.
   * ------------------------------------------------------------------ */
  const eligibilityReasons = computed<IneligibilityReason[]>(
    () => eligibility.value?.reasons ?? [],
  )
  const hasReason = (reason: IneligibilityReason) =>
    eligibilityReasons.value.includes(reason)

  const isEligible = computed(() => eligibility.value?.eligible ?? false)
  /** This wallet already got its one reward for the campaign. */
  const tradeClaimed = computed(() => hasReason('ALREADY_GRANTED'))
  /** The campaign budget is spent. */
  const tradeNoRewards = computed(
    () =>
      hasReason('ALL_REWARDS_GRANTED') ||
      (pool.value !== null && !isPoolOpen.value),
  )
  /** The backend has switched rewards off. */
  const isRewardsPaused = computed(() => hasReason('DEACTIVATED'))
  /** The address's balance history is still being indexed; eligibility is not known yet. */
  const isSyncing = computed(
    () => hasReason('NO_SNAPSHOTS') || hasReason('SYNCING'),
  )
  /** Below the minimum holding the campaign requires. */
  const isBalanceTooLow = computed(
    () => hasReason('NO_BALANCE') || hasReason('BALANCE_TOO_LOW'),
  )
  const isBanned = computed(() => hasReason('BLOCKLISTED'))

  const fetchEligibility = async () => {
    if (!walletAddress.value || isBitcoinChain.value) return
    isLoadingEligibility.value = true
    try {
      const result = await fetchRewards<Eligibility>(
        `/v1/addresses/${walletAddress.value}/eligibility`,
      )
      eligibility.value = result
      analytics.setUserProperties({
        canClaimRewards: result.eligible,
        canClaimTrade: result.eligible,
      })
    } catch (error) {
      console.error('Failed to fetch reward eligibility:', error)
    } finally {
      isLoadingEligibility.value = false
    }
  }

  const canClaimTradeReward = computed(() => {
    if (isBitcoinChain.value) return false
    return isEligible.value
  })
  const canClaimReward = canClaimTradeReward

  const minSpendTrade = computed(() =>
    Math.ceil(Configs.MEW_REWARDS_MIN_SPEND_USD).toString(),
  )

  /**
   * Called right after a trade order is submitted: refresh eligibility and, if
   * the wallet can still earn, flag the badge straight away rather than
   * waiting for the claim to be processed.
   */
  const checkAvailabilityAfterTransaction = async () => {
    await fetchEligibility()
    if (canClaimTradeReward.value) {
      setEarnedPotentialReward(true)
      return true
    }
    return false
  }

  /** ------------------------------------------------------------------
   * User rewards
   * ------------------------------------------------------------------ */
  const hasRewards = computed(() => rewards.value.length > 0)
  const pendingRewards = computed(() =>
    rewards.value.filter(r => !isTerminalStatus(r.status)),
  )
  const rewardedRewards = computed(() =>
    rewards.value.filter(r => r.status === 'REWARDED'),
  )

  const fetchUserRewards = async () => {
    if (!walletAddress.value || isBitcoinChain.value) return
    isLoadingRewards.value = true
    try {
      const result = await fetchRewards<GetAddressRewardsResponse>(
        `/v1/addresses/${walletAddress.value}/rewards?limit=10`,
      )
      rewards.value = result.items
    } catch (error) {
      console.error('Failed to fetch user rewards:', error)
    } finally {
      isLoadingRewards.value = false
    }
  }

  const fetchRewardByOrder = async (
    orderHash: string,
  ): Promise<Reward | null> => {
    try {
      return await fetchRewards<Reward>(`/v1/rewards/orders/${orderHash}`)
    } catch (error) {
      if (error instanceof RewardsApiError && error.status === 404) return null
      console.error('Failed to fetch reward for order:', error)
      return null
    }
  }

  /** ------------------------------------------------------------------
   * Claims
   *
   * A reward is requested per filled 1inch order. The backend validates the
   * order, the spend and the maker, then pays out asynchronously; the claim
   * state is persisted on the saved order so it survives reloads.
   * ------------------------------------------------------------------ */
  const setClaimState = (
    order: Pick<SavedTradeOrder, 'hash' | 'fromAddress'>,
    state: Omit<TradeRewardClaimState, 'updatedAt'>,
  ) => {
    tradeOrdersStore.updateOrder(order.fromAddress, order.hash, {
      tradeRewardClaim: { ...state, updatedAt: Date.now() },
    })
  }

  const claimReasonText = (reason: ClaimFailReason): string | undefined =>
    USER_FACING_CLAIM_REASONS.includes(reason)
      ? t(`rewards.claim_reason.${reason}`)
      : undefined

  const onRewarded = (order: Pick<SavedTradeOrder, 'hash' | 'fromAddress'>) => {
    setClaimState(order, { status: 'rewarded' })
    toastStore.toggleRewardToast(true)
    analytics.trackRewardsEvent(RewardsEvent.REWARD_EARNED, { type: 'trade' })
    analytics.setUserProperties({
      canClaimRewards: false,
      canClaimTrade: false,
    })
    setEarnedPotentialReward(false)
    fetchEligibility()
    fetchUserRewards()
  }

  const onClaimSettled = (
    order: Pick<SavedTradeOrder, 'hash' | 'fromAddress'>,
    status: RewardStatus,
  ) => {
    if (status === 'REWARDED') {
      onRewarded(order)
      return
    }
    setClaimState(order, { status: 'rejected', reason: status })
    setEarnedPotentialReward(false)
    fetchEligibility()
  }

  /** Follow a requested claim until the backend settles it. */
  const rewardStatusPolls = new Map<string, ReturnType<typeof setInterval>>()

  const stopRewardStatusPoll = (orderHash: string) => {
    const timer = rewardStatusPolls.get(orderHash)
    if (timer) {
      clearInterval(timer)
      rewardStatusPolls.delete(orderHash)
    }
  }

  const startRewardStatusPoll = (
    order: Pick<SavedTradeOrder, 'hash' | 'fromAddress'>,
  ) => {
    if (rewardStatusPolls.has(order.hash)) return
    let attempts = 0
    const timer = setInterval(async () => {
      attempts += 1
      const reward = await fetchRewardByOrder(order.hash)
      if (reward && isTerminalStatus(reward.status)) {
        stopRewardStatusPoll(order.hash)
        onClaimSettled(order, reward.status)
        return
      }
      if (attempts >= REWARD_STATUS_POLL_MAX_ATTEMPTS) {
        stopRewardStatusPoll(order.hash)
      }
    }, REWARD_STATUS_POLL_INTERVAL_MS)
    rewardStatusPolls.set(order.hash, timer)
  }

  const claimTradeReward = async (
    order: SavedTradeOrder,
  ): Promise<TradeRewardClaimResult> => {
    const existing = order.tradeRewardClaim
    if (existing && existing.status !== 'failed') {
      if (existing.status === 'requested') startRewardStatusPoll(order)
      return existing.status === 'rejected'
        ? {
            ok: false,
            reason: (existing.reason as ClaimFailReason) ?? 'REQUEST_FAILED',
            retryable: false,
          }
        : { ok: true, duplicate: true }
    }

    // A trade under the campaign minimum can never earn, so don't ask the
    // backend about it. Only a known-too-low value is gated: an order saved
    // without a USD value is still sent, and the backend decides (`SPEND_TOO_LOW`).
    const usdValue = Number(order.usdValue)
    if (
      Number.isFinite(usdValue) &&
      usdValue < Configs.MEW_REWARDS_MIN_SPEND_USD
    ) {
      setClaimState(order, { status: 'rejected', reason: 'SPEND_TOO_LOW' })
      return { ok: false, reason: 'SPEND_TOO_LOW', retryable: false }
    }

    const network = rewardsNetworkForChain(order.chainId)
    if (!network) {
      setClaimState(order, {
        status: 'rejected',
        reason: 'UNSUPPORTED_NETWORK',
      })
      return { ok: false, reason: 'UNSUPPORTED_NETWORK', retryable: false }
    }

    try {
      await fetchRewards(
        `/v1/rewards/networks/${network}/orders/${order.hash}`,
        {
          method: 'POST',
        },
      )
    } catch (error) {
      if (error instanceof RewardsApiError) {
        // Already claimed (another tab or device): treat as ours and follow it.
        if (error.status === 409) {
          setClaimState(order, { status: 'requested' })
          startRewardStatusPoll(order)
          return { ok: true, duplicate: true }
        }
        if (error.status === 422) {
          const reason = claimFailReason(error.body) ?? 'ORDER_INVALID_DATA'
          setClaimState(order, { status: 'rejected', reason })
          setEarnedPotentialReward(false)
          const detail = claimReasonText(reason)
          if (detail) {
            toastStore.addToastMessage({
              text: t('rewards.claim_rejected'),
              textSecondary: detail,
              type: ToastType.Info,
            })
          }
          fetchEligibility()
          return { ok: false, reason, retryable: false }
        }
      }
      console.error('Failed to claim trade reward:', error)
      setClaimState(order, { status: 'failed' })
      return { ok: false, reason: 'REQUEST_FAILED', retryable: true }
    }

    setClaimState(order, { status: 'requested' })
    toastStore.addToastMessage({
      text: t('rewards.claim_requested'),
      type: ToastType.Success,
    })
    startRewardStatusPoll(order)
    fetchPool()
    return { ok: true }
  }

  /**
   * Claim for filled orders that never got one — an order can fill while the
   * app is closed, or a claim can fail on a flaky connection. Bounded to
   * recent orders so stale history is not re-submitted on every load.
   */
  const claimUnclaimedFilledOrders = async (address: string) => {
    if (isBitcoinChain.value) return
    const cutoff = Date.now() - LATE_CLAIM_WINDOW_MS
    const candidates = tradeOrdersStore
      .getOrdersByAddress(address)
      .filter(
        o =>
          o.status === 'filled' &&
          o.createdAt * 1000 >= cutoff &&
          (!o.tradeRewardClaim || o.tradeRewardClaim.status === 'failed'),
      )
    for (const order of candidates) {
      await claimTradeReward(order)
    }
  }

  /**
   * Reconcile the backend's reward list with the claims we hold: a payout that
   * landed while the status poll was not running still gets its toast and
   * analytics once, and anything the backend settled against us is recorded.
   */
  const checkRewards = () => {
    if (!walletAddress.value) return
    const byHash = new Map(rewards.value.map(r => [r.orderHash, r]))
    tradeOrdersStore
      .getOrdersByAddress(walletAddress.value)
      .filter(o => o.tradeRewardClaim?.status === 'requested')
      .forEach(order => {
        const reward = byHash.get(order.hash.toLowerCase())
        if (!reward || !isTerminalStatus(reward.status)) return
        stopRewardStatusPoll(order.hash)
        onClaimSettled(order, reward.status)
      })

    if (tradeClaimed.value) {
      analytics.setUserProperties({ canClaimRewards: false })
    }
  }

  /** Watch wallet address changes and refetch */
  watch(walletAddress, newAddress => {
    rewardStatusPolls.forEach((_, hash) => stopRewardStatusPoll(hash))
    if (newAddress && !isBitcoinChain.value) {
      fetchEligibility()
      fetchUserRewards()
    } else {
      eligibility.value = null
      rewards.value = []
    }
  })

  watch(
    () => isEligible.value,
    eligible => {
      if (!eligible) setEarnedPotentialReward(false)
    },
    { immediate: true },
  )

  const fetchAll = async () => {
    await Promise.all([fetchPool(), fetchEligibility(), fetchUserRewards()])
    hadInitialLoad.value = true
    checkRewards()
    startPoolPoll()
  }

  const isLoading = computed(
    () =>
      isLoadingEligibility.value ||
      isLoadingRewards.value ||
      isLoadingPool.value,
  )

  return {
    // Pool
    pool,
    isPoolOpen,
    tradeTotal,
    tradeRemainingCount,
    tradeRemainingPct,
    isLoadingPool,
    fetchPool,
    // Eligibility
    eligibility,
    eligibilityReasons,
    isEligible,
    tradeClaimed,
    tradeNoRewards,
    isRewardsPaused,
    isSyncing,
    isBalanceTooLow,
    isBanned,
    isLoadingEligibility,
    fetchEligibility,
    checkAvailabilityAfterTransaction,
    canClaimReward,
    canClaimTradeReward,
    minSpendTrade,
    // User rewards
    rewards,
    hasRewards,
    pendingRewards,
    rewardedRewards,
    isLoadingRewards,
    fetchUserRewards,
    fetchRewardByOrder,
    checkRewards,
    // Claims
    claimTradeReward,
    claimUnclaimedFilledOrders,
    // Earned Potential Reward badge
    earnedPotentialRewardAddresses,
    earnedPotentialReward,
    setEarnedPotentialReward,
    // Other
    fetchAll,
    isLoading,
    hadInitialLoad,
  }
})
