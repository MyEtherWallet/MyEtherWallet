<template>
  <div>
    <h3 class="text-s-16 font-semibold text-black pl-4 mb-5">
      {{ $t('rwaRewards.section_title') }}
    </h3>
    <div class="relative">
      <div
        ref="track"
        class="carousel-track flex gap-5 overflow-x-auto"
        @scroll="updateScroll"
      >
        <rwa-reward-card
          class="flex-1 min-w-[440px] order-2"
          illustration="trade"
          campaign="trade"
          :title="$t('rwaRewards.trade_title')"
          :description="
            $t('rwaRewards.trade_description', { minSpendTrade: minSpendTrade })
          "
          :primary-label="$t('rwaRewards.trade')"
          primary-cta="trade"
          :secondary-label="$t('rwaRewards.more_info')"
          @primary="onTradeCampaign"
          @secondary="onTradeInfo"
        />
        <rwa-reward-card
          class="flex-1 min-w-[440px] order-1"
          illustration="hold"
          campaign="hold"
          :status="holdCardStatus"
          :title="$t('rwaRewards.hold_title')"
          :description="holdCardDescription"
          :status-text="holdCardStatusText"
          :primary-label="holdCardCta.label"
          :primary-cta="holdCardCta.id"
          :primary-disabled="holdPrimaryDisabled"
          :round="round"
          :secondary-label="$t('rwaRewards.more_info')"
          @primary="onHoldPrimary"
          @secondary="onMoreInfo"
        />
        <rwa-reward-card
          class="flex-1 min-w-[440px] order-3"
          campaign="buy_no_fees"
          illustration="fees"
          :title="$t('rwaRewards.fees_title')"
          :description="$t('rwaRewards.fees_description')"
          :footnote="$t('rwaRewards.fees_footnote')"
          :primary-label="$t('rwaRewards.buy_assets')"
          primary-cta="buy_assets"
          @primary="onBuy"
        />
      </div>

      <div
        v-show="canScrollLeft"
        aria-hidden="true"
        class="pointer-events-none absolute top-0 left-0 w-24 h-[220px] bg-[linear-gradient(90deg,#f5f5f7_0%,rgba(245,245,247,0)_100%)]"
      ></div>
      <button
        v-show="canScrollLeft"
        class="absolute flex items-center justify-center hoverOpacityHasBG top-[110px] left-2 -translate-y-1/2 w-8 h-8 rounded-24 border border-[#e6e6e6] bg-white z-[2]"
        :aria-label="$t('rwaRewards.previous')"
        @click="scrollPrev"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 5l-5 5 5 5"
            stroke="#000"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div
        v-show="canScrollRight"
        aria-hidden="true"
        class="pointer-events-none absolute top-0 right-0 w-24 h-[220px] bg-[linear-gradient(270deg,#f5f5f7_0%,rgba(245,245,247,0)_100%)]"
      ></div>
      <button
        v-show="canScrollRight"
        class="absolute flex items-center justify-center hoverOpacityHasBG top-[110px] right-2 -translate-y-1/2 w-8 h-8 rounded-24 border border-[#e6e6e6] bg-white z-[2]"
        :aria-label="$t('rwaRewards.next')"
        @click="scrollNext"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 5l5 5-5 5"
            stroke="#000"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <rwa-trade-info-modal v-model:is-open="isTradeInfoOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useResizeObserver } from '@vueuse/core'
import RwaRewardCard from '@/modules/rwa_rewards/RwaRewardCard.vue'
import RwaTradeInfoModal from '@/modules/rwa_rewards/RwaTradeInfoModal.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import configs from '@/configs'

const { t } = useI18n()
const walletMenuStore = useWalletMenuStore()
const holdingsStore = useHoldingsStore()
const {
  status,
  activeReward,
  seasonEnd,
  canRegisterTrade,
  canRetryTrade,
  isCampaignEnded,
  isUnderReview,
  isClaiming,
  qualificationAmount,
  isRoundTwoActive,
  holdTotalDays,
  rewardAmountLabel,
  totalRewardAmountLabel,
} = storeToRefs(holdingsStore)

