import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { safeLocalStorage } from '@/utils/safeStorage'
import BigNumber from 'bignumber.js'
import configs from '@/configs'
import i18n from '@/i18n'
import { analytics } from '@/analytics'
import { ToastType } from '@/types/notification'
import type {
  RwaAccessBlock,
  RwaBuckets,
  RwaClaimErrorKey,
  RwaClaimPayload,
  RwaClaimResponse,
  RwaClaimResult,
  RwaInfoResponse,
  RwaRewardItem,
  RwaRound2State,
  RwaRound2Summary,
  RwaStatus,
} from '@/mew_api/schemaRwaRewards'
import { useWalletStore } from './walletStore'
import { useToastStore } from './toastStore'

const BASE = configs.RWA_REWARDS_API
const POLL_INTERVAL = 30_000

// The web wallet always claims from the `web` platform (no device-integrity gating).
const PLATFORM = 'web'

/**
 * Placeholder for the qualification threshold shown before `/info` resolves. The
 * server's `qualification_value` is authoritative the moment it arrives; this only
 * keeps the offer copy from rendering a bare '$'. Keep it in step with the campaign.
 */
const DEFAULT_QUALIFICATION_USD = '250'

/**
 * Round-1 hold length in days, for the tracker chips. Unlike round 2's
 * `days_to_hold` there is no server field for it — keep in step with the
 * campaign. Countdowns always use `qualification_timestamp` instead.
 */
const ROUND1_HOLD_DAYS = 14

// base64-encode a UTF-8 string (see src/utils/crypto.ts for the codebase convention).
const toBase64 = (value: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(value)))

/**
 * Why `/info` (or `/register`) refused. Anything else — network failure, 5xx —
 * is transient and must not be read as the season being closed.
 */
const mapAccessBlock = (status: number): RwaAccessBlock | null => {
  switch (status) {
    case 403:
      return 'notEligible'
    case 404:
      return 'campaignFull'
    case 423:
      return 'temporarilyPaused'
    default:
      return null
  }
}

/**
 * Whether a 403 refused the whole region rather than this wallet. `/info` and
 * `/register` answer a bare `Forbidden` when the region is blocked; a verdict on
 * the wallet itself (a ban) names itself in `msg`. Only a bare `Forbidden` may be
 * explained to the user as a jurisdiction problem.
 */
const isForbiddenByRegion = async (res: Response): Promise<boolean> => {
  if (res.status !== 403) return false
  try {
    const { msg } = (await res.json()) as { msg?: string }
    return typeof msg === 'string' && msg.trim().toLowerCase() === 'forbidden'
  } catch {
    // No body, or not JSON: nothing more specific than the status, and a
    // jurisdiction claim we can't back up is worse than a vague one.
    return false
  }
}

/**
 * The four per-wallet buckets, emptied. `/info` with no address answers with the
 * season block alone, so the buckets have to be filled in locally to keep the
 * payload one shape everywhere
 */
