import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { components } from '@/mew_api/schemaRewards'
import Configs from '@/configs'
import { useWalletStore } from './walletStore'
import { useChainsStore } from './chainsStore'
import { useToastStore } from './toastStore'
import { analytics, RewardsEvent } from '@/analytics'
import useBalanceHandler from '@/utils/balanceHandler'
import type { TokenBalancesRaw } from '@/mew_api/types'

type PoolStatusResponse = components['schemas']['PoolStatusResponse']
type EligibilityResponse = components['schemas']['EligibilityResponse']
type RewardItem = components['schemas']['RewardItem']

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
    const error = await response.json()
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

  const pool = ref<PoolStatusResponse | null>(null)
  const eligibility = ref<EligibilityResponse | null>(null)
  const rewards = ref<RewardItem[]>([])
  const isLoadingPool = ref(false)
  const isLoadingEligibility = ref(false)
  const isLoadingRewards = ref(false)
  const hadInitialLoad = ref(false)

  /** Pool */
  const isPoolOpen = computed(() => pool.value?.open ?? false)
  const rewardsLeft = computed(
    () => pool.value?.hourlyRemainingRewardCount ?? '0',
  )
  const nextHourStart = computed(() => pool.value?.nextHourStart ?? null)
  const poolReasons = computed(() => pool.value?.reasons ?? [])

  const fetchPool = async () => {
    if (isBitcoinChain.value) return
    isLoadingPool.value = true
    try {
      pool.value = await fetchRewards<PoolStatusResponse>('/v1/rewards/pool')
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
  const isEligible = computed(() => eligibility.value?.eligible ?? false)
  const nextEligibleDate = computed(
    () => eligibility.value?.nextEligibleDate ?? null,
  )
  const eligibilityReasons = computed(() => eligibility.value?.reasons ?? [])

  const fetchEligibility = async () => {
    if (!walletAddress.value || isBitcoinChain.value) return
    isLoadingEligibility.value = true
    try {
      eligibility.value = await fetchRewards<EligibilityResponse>(
        `/v1/addresses/${walletAddress.value}/rewards/eligibility`,
      )
      const eligibale = eligibility.value?.eligible
        ? eligibility.value.eligible
        : false
      analytics.setUserProperties({ canClaimRewards: eligibale })
    } catch (error) {
      console.error('Failed to fetch reward eligibility:', error)
    } finally {
      isLoadingEligibility.value = false
    }
  }

  const checkAvailabilityAfterTransaction = async () => {
    // This function can be called after a transaction to check if user has earned a potential reward, and if so, set the badge immediately without waiting for the next eligibility fetch
    if (eligibility.value === null || eligibility.value.eligible) {
      await fetchEligibility()
      if (eligibility.value?.eligible) {
        earnedPotentialRewardAddresses.value.push(walletAddress.value!)
        return true
      }
    }
    return false
  }

  /** User Rewards */
  const todaysReward = computed(() => {
    const reward = rewards.value[0]
    if (reward && isRewardFromToday(reward)) return reward
    return null
  })
  const hasRewards = computed(() => rewards.value.length > 0)

  const fetchUserRewards = async () => {
    if (!walletAddress.value || isBitcoinChain.value) return
    isLoadingRewards.value = true
    try {
      rewards.value = await fetchRewards<RewardItem[]>(
        `/v1/addresses/${walletAddress.value}/rewards`,
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
      eligibility.value = null
      rewards.value = []
    }
  })

  /** Poll rewards when eligible until today's reward is found */
  let rewardsPollInterval: ReturnType<typeof setInterval> | null = null

  const isRewardFromToday = (reward: RewardItem): boolean => {
    if (!reward.rewardBroadcastAt) return false
    const rewardDate = new Date(reward.rewardBroadcastAt)
    const now = new Date()
    return (
      rewardDate.getUTCFullYear() === now.getUTCFullYear() &&
      rewardDate.getUTCMonth() === now.getUTCMonth() &&
      rewardDate.getUTCDate() === now.getUTCDate()
    )
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
      if (rewards.value[0] && isRewardFromToday(rewards.value[0])) {
        setEarnedPotentialReward(false)
        analytics.setUserProperties({ canClaimRewards: false })
        analytics.trackRewardsEvent(RewardsEvent.REWARD_EARNED)
      }
      if (
        rewards.value[0] &&
        isRewardFromToday(rewards.value[0]) &&
        rewards.value[0].rewardStatus === 'SUCCESS'
      ) {
        const toastStore = useToastStore()
        toastStore.toggleRewardToast(true)
        stopRewardsPoll()
        wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
          useBalanceHandler(balances, setTokens, setIsLoadingBalances)
        })
      }
    }, 5000)
  }

  watch(
    () => eligibility.value?.eligible,
    eligible => {
      if (eligible) {
        // Check immediately if we already have today's reward
        if (
          rewards.value[0] &&
          isRewardFromToday(rewards.value[0]) &&
          rewards.value[0].rewardStatus === 'SUCCESS'
        )
          return
        startRewardsPoll()
      } else {
        stopRewardsPoll()
      }
    },
  )

  const fetchAll = async () => {
    await Promise.all([fetchPool(), fetchEligibility(), fetchUserRewards()])
    hadInitialLoad.value = true
    startPoolPoll()
    scheduleHourReset()
  }

  const canClaimReward = computed(() => {
    if (isBitcoinChain.value) return true
    if (!eligibility.value) return false
    return eligibility.value.eligible
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
    pool,
    isPoolOpen,
    rewardsLeft,
    nextHourStart,
    poolReasons,
    isLoadingPool,
    fetchPool,
    // Eligibility
    eligibility,
    isEligible,
    nextEligibleDate,
    eligibilityReasons,
    isLoadingEligibility,
    fetchEligibility,
    checkAvailabilityAfterTransaction,
    // User Rewards
    rewards,
    todaysReward,
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
    isRewardFromToday,
  }
})
