import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import configs from '@/configs'
import type {
  RwaInfoResponse,
  RwaRewardItem,
  RwaStatus,
} from '@/mew_api/schemaRwaRewards'

const BASE = configs.RWA_REWARDS_API
const POLL_INTERVAL = 30_000

export const useHoldingsStore = defineStore('holdingsStore', () => {
  const info = ref<RwaInfoResponse | null>(null)
  const isLoading = ref(false)
  const hadInitialLoad = ref(false)
  const error = ref<string | null>(null)
  const isModalOpen = ref(false)
  const dismissed = ref<Set<string>>(new Set())

  let pollTimer: ReturnType<typeof setInterval> | null = null
  let currentAddress = ''

  const fetchInfo = async (address: string) => {
    if (!address) return
    currentAddress = address
    isLoading.value = true
    try {
      const res = await fetch(`${BASE}/info?address=${address}`)
      if (!res.ok) throw new Error(`RWA info request failed: ${res.status}`)
      const data = (await res.json()) as RwaInfoResponse
      if (address !== currentAddress) return
      info.value = data
      error.value = null
    } catch {
      if (address === currentAddress)
        error.value = 'Failed to fetch RWA rewards'
    } finally {
      if (address === currentAddress) {
        isLoading.value = false
        hadInitialLoad.value = true
      }
    }
  }

  const register = async (orderHash: string, chainId: number | string) => {
    try {
      await fetch(`${BASE}/register?hash=${orderHash}&chainId=${chainId}`)
    } catch {
      error.value = 'Failed to register RWA trade'
    }
  }

  const claim = async (reward: RwaRewardItem) => {
    void reward
  }

  const openModal = () => {
    isModalOpen.value = true
  }
  const closeModal = () => {
    isModalOpen.value = false
  }
  const dismiss = (uuid: string) => {
    const next = new Set(dismissed.value)
    next.add(uuid)
    dismissed.value = next
  }

  const startPolling = (address: string) => {
    stopPolling()
    fetchInfo(address)
    pollTimer = setInterval(() => fetchInfo(currentAddress), POLL_INTERVAL)
  }

  const stopPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  const notDismissed = (arr: RwaRewardItem[]) =>
    arr.filter(r => !dismissed.value.has(r.uuid))
  const pending = computed<RwaRewardItem[]>(() =>
    notDismissed(info.value?.pending ?? []),
  )
  const qualified = computed<RwaRewardItem[]>(() =>
    notDismissed(info.value?.qualified ?? []),
  )
  const claimed = computed<RwaRewardItem[]>(() =>
    notDismissed(info.value?.claimed ?? []),
  )
  const disqualified = computed<RwaRewardItem[]>(() =>
    notDismissed(info.value?.disqualified ?? []),
  )

  const hasReward = computed(
    () =>
      pending.value.length +
        qualified.value.length +
        claimed.value.length +
        disqualified.value.length >
      0,
  )

  const isClaimable = (r: RwaRewardItem) => {
    const exp = r.expiration_timestamp
      ? new Date(r.expiration_timestamp).getTime()
      : null
    return exp === null || Date.now() < exp
  }
  const claimableReward = computed<RwaRewardItem | null>(
    () => qualified.value.find(isClaimable) ?? null,
  )
  const expiredReward = computed<RwaRewardItem | null>(
    () => qualified.value.find(r => !isClaimable(r)) ?? null,
  )

  const activeReward = computed<RwaRewardItem | null>(
    () =>
      claimableReward.value ??
      pending.value[0] ??
      claimed.value[0] ??
      expiredReward.value ??
      disqualified.value[0] ??
      null,
  )

  const isCampaignEnded = computed(() => {
    const end = info.value?.info?.end
    if (!end) return false
    const ms = new Date(end).getTime()
    return !Number.isNaN(ms) && Date.now() >= ms
  })

  const status = computed<RwaStatus>(() => {
    if (claimableReward.value) return 'earned'
    if (pending.value.length) return 'holding'
    if (claimed.value.length) return 'claimed'
    if (expiredReward.value) return 'expired'
    if (disqualified.value.length) return 'lost'
    if (isCampaignEnded.value) return 'campaignEnded'
    if (info.value?.info?.is_available === false) return 'temporarilyPaused'
    return 'default'
  })

  const seasonEnd = computed(() => info.value?.info?.end ?? null)
  const qualificationValue = computed(
    () => info.value?.info?.qualification_value ?? null,
  )

  return {
    info,
    isLoading,
    hadInitialLoad,
    error,
    isModalOpen,
    fetchInfo,
    register,
    claim,
    openModal,
    closeModal,
    dismiss,
    startPolling,
    stopPolling,
    pending,
    qualified,
    claimed,
    disqualified,
    hasReward,
    activeReward,
    status,
    seasonEnd,
    qualificationValue,
  }
})
