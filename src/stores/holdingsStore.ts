import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import BigNumber from 'bignumber.js'
import configs from '@/configs'
import i18n from '@/i18n'
import { analytics } from '@/analytics'
import { ToastType } from '@/types/notification'
import type {
  RwaClaimErrorKey,
  RwaClaimPayload,
  RwaClaimResponse,
  RwaClaimResult,
  RwaInfoResponse,
  RwaRewardItem,
  RwaStatus,
} from '@/mew_api/schemaRwaRewards'
import { useWalletStore } from './walletStore'
import { useToastStore } from './toastStore'

const BASE = configs.RWA_REWARDS_API
const POLL_INTERVAL = 30_000

// The web wallet always claims from the `web` platform (no device-integrity gating).
const PLATFORM = 'web'

// base64-encode a UTF-8 string (see src/utils/crypto.ts for the codebase convention).
const toBase64 = (value: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(value)))

// Map the claim endpoint's HTTP status to a translatable error key.
const mapClaimError = (status: number): RwaClaimErrorKey => {
  switch (status) {
    case 403:
      return 'restricted'
    case 404:
      return 'notClaimable'
    case 406:
      return 'platformMismatch'
    case 409:
      return 'alreadyClaimed'
    case 410:
      return 'windowClosed'
    case 422:
      return 'invalidRequest'
    case 423:
      return 'locked'
    default:
      return 'generic'
  }
}

export const useHoldingsStore = defineStore('holdingsStore', () => {
  const info = ref<RwaInfoResponse | null>(null)
  const isLoading = ref(false)
  const hadInitialLoad = ref(false)
  const error = ref<string | null>(null)
  const isModalOpen = ref(false)
  const isClaiming = ref(false)
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

  const register = async (
    orderHash: string,
    chainId: number | string,
    usdValue?: string,
  ) => {
    // Only trades worth at least the campaign's qualification_value qualify.
    // Skip silently (no request, no toast) for anything below the threshold or
    // when the threshold isn't known yet (info not loaded / missing usdValue).
    const threshold = new BigNumber(qualificationValue.value ?? '')
    const value = new BigNumber(usdValue ?? '')
    if (
      threshold.isNaN() ||
      threshold.lte(0) ||
      value.isNaN() ||
      value.lt(threshold)
    ) {
      return
    }

    const { addToastMessage } = useToastStore()
    try {
      const res = await fetch(
        `${BASE}/register?hash=${orderHash}&chainId=${chainId}`,
      )
      if (!res.ok) throw new Error(`RWA register request failed: ${res.status}`)
      addToastMessage({
        text: i18n.global.t('rwaRewards.register_success'),
        type: ToastType.Success,
      })
    } catch {
      error.value = 'Failed to register RWA trade'
      addToastMessage({
        text: i18n.global.t('rwaRewards.register_error'),
        type: ToastType.Error,
      })
    }
  }

  const performClaim = async (
    reward: RwaRewardItem,
  ): Promise<RwaClaimResult> => {
    const walletStore = useWalletStore()
    const wallet = walletStore.wallet
    if (!wallet) return { success: false, errorKey: 'walletMissing' }

    isClaiming.value = true
    error.value = null
    try {
      // The recovered signer must be the exact address that earned the entry.
      const signer = await wallet.getAddress()
      if (signer.toLowerCase() !== reward.address.toLowerCase()) {
        return { success: false, errorKey: 'wrongAddress' }
      }

      // Build → base64 → sign. The signature is over the base64 `transaction`
      // string itself (the server recovers the signer from it).
      const payload: RwaClaimPayload = { uuid: reward.uuid, platform: PLATFORM }
      const transaction = toBase64(JSON.stringify(payload))

      let signature: string
      try {
        signature = await wallet.SignMessage({ message: transaction })
      } catch {
        // User rejected the signature or the signer errored.
        return { success: false, errorKey: 'signatureFailed' }
      }

      const res = await fetch(`${BASE}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          version: configs.APP_VERSION,
        },
        body: JSON.stringify({ transaction, signature }),
      })

      if (!res.ok) {
        const errorKey = mapClaimError(res.status)
        error.value = 'Failed to claim RWA reward'
        return { success: false, errorKey }
      }

      const data = (await res.json()) as RwaClaimResponse
      // Response carries the recomputed buckets — refresh state so the entry
      // moves into `claimed` and the modal reflects the new status.
      info.value = {
        info: data.info,
        metas: data.metas ?? info.value?.metas,
        qualified: data.qualified,
        disqualified: data.disqualified,
        claimed: data.claimed,
        pending: data.pending,
      }
      return { success: true, response: data }
    } catch {
      error.value = 'Failed to claim RWA reward'
      return { success: false, errorKey: 'generic' }
    } finally {
      isClaiming.value = false
    }
  }

  const claim = async (reward: RwaRewardItem): Promise<RwaClaimResult> => {
    // Ignore re-entry while a claim is already in flight — no toast for that.
    if (isClaiming.value) return { success: false, errorKey: 'generic' }

    const result = await performClaim(reward)
    const { addToastMessage } = useToastStore()
    if (result.success) {
      addToastMessage({
        text: i18n.global.t('rwaRewards.claim_success'),
        type: ToastType.Success,
      })
    } else {
      addToastMessage({
        text: i18n.global.t(`rwaRewards.claim_errors.${result.errorKey}`),
        type: ToastType.Error,
      })
    }
    return result
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

  // Mirror the hold campaign status onto the analytics user profile
  watch(
    status,
    newStatus => {
      analytics.setHoldCampaignStatus(newStatus)
    },
    { immediate: true },
  )

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
    isClaiming,
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