const round = computed<1 | 2>(() => (isRoundTwoActive.value ? 2 : 1))
// Server-driven when the season block has landed; the campaign's advertised
// round-1 copy otherwise.
const rewardLabel = computed(
  () => rewardAmountLabel.value ?? t('rwaRewards.reward_amount'),
)
const totalLabel = computed(
  () => totalRewardAmountLabel.value ?? rewardLabel.value,
)
const { isWatchOnly } = storeToRefs(useWalletStore())
const { openAccessDialog } = useAccessStore()

const rewardsStore = useRewardsStore()
const { minSpendTrade } = storeToRefs(rewardsStore)

const track = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const updateScroll = () => {
  const el = track.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 1
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

const scrollNext = () => {
  track.value?.scrollBy({ left: 460, behavior: 'smooth' })
}

const scrollPrev = () => {
  track.value?.scrollBy({ left: -460, behavior: 'smooth' })
}

onMounted(updateScroll)
useResizeObserver(track, updateScroll)

const isTradeInfoOpen = ref(false)

const onTradeCampaign = () => walletMenuStore.openPanel('trade')
const onBuy = () => walletMenuStore.openPanel('purchase')
const onMoreInfo = () => holdingsStore.openModal()
const onTradeInfo = () => {
  isTradeInfoOpen.value = true
}

// Null for a missing or unparseable date, so callers can drop the copy rather
// than render a countdown of "0 days".
const daysUntil = (ts?: string | null) => {
  if (!ts) return null
  const ms = new Date(ts).getTime()
  if (Number.isNaN(ms)) return null
  return Math.max(0, Math.ceil((ms - Date.now()) / 86_400_000))
}

const holdCardStatus = computed<
  | 'ongoing'
  | 'holding'
  | 'claimed'
  | 'claimable'
  | 'lost'
  | 'expired'
  | 'paused'
  | 'full'
  | 'ended'
  | 'banned'
  | 'underReview'
  | 'notEligible'
>(() => {
  // Outranks the wallet's own progress in the badge: the review is what decides
  // whether any of that progress pays out.
  if (isUnderReview.value) return 'underReview'
  // Ahead of the closed-season states on purpose: a reward earned before the
  // budget ran out is still owed, so the claim path has to stay reachable.
  if (status.value === 'earned') return 'claimable'
  if (status.value === 'holding') return 'holding'
  if (status.value === 'claimed') return 'claimed'
  // A finished entry keeps its own badge in either round; whether it can be
  // retried is decided by the CTA (round 1 only, and only while the season
  // still registers trades).
  if (status.value === 'lost') return 'lost'
  if (status.value === 'expired') return 'expired'
  if (status.value === 'temporarilyPaused') return 'paused'
  if (status.value === 'campaignFull') return 'full'
  if (status.value === 'campaignEnded') return 'ended'
  if (status.value === 'banned') return 'banned'
  if (status.value === 'notEligible') return 'notEligible'
  // The offer can be closed to new trades — surface why, rather than "ends in N days".
  if (!canRegisterTrade.value) return isCampaignEnded.value ? 'ended' : 'full'
  return 'ongoing'
})

// The title is identical in every state, and only the maxed-out state changes
// the description: the web budget is gone but the season is still running, so
// the reward stays earnable on mobile, which draws from its own budget group.
const holdCardDescription = computed(() =>
  holdCardStatus.value === 'full'
    ? t('rwaRewards.maxed_out_description')
    : t('rwaRewards.hold_description', {
        amount: qualificationAmount.value,
        total: totalLabel.value,
      }),
)

// `id` is the stable value reported to analytics; the label is localized and
// would otherwise split one funnel across every locale. An empty label hides
// the button — the terminal states only keep "More info".
const holdCardCta = computed<{ label: string; id: string }>(() => {
  switch (holdCardStatus.value) {
    // Stays "Claim" even for an address that can't sign yet: the click routes
    // through the login it needs, so the offer never reads as unavailable.
    case 'claimable':
      return {
        label: t('rwaRewards.claim_amount', { amount: rewardLabel.value }),
        id: 'claim',
      }
    case 'holding':
      return { label: t('rwaRewards.check_progress'), id: 'check_progress' }
    case 'claimed':
      return { label: '', id: 'claimed' }
    // Round 1 can be started over; a finished round 2 is terminal.
    case 'lost':
    case 'expired':
      return canRetryTrade.value
        ? { label: t('rwaRewards.trade_again'), id: 'trade_again' }
        : { label: '', id: holdCardStatus.value }
    case 'full':
      return { label: t('rwaRewards.continue'), id: 'continue_mew_mobile' }
    default:
      return { label: t('rwaRewards.trade'), id: 'trade' }
  }
})

// Only the states with something actionable keep a live button, and the claim
// is held closed while one is already in flight.
const holdPrimaryDisabled = computed(
  () =>
    !['ongoing', 'holding', 'claimable', 'full', 'lost', 'expired'].includes(
      holdCardStatus.value,
    ) ||
    (holdCardStatus.value === 'claimable' && isClaiming.value),
)

const onHoldPrimary = async () => {
  if (holdCardStatus.value === 'claimable') {
    // Same guards as the top card and the offer modal: a watch-only address is
    // sent to log in, and a claim already in flight is left alone.
    if (isWatchOnly.value) {
      openAccessDialog()
      return
    }
    const reward = activeReward.value
    if (!reward || isClaiming.value) return
    // Toasts (success/error) are emitted by holdingsStore.claim itself.
    await holdingsStore.claim(reward)
    return
  }
  if (holdCardStatus.value === 'holding') {
    onMoreInfo()
    return
  }
  if (holdCardStatus.value === 'full') {
    window.open(configs.MEW_MOBILE_DOWNLOAD_URL, '_blank', 'noopener')
    return
  }
  onTradeCampaign()
}

// "2 weeks" when the hold is a whole number of weeks, "10 days" otherwise.
const heldForDuration = computed(() => {
  const days = holdTotalDays.value
  if (days > 0 && days % 7 === 0) {
    const weeks = days / 7
    return `${weeks} ${t('rwaRewards.unit_week', weeks)}`
  }
  return `${days} ${t('rwaRewards.unit_day', days)}`
})

const holdCardStatusText = computed(() => {
  switch (holdCardStatus.value) {
    case 'holding': {
      const count = daysUntil(activeReward.value?.qualification_timestamp) ?? 0
      return t(
        'rwaRewards.hold_for_more_days',
        { count, amount: rewardLabel.value },
        count,
      )
    }
    case 'claimable':
      return t('rwaRewards.held_for', { duration: heldForDuration.value })
    case 'claimed':
      return t('rwaRewards.reward_claimed')
    case 'lost':
      return t('rwaRewards.not_held_long_enough')
    case 'expired':
      return t('rwaRewards.reward_expired')
    case 'paused':
      return t('rwaRewards.temporarily_paused')
    // Per design, the maxed-out card carries the "Trading period ended" badge —
    // the web side of the campaign is over even though the season is still running.
    case 'full':
    case 'ended':
      return t('rwaRewards.campaign_ended')
    case 'underReview':
      return t('rwaRewards.under_review')
    case 'banned':
      return t('rwaRewards.modal_banned_title')
    case 'notEligible':
      return t('rwaRewards.modal_not_eligible_title')
    default: {
      // `/info` can come back without a season end. There is no countdown to
      // show then, so the badge is left empty and the card hides it entirely.
      const daysLeft = daysUntil(seasonEnd.value)
      if (daysLeft === null) return ''
      return t('rwaRewards.ends_in_days', { count: daysLeft }, daysLeft)
    }
  }
})
</script>

<style scoped>
.carousel-track {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.carousel-track::-webkit-scrollbar {
  display: none;
}
</style>