const emptyBuckets = (): RwaBuckets => ({
  qualified: [],
  disqualified: [],
  claimed: [],
  pending: [],
})

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
  // Persisted so "Hide this offer" stays hidden across reloads. Stored as a
  // plain array (JSON-serializable) and exposed as a Set for O(1) lookups.
  const dismissedIds = useStorage<string[]>(
    'mew-rwa-dismissed',
    [],
    safeLocalStorage,
  )
  const dismissed = computed(() => new Set(dismissedIds.value))

  let pollTimer: ReturnType<typeof setInterval> | null = null
  let currentAddress = ''

  // Why the season is closed to us, per the last `/info` or `/register` answer.
  // Null means open (or only a transient failure, which is not the same thing).
  const accessBlock = ref<RwaAccessBlock | null>(null)

  // True when the refusal above was a bare `Forbidden` — the region is blocked,
  // not this wallet. The status stays `notEligible` either way; only the copy
  // shown to the user differs.
  const isRegionBlocked = ref(false)

  const fetchInfo = async (address: string) => {
    if (!address) return
    currentAddress = address
    isLoading.value = true
    try {
      const res = await fetch(`${BASE}/info?address=${address}`)
      if (!res.ok) {
        const block = mapAccessBlock(res.status)
        const regionBlocked = await isForbiddenByRegion(res)
        if (block && address === currentAddress) {
          accessBlock.value = block
          isRegionBlocked.value = regionBlocked
          // Drop this wallet's buckets — keeping them would leave the offer
          // looking live and joinable after the season closed to it. The season
          // block survives: it describes the campaign, not the wallet, and is
          // what the countdown and rules copy read. Nulling it here blanked the
          // "Expires in" text as soon as a wallet with no entries connected.
          const season = info.value?.info
          info.value = season ? { ...emptyBuckets(), info: season } : null
        }
        throw new Error(`RWA info request failed: ${res.status}`)
      }
      const data = (await res.json()) as RwaInfoResponse
      if (address !== currentAddress) return
      // Merge the season block rather than replacing it (same reason the claim
      // response is merged below): the address-scoped route answers about the
      // wallet, and a response that omits or thins the season block must not
      // erase what the campaign-wide load already established.
      info.value = {
        ...emptyBuckets(),
        ...data,
        info: { ...info.value?.info, ...data.info },
      }
      accessBlock.value = null
      isRegionBlocked.value = false
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

  /**
   * First-load `/info` with no address. The season block it returns — dates,
   * qualification value, availability — is campaign-wide, so the countdown and
   * threshold can be shown before a wallet is connected.
   *
   * Every guard here is against `currentAddress`: the moment an address-scoped
   * fetch takes over it owns the state, because its response carries the same
   * season block *plus* the wallet's own buckets. This one must never overwrite
   * it, however the two responses interleave.
   */
  const fetchCampaignInfo = async () => {
    if (currentAddress) return
    isLoading.value = true
    try {
      const res = await fetch(`${BASE}/info`)
      if (!res.ok) {
        // With no address in the request, a refusal is season- or region-wide
        // rather than a verdict on any one wallet.
        const block = mapAccessBlock(res.status)
        const regionBlocked = await isForbiddenByRegion(res)
        if (block && !currentAddress) {
          accessBlock.value = block
          isRegionBlocked.value = regionBlocked
          info.value = null
        }
        throw new Error(`RWA campaign info request failed: ${res.status}`)
      }
      const data = (await res.json()) as RwaInfoResponse
      if (currentAddress) return
      // This route answers with the season block only — no buckets, since there
      // is no wallet to scope them to.
      info.value = { ...emptyBuckets(), ...data }
      accessBlock.value = null
      isRegionBlocked.value = false
      error.value = null
    } catch {
      if (!currentAddress) error.value = 'Failed to fetch RWA rewards'
    } finally {
      if (!currentAddress) {
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
    const value = new BigNumber(usdValue ?? '')
    if (value.isNaN()) return

    // Cheap pre-filter so an obviously non-qualifying trade costs no request.
    // Only skipped when the threshold is unknown, where the trade can't be
    // ruled out yet and the refresh below is what settles it.
    const knownThreshold = new BigNumber(qualificationValue.value ?? '')
    if (knownThreshold.isGreaterThan(0) && value.lt(knownThreshold)) return

    // `/register` has no budget gate: it queues whatever hash it is given and
    // answers ok, and the budget is only enforced up to 14 days later, when the
    // entry tries to reserve its payout. A registration that can't be reserved
    // promises a reward that will never be paid, so the client is the gate —
    // and it has to be an authoritative one. Both the threshold and the
    // availability we hold can be a poll interval old, so re-read `/info`
    // rather than queueing a hash against a stale answer.
    const walletStore = useWalletStore()
    await fetchInfo(currentAddress || walletStore.walletAddress || '')

    // A season that isn't taking entries: the UI already shows it closed, so
    // there is nothing to tell the user here.
    if (!canRegisterTrade.value) return

    // Only trades worth at least the campaign's qualification_value qualify.
    // Skip silently for anything below the threshold, or when the threshold is
    // still unknown (the refresh above failed) — registering blind would show a
    // success toast for an entry that can't qualify.
    const threshold = new BigNumber(qualificationValue.value ?? '')
    if (threshold.isNaN() || threshold.lte(0) || value.lt(threshold)) return

    const { addToastMessage } = useToastStore()
    try {
      const res = await fetch(
        `${BASE}/register?hash=${orderHash}&chainId=${chainId}`,
      )
      if (!res.ok) {
        // 423 (kill-switch) and 404 (registration window closed) mean the season
        // stopped taking entries between our last `/info` and this trade.
        const block = mapAccessBlock(res.status)
        const regionBlocked = await isForbiddenByRegion(res)
        if (block) {
          accessBlock.value = block
          isRegionBlocked.value = regionBlocked
          fetchInfo(currentAddress)
          addToastMessage({
            text: i18n.global.t('rwaRewards.register_unavailable'),
            type: ToastType.Error,
          })
          return
        }
        throw new Error(`RWA register request failed: ${res.status}`)
      }
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

    // One claim per round: with that round's claim already on the books, a
    // second one can only ever answer 409 — refuse it locally so no surface
    // can ask the user to sign for a reward that will never pay.
    const roundAlreadyClaimed =
      reward.round === 2 ? hasClaimedRoundTwo.value : hasClaimedRoundOne.value
    if (roundAlreadyClaimed) {
      return { success: false, errorKey: 'alreadyClaimed' }
    }

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
        // These refusals mean our snapshot is stale — already claimed, no
        // longer claimable, or the window closed — so re-read `/info` rather
        // than leave the card arguing with the server.
        if ([404, 409, 410].includes(res.status)) fetchInfo(currentAddress)
        error.value = 'Failed to claim RWA reward'
        return { success: false, errorKey }
      }

      const data = (await res.json()) as RwaClaimResponse
      // Response carries the recomputed buckets — refresh state so the entry
      // moves into `claimed` and the modal reflects the new status.
      info.value = {
        // Merged, not replaced: `is_available` and `under_review` are added by
        // the info routes only, so a claim response omitting them would drop a
        // known-closed season back to looking open until the next poll.
        info: { ...info.value?.info, ...data.info },
        metas: data.metas ?? info.value?.metas,
        qualified: data.qualified,
        disqualified: data.disqualified,
        claimed: data.claimed,
        pending: data.pending,
        // The round-1 claim is exactly what spawns the round-2 entry, so this
        // is the response that first carries the summary — dropping it would
        // hide the new round until the next poll.
        round2: data.round2 ?? info.value?.round2,
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
    if (!dismissedIds.value.includes(uuid)) {
      dismissedIds.value = [...dismissedIds.value, uuid]
    }
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

  /**------------------------
   * Rounds. A wallet can hold entries from both rounds at once (the claimed
   * round-1 entry stays in `claimed` while round 2 runs), so the round-1 flow
   * reads round-filtered buckets, and everything after the round-1 claim is
   * driven by the response's top-level `round2` summary — the API doc is
   * explicit that the second round's state must not be derived from buckets.
   * `round` is missing on season-1 entries: treat as round 1.
   -------------------------*/
  const isRoundTwoEntry = (r: RwaRewardItem) => r.round === 2
  const roundOne = (arr: RwaRewardItem[]) =>
    arr.filter(r => !isRoundTwoEntry(r))

  const pendingR1 = computed(() => roundOne(pending.value))
  const qualifiedR1 = computed(() => roundOne(qualified.value))
  const claimedR1 = computed(() => roundOne(claimed.value))
  const disqualifiedR1 = computed(() => roundOne(disqualified.value))

  /**
   * Whether the wallet has claimed its one reward for a round — read from the
   * RAW bucket, dismissal ignored. One claim per round: a claimed entry spends
   * that round's budget whatever else the buckets hold, so no other entry of
   * the same round may ever offer a Claim (dismissal is a display preference;
   * it must never resurrect a dead claim).
   */
  const hasClaimedRoundOne = computed(
    () => roundOne(info.value?.claimed ?? []).length > 0,
  )
  const hasClaimedRoundTwo = computed(() =>
    (info.value?.claimed ?? []).some(isRoundTwoEntry),
  )

  const claimableRewardR1 = computed<RwaRewardItem | null>(
    () => qualifiedR1.value.find(isClaimable) ?? null,
  )
  const expiredRewardR1 = computed<RwaRewardItem | null>(
    () => qualifiedR1.value.find(r => !isClaimable(r)) ?? null,
  )

  /** Raw round-2 state, for notices (UNAVAILABLE / ELIGIBLE copy). */
  const round2Status = computed<RwaRound2State | null>(
    () => info.value?.round2?.status ?? null,
  )

  // The live summary — only once the wallet is actually in the second round,
  // and not after the user hid the offer (dismissal is by entry uuid, same as
  // round 1).
  const round2Summary = computed<RwaRound2Summary | null>(() => {
    const summary = info.value?.round2
    if (!summary?.eligible) return null
    if (summary.uuid && dismissed.value.has(summary.uuid)) return null
    return summary
  })

  /** The round-2 entry, in whichever bucket currently holds it. */
  const round2Entry = computed<RwaRewardItem | null>(() => {
    const uuid = round2Summary.value?.uuid
    if (!uuid) return null
    return (
      [
        ...pending.value,
        ...qualified.value,
        ...claimed.value,
        ...disqualified.value,
      ].find(r => r.uuid === uuid) ?? null
    )
  })

  // QUALIFIED per the server, and still inside the claim window by our clock —
  // the summary can lag a few minutes behind a deadline between polls.
  const round2Claimable = computed(() => {
    const summary = round2Summary.value
    if (summary?.status !== 'QUALIFIED') return false
    const exp =
      round2Entry.value?.expiration_timestamp ?? summary.expiration_timestamp
    return !exp || Date.now() < new Date(exp).getTime()
  })

  const isCampaignEnded = computed(() => {
    const end = info.value?.info?.end
    if (!end) return false
    const ms = new Date(end).getTime()
    return !Number.isNaN(ms) && Date.now() >= ms
  })

  // The season's payout budget is spent. A wallet that already has an entry
  // learns this from `is_available`; one that doesn't gets a 404 instead.
  const isCampaignFull = computed(
    () =>
      accessBlock.value === 'campaignFull' ||
      info.value?.info?.is_available === false,
  )

  // Banned but holding entries: the backend answers 200 and flags it rather than
  // hiding the program, so the wallet can be told its status is under review.
  const isUnderReview = computed(() => info.value?.info?.under_review === true)

  /**
   * Whether a new trade can still be registered. Every CTA that invites one —
   * "Trade now", "Trade again", "Start again", the announcement, the trade
   * confirmation banner — has to check this, not just `status === 'default'`,
   * because a wallet with a finished entry keeps a bucket status after the
   * season closes to new entries.
   */
  const canRegisterTrade = computed(
    () =>
      !isCampaignFull.value &&
      !isCampaignEnded.value &&
      !isUnderReview.value &&
      accessBlock.value === null,
  )

  /**
   * The one state + entry pair the card presents — `status` and `activeReward`
   * are two views of it. Computed together, because with two rounds — and
   * possibly several round-1 entries on different assets — the buckets hold
   * entries the card must NOT talk about: "first pending entry" would show
   * round-2 data under round-1 copy, and a leftover qualified sibling would
   * keep a dead Claim button alive.
   *
   * The wallet's own progress outranks the season-closed states: an entry that
   * is already holding or owed a reward is unaffected by the season closing to
   * new entries, and a wallet under review is deliberately still shown its
   * entries (the review is surfaced separately, via `isUnderReview`).
   *
   * One reward per customer: the moment any round-1 entry is claimed, that
   * entry and its second round own the card — every other round-1 entry
   * (still qualified, pending, expired or lost on another asset) can never
   * pay and must not surface, least of all as a claimable button the server
   * would refuse with 409.
   */
  const presentation = computed<{
    status: RwaStatus
    reward: RwaRewardItem | null
  }>(() => {
    if (hasClaimedRoundOne.value) {
      // The user hid the offer (with legacy single-uuid dismissals this can
      // hide just the claimed entry): the offer is spent, nothing resurfaces —
      // least of all another entry's Claim button.
      if (!claimedR1.value.length) return { status: 'default', reward: null }
      const claimedFirst = claimedR1.value[0]
      // One claim per round, round 2 included: a claimed round-2 entry ends
      // the season for this wallet, whatever the summary says about any other
      // round-2 entry still pending or qualifying on another track. Without
      // this, that other entry would eventually surface a Claim button the
      // server could only refuse.
      if (hasClaimedRoundTwo.value) {
        return {
          status: 'claimed',
          reward: claimed.value.find(isRoundTwoEntry) ?? claimedFirst,
        }
      }
      // A terminal round 2 never touches the round-1 claim, but it is what
      // the user still needs to hear about (a quietly vanished bonus reads as
      // a bug). Reuses the round-1 statuses; `isRoundTwoActive` tells the UI
      // which round's copy to show.
      switch (round2Summary.value?.status) {
        case 'PENDING':
          return { status: 'holding', reward: round2Entry.value }
        case 'QUALIFIED':
          return {
            status: round2Claimable.value ? 'earned' : 'expired',
            reward: round2Entry.value,
          }
        case 'CLAIMED':
          return {
            status: 'claimed',
            reward: round2Entry.value ?? claimedFirst,
          }
        case 'EXPIRED':
          return {
            status: 'expired',
            reward: round2Entry.value ?? claimedFirst,
          }
        case 'DISQUALIFIED':
          return { status: 'lost', reward: round2Entry.value ?? claimedFirst }
        // NOT_ELIGIBLE can't coexist with a claim; ELIGIBLE and UNAVAILABLE
        // have nothing actionable (surfaced as notices via `round2Status`);
        // season 1 and a dismissed round 2 have no summary at all.
        default:
          return { status: 'claimed', reward: claimedFirst }
      }
    }
    if (claimableRewardR1.value)
      return { status: 'earned', reward: claimableRewardR1.value }
    if (pendingR1.value.length)
      return { status: 'holding', reward: pendingR1.value[0] }
    if (expiredRewardR1.value)
      return { status: 'expired', reward: expiredRewardR1.value }
    if (disqualifiedR1.value.length)
      return { status: 'lost', reward: disqualifiedR1.value[0] }
    if (isUnderReview.value) return { status: 'underReview', reward: null }
    if (isCampaignEnded.value) return { status: 'campaignEnded', reward: null }
    if (isCampaignFull.value) return { status: 'campaignFull', reward: null }
    if (accessBlock.value) return { status: accessBlock.value, reward: null }
    return { status: 'default', reward: null }
  })

  const status = computed<RwaStatus>(() => presentation.value.status)
  const activeReward = computed<RwaRewardItem | null>(
    () => presentation.value.reward,
  )

  /**
   * Whether the state the card is showing belongs to the second round. The
   * components keep branching on the shared `status`; this picks the copy.
   */
  const isRoundTwoActive = computed(() => activeReward.value?.round === 2)

  /**
   * Whether a "try again" CTA may invite a new trade. A finished second round
   * is terminal — no retry, no round 3 — so a lost or expired round 2 must not
   * re-offer even while the season still registers new wallets.
   */
  const canRetryTrade = computed(
    () => canRegisterTrade.value && !isRoundTwoActive.value,
  )

  // The "Hide this offer" button only appears in the terminal claimed/expired
  // states. Once the user hides that reward it is filtered out and `status`
  // falls back to 'default'. Rather than re-showing the generic hold promo,
  // the hero card should move on to the next eligible offer (defaulting to the
  // Zero MEW Fees variant). This flag tells the hero card the hold offer is
  // spent so it can hand the slot over.
  const dismissedTerminal = computed(() => {
    if (!dismissed.value.size || !info.value) return false
    return [
      ...(info.value.claimed ?? []),
      ...(info.value.qualified ?? []),
      ...(info.value.disqualified ?? []),
    ].some(r => dismissed.value.has(r.uuid))
  })
  const isHoldOfferDismissed = computed(
    () => status.value === 'default' && dismissedTerminal.value,
  )

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

  /**
   * Campaign qualification threshold in USD, parsed for comparisons. Null until `/info`
   * lands or when the value is unusable — callers must not promise a reward on null.
   */
  const qualificationUsd = computed<number | null>(() => {
    const parsed = new BigNumber(qualificationValue.value ?? '')
    return parsed.isNaN() || parsed.lte(0) ? null : parsed.toNumber()
  })

  /**
   * Display-ready threshold for offer copy, e.g. '250' — the `amount` in `${amount}`.
   * BigNumber normalises the server's string, so '250.00' renders as '250'.
   *
   * `/info` is campaign-wide and fetched on app load, but the offer surfaces render on
   * status (which has a pre-load default), so the copy can paint one frame before the
   * value arrives. It falls back to the campaign's advertised amount rather than an
   * empty '$' — the only place this number is still written by hand.
   */
  const qualificationAmount = computed<string>(() => {
    const usd = qualificationUsd.value
    return usd === null
      ? DEFAULT_QUALIFICATION_USD
      : new BigNumber(usd).toString()
  })

  /**
   * Chip count for the hold tracker. Round 2 reads the server's
   * `days_to_hold`; the round-1 hold length has no server field, so the
   * campaign constant stays. Countdown copy must keep using
   * `qualification_timestamp` — on dev the "days" are actually minutes.
   */
  const holdTotalDays = computed(() => {
    if (isRoundTwoActive.value)
      return info.value?.info?.round2?.days_to_hold ?? ROUND1_HOLD_DAYS
    return ROUND1_HOLD_DAYS
  })

  /**
   * Display label for the active round's reward, e.g. "10 USDC". Round 1 reads
   * `info.rewards`, round 2 `info.round2.rewards` — the round-2 amount is not
   * final and must never be hardcoded. Null until the season block and metas
   * land; callers fall back to the round-1 campaign copy.
   */
  const rewardAmountLabel = computed<string | null>(() => {
    const season = info.value?.info
    const rewards = isRoundTwoActive.value
      ? season?.round2?.rewards
      : season?.rewards
    if (!rewards?.length) return null
    // The payout lands on the entry's chain; with no entry yet, show the
    // first denomination (the amounts only differ by chain decimals).
    const chainId = activeReward.value?.chain_id
    const reward =
      (chainId != null &&
        rewards.find(r => r.id.split(':')[1] === String(chainId))) ||
      rewards[0]
    const meta = info.value?.metas?.find(m => m.id === reward.id)
    if (!meta) return null
    // Reward ids are single-chain (`crypto:<chain>:<address>`), so the meta's
    // first decimals entry is the right one.
    const amount = new BigNumber(reward.amount).shiftedBy(
      -(meta.crypto.decimals[0] ?? 6),
    )
    if (amount.isNaN()) return null
    return `${amount.toFormat()} ${meta.symbol}`.trim()
  })

  /**
   * Hide the whole hold offer — every entry the wallet has, not just the
   * visible one. An offer can span both rounds and, with several qualifying
   * trades, several round-1 entries; hiding a single uuid would just hand the
   * card to whichever sibling ranks next.
   */
  const dismissOffer = () => {
    if (!info.value) return
    for (const reward of [
      ...(info.value.qualified ?? []),
      ...(info.value.disqualified ?? []),
      ...(info.value.claimed ?? []),
      ...(info.value.pending ?? []),
    ]) {
      dismiss(reward.uuid)
    }
    const summaryUuid = info.value.round2?.uuid
    if (summaryUuid) dismiss(summaryUuid)
  }

  return {
    info,
    isLoading,
    hadInitialLoad,
    error,
    isModalOpen,
    isClaiming,
    fetchInfo,
    fetchCampaignInfo,
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
    round2Status,
    round2Summary,
    isRoundTwoActive,
    canRetryTrade,
    holdTotalDays,
    rewardAmountLabel,
    dismissOffer,
    isCampaignFull,
    isCampaignEnded,
    isUnderReview,
    isRegionBlocked,
    canRegisterTrade,
    isHoldOfferDismissed,
    seasonEnd,
    qualificationValue,
    qualificationUsd,
    qualificationAmount,
  }
})
