import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { components } from '@/mew_api/schemaRewards'
import Configs from '@/configs'
import { useWalletStore } from './walletStore'
import { useChainsStore } from './chainsStore'
// import { useToastStore } from './toastStore'
import { analytics, RewardsEvent } from '@/analytics'
import useBalanceHandler from '@/utils/balanceHandler'
import type { TokenBalancesRaw } from '@/mew_api/types'

type V2PoolStatusResponse = components['schemas']['V2PoolStatusResponse']
type V2EligibilityResponse = components['schemas']['V2EligibilityResponse']
type V2RewardItem = components['schemas']['V2RewardItem']

const REWARDS_BASE_URL = Configs.MEW_REWARDS_API_URL

const fetchRewards = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${REWARDS_BASE_URL}${url}`, {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Rewards API fetch failed')
  }
  return (await response.json()) as T
}

export const useRewardsStore = defineStore('rewardsStore', () => {
  const walletStore = useWalletStore()
  const { walletAddress, wallet } = storeToRefs(walletStore)
  const { setTokens, setIsLoadingBalances } = walletStore
  const chainsStore = useChainsStore()
  const { isBitcoinChain } = storeToRefs(chainsStore)
  const earnedPotentialRewardAddresses = ref<string[]>([]) // to track if user has earned a potential reward in the current eligibility period. This is needed to show the "Earned Potential Reward" badge immediately after user becomes eligible, without waiting for the next eligibility fetch.

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

  const poolV2 = ref<V2PoolStatusResponse | null>(null)
  const eligibilityV2 = ref<V2EligibilityResponse | null>(null)
  const rewards = ref<V2RewardItem[]>([])
  const isLoadingPool = ref(false)
  const isLoadingEligibility = ref(false)
  const isLoadingRewards = ref(false)
  const hadInitialLoad = ref(false)

  /** Pool */
  const isPoolOpen = computed(() => poolV2.value?.open ?? false)
  const rewardsLeft = computed(
    () =>
      poolV2.value?.swap.hourlyRemainingRewardCount ??
      poolV2.value?.trade.hourlyRemainingRewardCount ??
      '0',
  )
  const nextHourStart = computed(() => poolV2.value?.nextHourStart ?? null)
  const poolReasons = computed(() => poolV2.value?.reasons ?? [])
  const swapPool = computed(() => poolV2.value?.swap ?? null)
  const tradePool = computed(() => poolV2.value?.trade ?? null)

  const fetchPool = async () => {
    if (isBitcoinChain.value) return
    isLoadingPool.value = true
    try {
      const v2Result =
        await fetchRewards<V2PoolStatusResponse>('/v2/rewards/pool')
      poolV2.value = v2Result
    } catch (error) {
      console.error('Failed to fetch reward pool status:', error)
    } finally {
      isLoadingPool.value = false
    }
  }

  /** Poll pool status every 15s until rewards left reaches 0 */
  let poolPollInterval: ReturnType<typeof setInterval> | null = null

  const stopPoolPoll = () => {
    if (poolPollInterval) {
      clearInterval(poolPollInterval)
      poolPollInterval = null
    }
  }

  const startPoolPoll = () => {
    stopPoolPoll()
    if (Number(rewardsLeft.value) <= 0) return
    poolPollInterval = setInterval(async () => {
      await fetchPool()
      if (Number(rewardsLeft.value) <= 0) {
        stopPoolPoll()
        setTimeout(() => fetchEligibility(), 20000)
      }
    }, 5000)
  }

  /** Schedule a pool fetch + restart polling at the beginning of each hour */
  let hourResetTimeout: ReturnType<typeof setTimeout> | null = null

  const scheduleHourReset = () => {
    if (hourResetTimeout) clearTimeout(hourResetTimeout)
    const target = nextHourStart.value
    if (!target) return
    const delay = Math.max(0, new Date(target).getTime() - Date.now())
    hourResetTimeout = setTimeout(async () => {
      fetchEligibility()
      fetchUserRewards()
      await fetchPool()
      startPoolPoll()
      scheduleHourReset()
    }, delay)
  }

  /** Eligibility */
  const isEligible = computed(() => {
    return eligibilityV2.value
      ? eligibilityV2.value.swap.eligible || eligibilityV2.value.trade.eligible
      : false
  })
  const nextEligibleDate = computed(
    () =>
      eligibilityV2.value?.swap.nextEligibleDate ??
      eligibilityV2.value?.trade.nextEligibleDate ??
      false,
  )
  const eligibilityReasons = computed(
    () =>
      eligibilityV2.value?.swap.reasons ??
      eligibilityV2.value?.trade.reasons ??
      [],
  )

  const fetchEligibility = async () => {
    if (!walletAddress.value || isBitcoinChain.value) return
    isLoadingEligibility.value = true
    try {
      const result = await fetchRewards<V2EligibilityResponse>(
        `/v2/addresses/${walletAddress.value}/rewards/eligibility`,
      )
      eligibilityV2.value = result
      const eligible = result?.swap.eligible ?? result?.trade.eligible ?? false
      analytics.setUserProperties({
        canClaimRewards: eligible,
        canClaimSwap: result?.trade.eligible,
        canClaimTrade: result?.swap.eligible,
      })
    } catch (error) {
      console.error('Failed to fetch reward eligibility:', error)
    } finally {
      isLoadingEligibility.value = false
    }
  }

  const swapNoRewards = computed(
    () =>
      !swapPool.value?.open || swapPool.value?.hourlyRemainingRewardCount === 0,
  )
  const tradeNoRewards = computed(
    () =>
      !tradePool.value?.open ||
      tradePool.value?.hourlyRemainingRewardCount === 0,
  )

  const tradeMarketClosed = computed(
    () =>
      tradePool.value?.reasons.some(r => r.type === 'TRADE_REWARDS_DISABLED') ??
      false,
  )

  const swapTotal = computed(() => {
    const p = swapPool.value
    if (!p || p.hourlyRemainingRewardCount === null) return null
    return p.hourlyRewardCount + p.hourlyRemainingRewardCount
  })

  const swapRemainingPct = computed(() => {
    const p = swapPool.value
    const total = swapTotal.value
    if (!p || p.hourlyRemainingRewardCount === null || !total) return 100
    return Math.round((p.hourlyRemainingRewardCount / total) * 100)
  })

  const swapRemainingCount = computed(
    () => swapPool.value?.hourlyRemainingRewardCount ?? null,
  )

  const tradeTotal = computed(() => {
    const p = tradePool.value
    if (!p || p.hourlyRemainingRewardCount === null) return null
    return p.hourlyRewardCount + p.hourlyRemainingRewardCount
  })

  const tradeRemainingPct = computed(() => {
    const p = tradePool.value
    const total = tradeTotal.value
    if (!p || p.hourlyRemainingRewardCount === null || !total) return 100
    return Math.round((p.hourlyRemainingRewardCount / total) * 100)
  })

  const tradeRemainingCount = computed(
    () => tradePool.value?.hourlyRemainingRewardCount ?? null,
  )

  const checkAvailabilityAfterTransaction = async (type: 'swap' | 'trade') => {
    // This function can be called after a transaction to check if user has earned a potential reward, and if so, set the badge immediately without waiting for the next eligibility fetch
    if (
      eligibilityV2.value === null ||
      (eligibilityV2.value.swap.eligible ?? eligibilityV2.value.trade.eligible)
    ) {
      await fetchEligibility()
      if (
        eligibilityV2.value?.swap.eligible ||
        eligibilityV2.value?.trade.eligible
      ) {
        earnedPotentialRewardAddresses.value.push(walletAddress.value!)
        return eligibilityV2.value[type].eligible
      }
    }
    return false
  }

  /** User Rewards */
  const swapClaimed = computed(() => {
    return eligibilityV2.value ? !eligibilityV2.value.swap.eligible && eligibilityV2.value?.swap.reasons.some(
      r => r.type === 'USER_RECENTLY_REWARDED',
    ) : null
  })
  const tradeClaimed = computed(() => {
    return eligibilityV2.value ? !eligibilityV2.value.trade.eligible && eligibilityV2.value?.trade.reasons.some(
      r => r.type === 'USER_RECENTLY_REWARDED',
    ) : null
  })

  const hasRewards = computed(() => rewards.value.length > 0)

  const fetchUserRewards = async () => {
    if (!walletAddress.value || isBitcoinChain.value) return
    isLoadingRewards.value = true
    try {
      rewards.value = await fetchRewards<V2RewardItem[]>(
        `/v2/addresses/${walletAddress.value}/rewards`,
      )
    } catch (error) {
      console.error('Failed to fetch user rewards:', error)
    } finally {
      isLoadingRewards.value = false
    }
  }

  /** Watch wallet address changes and refetch */
  watch(walletAddress, newAddress => {
    if (newAddress && !isBitcoinChain.value) {
      fetchEligibility()
      fetchUserRewards()
    } else {
      eligibilityV2.value = null
      rewards.value = []
    }
  })

  /** Poll rewards when eligible until today's reward is found */
  let rewardsPollInterval: ReturnType<typeof setInterval> | null = null

  const isRewardEarnedDuringCampaign = (reward: V2RewardItem): boolean => {
    if (!poolV2.value) return false
    const CAMPAIGN_START = new Date(poolV2.value.campaignStartDate)
    const CAMPAIGN_END = new Date(
      new Date(poolV2.value.campaignEndDate)
    )
    if (!reward.rewardBroadcastAt) return false
    const rewardDate = new Date(reward.rewardBroadcastAt)
    return rewardDate >= CAMPAIGN_START && rewardDate < CAMPAIGN_END
  }

  const stopRewardsPoll = () => {
    if (rewardsPollInterval) {
      clearInterval(rewardsPollInterval)
      rewardsPollInterval = null
    }
  }

  const startRewardsPoll = () => {
    stopRewardsPoll()
    rewardsPollInterval = setInterval(async () => {
      await fetchUserRewards()
      const _rewards = rewards.value.slice(0, 2)
      if (_rewards.length === 0) return
      _rewards.forEach(r => {
        if (
          r.swapType === 'SWAP' &&
          isRewardEarnedDuringCampaign(r)
        ) {
          analytics.trackRewardsEvent(RewardsEvent.REWARD_EARNED, {
            type: 'swap',
          })
          wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
            useBalanceHandler(balances, setTokens, setIsLoadingBalances)
          })
        } else if (
          r.swapType === 'TRADE' &&
          isRewardEarnedDuringCampaign(r)
        ) {
          analytics.trackRewardsEvent(RewardsEvent.REWARD_EARNED, {
            type: 'trade',
          })
          wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
            useBalanceHandler(balances, setTokens, setIsLoadingBalances)
          })
        }
      })

      if (tradeClaimed.value && swapClaimed.value) {
        analytics.setUserProperties({ canClaimRewards: false })
        stopRewardsPoll()
      }
    }, 5000)
  }

  watch(
    () => isEligible.value,
    eligible => {
      if (eligible) {
        // Check immediately if we already have today's reward
        startRewardsPoll()
      } else {
        stopRewardsPoll()
        setEarnedPotentialReward(false)
      }
    },
    { immediate: true }
  )

  const fetchAll = async () => {
    await Promise.all([fetchPool(), fetchEligibility(), fetchUserRewards()])
    hadInitialLoad.value = true
    startPoolPoll()
    scheduleHourReset()
  }

  const isBanned = computed(() => {
    const tradeEligibility = eligibilityV2.value?.trade.reasons.some(
      r => r.type === 'ACCOUNT_TOO_NEW',
    )
    const swapEligibility = eligibilityV2.value?.swap.reasons.some(
      r => r.type === 'ACCOUNT_TOO_NEW',
    )
    if (tradeEligibility || swapEligibility) return true

    const tradeRecentlyRewarded = eligibilityV2.value?.trade.reasons.some(
      r => r.type === 'USER_RECENTLY_REWARDED',
    )
    const swapRecentlyRewarded = eligibilityV2.value?.swap.reasons.some(
      r => r.type === 'USER_RECENTLY_REWARDED',
    )

    const tradeGeneric = eligibilityV2.value?.trade.reasons.some(
      r => r.type === 'REWARDS_DISABLED',
    )
    const swapGeneric = eligibilityV2.value?.swap.reasons.some(
      r => r.type === 'REWARDS_DISABLED',
    )

    if (!tradeRecentlyRewarded || !swapRecentlyRewarded) {
      return tradeGeneric || swapGeneric
    }
    return false
  })

  const canClaimReward = computed(() => {
    if (isBitcoinChain.value) return true
    if (!eligibilityV2.value) return false
    return (
      eligibilityV2.value.swap.eligible || eligibilityV2.value.trade.eligible
    )
  })

  const isLoading = computed(() => {
    return (
      isLoadingEligibility.value ||
      isLoadingRewards.value ||
      isLoadingPool.value
    )
  })

  return {
    // Pool
    isPoolOpen,
    rewardsLeft,
    nextHourStart,
    poolReasons,
    swapPool,
    tradePool,
    isLoadingPool,
    fetchPool,
    // Eligibility
    eligibilityV2,
    isEligible,
    nextEligibleDate,
    eligibilityReasons,
    swapClaimed,
    tradeClaimed,
    swapNoRewards,
    tradeNoRewards,
    tradeMarketClosed,
    swapTotal,
    swapRemainingPct,
    swapRemainingCount,
    tradeTotal,
    tradeRemainingPct,
    tradeRemainingCount,
    isLoadingEligibility,
    fetchEligibility,
    checkAvailabilityAfterTransaction,
    // User Rewards
    rewards,
    hasRewards,
    isLoadingRewards,
    fetchUserRewards,
    fetchAll,
    // Earned Potential Reward badge
    earnedPotentialRewardAddresses,
    earnedPotentialReward,
    setEarnedPotentialReward,
    // Other
    canClaimReward,
    isLoading,
    hadInitialLoad,
    isRewardEarnedDuringCampaign,
    isBanned,
  }
})
