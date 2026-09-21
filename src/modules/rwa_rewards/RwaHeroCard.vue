<template>
  <!-- The Zero MEW Fees offer takes the top card's place for geo-restricted
       regions (which never see reward info) and once the hold offer has been
       dismissed — the next eligible offer. -->

  <rwa-reward-card
    campaign="buy_no_fees"
    v-if="showZeroFeesOffer"
    illustration="fees"
    :title="$t('rwaRewards.fees_title')"
    :description="$t('rwaRewards.fees_description')"
    :footnote="$t('rwaRewards.fees_footnote')"
    :primary-label="$t('rwaRewards.buy_assets')"
    @primary="onBuy"
  />
  <div
    v-else
    class="relative isolate bg-white overflow-hidden flex flex-col justify-between items-start h-full border border-[#e6e6e6] rounded-16 p-5 min-h-[293px]"
    :data-test="`rwa-hero-${status}`"
  >
    <img
      v-if="status !== 'banned'"
      :src="gradientBg"
      alt=""
      class="pointer-events-none select-none absolute top-0 left-0 w-full h-[140px] object-cover object-top"
    />
    <img
      v-if="status === 'lost' || status === 'expired'"
      :src="peggyCrying"
      alt=""
      class="pointer-events-none select-none absolute top-5 right-5 h-[84px] object-contain"
    />
    <img
      v-else-if="status === 'earned' || status === 'claimed'"
      :src="peggyCool"
      alt=""
      class="pointer-events-none select-none absolute top-5 right-5 h-[84px] object-contain"
    />
    <img
      v-else-if="status !== 'banned'"
      :src="heroImg"
      alt=""
      class="pointer-events-none select-none absolute top-0 right-0 w-[108px] h-[120px] object-contain"
    />

    <!-- HOLDING — either round: title, days left, the day grid. -->
    <template v-if="status === 'holding'">
      <div class="relative z-10 w-full pr-[90px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black whitespace-pre-line"
        >
          {{ holdingTitle }}
        </p>
      </div>

      <div class="relative z-10 flex flex-col gap-3 w-full">
        <div class="flex items-center justify-between gap-2 w-full">
          <p
            class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black"
          >
            {{ daysLeftLabel }}
          </p>
          <button
            type="button"
            class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-primary hoverOpacity"
            data-test="rwa-hero-more-info"
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </button>
        </div>
        <rwa-hold-tracker :current="holdCurrent" :total="holdTotalDays" />
      </div>
    </template>

    <!-- LOST — the hold was broken. Round 1 can start over; round 2 can't. -->
    <template v-else-if="status === 'lost'">
      <div class="relative z-10 flex flex-col gap-1 max-w-[220px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black"
        >
          {{ $t('rwaRewards.hero_lost_title') }}
        </p>
        <p class="text-s-12 leading-[18px] text-[#575757]">
          {{ $t('rwaRewards.hero_lost_desc') }}
        </p>
      </div>

      <div class="relative z-10 flex flex-col gap-4 w-full">
        <rwa-hold-tracker
          :current="holdCurrent"
          :failed-day="holdCurrent"
          :total="holdTotalDays"
        />
        <div class="flex gap-2 w-full [container-type:inline-size]">
          <template v-if="!isRoundTwoActive">
            <app-tooltip
              v-if="isDisabledCta"
              :text="disabledCtaTooltip"
              position="middle"
              class="flex-1"
            >
              <button
                class="flex items-center justify-center w-full h-12 px-4 gap-2 rounded-24 bg-[#f5f5f5] text-[#767676] text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] cursor-pointer whitespace-nowrap"
                disabled
              >
                {{ disabledCtaLabel }}
                <information-circle-icon class="w-[22px] h-[22px] shrink-0" />
              </button>
            </app-tooltip>
            <app-base-button
              v-else
              class="flex-1 text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] whitespace-nowrap"
              data-test="rwa-hero-trade"
              @click="onTrade"
            >
              {{ tradeLabel }}
            </app-base-button>
          </template>
          <app-base-button
            theme="neutral"
            :class="isRoundTwoActive ? 'w-full' : ''"
            class="text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] whitespace-nowrap"
            data-test="rwa-hero-more-info"
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </app-base-button>
        </div>
      </div>
    </template>

    <!-- EARNED — claimable. Round 1 points at the bonus that follows. -->
    <template v-else-if="status === 'earned'">
      <div class="relative z-10 flex flex-col gap-1 max-w-[220px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black whitespace-pre-line"
        >
          {{ $t('rwaRewards.hero_earned_title') }}
        </p>
        <p class="text-s-12 leading-[18px] text-[#575757]">
          {{ earnedDescription }}
        </p>
      </div>
      <rwa-claim-card
        class="relative z-10"
        variant="claim"
        :amount-label="rewardLabel"
        :subtitle="subExpiresLabel"
        :claim-label="$t('rwaRewards.claim')"
        :loading="isClaiming"
        @claim="onClaim"
      />
    </template>

    <!-- CLAIMED — the season is complete for this wallet, or the first
         reward is paid with no bonus round open (notice lives in the modal). -->
    <template v-else-if="status === 'claimed'">
      <template v-if="isSeasonComplete">
        <div class="relative z-10 flex flex-col gap-1 max-w-[220px]">
          <p
            class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black whitespace-pre-line"
          >
            {{ $t('rwaRewards.hero_done_title') }}
          </p>
          <p class="text-s-12 leading-[18px] text-[#575757]">
            {{ $t('rwaRewards.hero_done_desc', { total: earnedTotalLabel }) }}
          </p>
        </div>
        <app-base-button
          class="relative z-10 w-full text-s-16 font-semibold tracking-[-0.32px]"
          data-test="rwa-hero-explore"
          @click="onExploreRewards"
        >
          {{ $t('rwaRewards.explore_all_rewards') }}
        </app-base-button>
      </template>
      <template v-else>
        <div class="relative z-10 flex flex-col gap-1 max-w-[220px]">
          <p
            class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black"
          >
            {{ $t('rwaRewards.hero_claimed_title') }}
          </p>
          <p class="text-s-12 leading-[18px] text-[#575757]">
            {{ $t('rwaRewards.hero_claimed_desc', { amount: rewardLabel }) }}
          </p>
        </div>
        <div class="relative z-10 flex flex-col gap-4 w-full">
          <rwa-claim-card
            variant="sent"
            :amount-label="rewardLabel"
            :subtitle="$t('rwaRewards.sub_sent')"
          />
          <app-base-button
            theme="neutral"
            class="w-full text-s-16 font-semibold tracking-[-0.32px]"
            data-test="rwa-hero-more-info"
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </app-base-button>
        </div>
      </template>
    </template>

    <!-- EXPIRED — the claim window closed. Round 1 can start over. -->
    <template v-else-if="status === 'expired'">
      <div class="relative z-10 flex flex-col gap-1 max-w-[220px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black"
        >
          {{ $t('rwaRewards.hero_expired_title') }}
        </p>
        <p class="text-s-12 leading-[18px] text-[#575757]">
          {{ $t('rwaRewards.hero_expired_desc') }}
        </p>
      </div>
      <div class="relative z-10 flex flex-col gap-4 w-full">
        <rwa-claim-card
          variant="closed"
          :amount-label="rewardLabel"
          :subtitle="$t('rwaRewards.reward_expired')"
        />
        <div class="flex gap-2 w-full [container-type:inline-size]">
          <template v-if="!isRoundTwoActive">
            <app-tooltip
              v-if="isDisabledCta"
              :text="disabledCtaTooltip"
              position="middle"
              class="flex-1"
            >
              <button
                class="flex items-center justify-center w-full h-12 px-4 gap-2 rounded-24 bg-[#f5f5f5] text-[#767676] text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] cursor-pointer whitespace-nowrap"
                disabled
              >
                {{ disabledCtaLabel }}
                <information-circle-icon class="w-[22px] h-[22px] shrink-0" />
              </button>
            </app-tooltip>
            <app-base-button
              v-else
              class="flex-1 text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] whitespace-nowrap"
              data-test="rwa-hero-trade"
              @click="onTrade"
            >
              {{ tradeLabel }}
            </app-base-button>
          </template>
          <app-base-button
            theme="neutral"
            :class="isRoundTwoActive ? 'w-full' : ''"
            class="text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] whitespace-nowrap"
            data-test="rwa-hero-more-info"
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </app-base-button>
        </div>
      </div>
    </template>

    <template v-else-if="status === 'banned'">
      <div
        class="relative z-10 flex flex-col items-center justify-center h-full w-full gap-6"
      >
        <div class="flex flex-col items-center gap-4">
          <lock-closed-icon class="w-7 h-7 text-primary" />
          <p class="text-s-14 font-normal leading-5 text-[#575757] text-center">
            {{ $t('rwaRewards.hero_banned_text') }}
          </p>
        </div>
        <app-base-button
          theme="neutral"
          class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
          @click="onContactSupport"
        >
          {{ $t('rwaRewards.contact_support') }}
        </app-base-button>
      </div>
    </template>

    <!-- DEFAULT — the offer: both rounds spelled out. -->
    <template v-else>
      <div class="relative z-10 flex flex-col gap-1 w-full pr-[90px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black whitespace-pre-line"
        >
          {{ headline }}
        </p>
      </div>

      <div class="relative z-10 flex flex-col gap-4 w-full">
        <div class="flex flex-col w-full">
          <rwa-modal-step
            v-for="(step, i) in offerSteps"
            :key="step.n"
            variant="plain"
            :number="step.n"
            :last="i === offerSteps.length - 1"
            path-height="36px"
          >
            <p class="text-s-14 leading-5 text-black pt-0.5">
              {{ step.text }}
            </p>
          </rwa-modal-step>
        </div>

        <div class="flex gap-2 w-full [container-type:inline-size]">
          <app-tooltip
            v-if="isDisabledCta"
            :text="disabledCtaTooltip"
            position="middle"
            class="flex-1"
          >
            <button
              class="flex items-center justify-center w-full h-12 px-4 gap-2 rounded-24 bg-[#f5f5f5] text-[#767676] text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] cursor-pointer whitespace-nowrap"
              disabled
            >
              {{ disabledCtaLabel }}
              <information-circle-icon class="w-[22px] h-[22px] shrink-0" />
            </button>
          </app-tooltip>
          <app-base-button
            v-else
            class="flex-1 text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] whitespace-nowrap"
            data-test="rwa-hero-trade"
            @click="onTrade"
          >
            {{ tradeLabel }}
          </app-base-button>
          <app-base-button
            theme="neutral"
            class="text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] whitespace-nowrap"
            data-test="rwa-hero-more-info"
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </app-base-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { show as showIntercom } from '@intercom/messenger-js-sdk'
import gradientBg from '@/assets/images/rwa-rewards/card-gradient-bg.png'
import heroImg from '@/assets/images/rwa-rewards/hold-and-get-usdc.webp'
import peggyCrying from '@/assets/images/rwa-rewards/peggy-crying.webp'
import peggyCool from '@/assets/images/rwa-rewards/peggy-cool-thumbsup.webp'
import configs from '@/configs'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useCountdown } from '@/modules/rwa_rewards/composables/useCountdown'
import RwaHoldTracker from '@/modules/rwa_rewards/RwaHoldTracker.vue'
import RwaClaimCard from '@/modules/rwa_rewards/RwaClaimCard.vue'
import RwaModalStep from '@/modules/rwa_rewards/RwaModalStep.vue'
import RwaRewardCard from '@/modules/rwa_rewards/RwaRewardCard.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import {
  analytics,
  HoldRewardsMainCardEvent,
  RerwadsAndOffersEvent,
} from '@/analytics'

const { t } = useI18n()

const holdingsStore = useHoldingsStore()
const walletMenuStore = useWalletMenuStore()
const {
  status,
  activeReward,
  isClaiming,
  isHoldOfferDismissed,
  isCampaignFull,
  isUnderReview,
  canRegisterTrade,
  qualificationAmount,
  isRoundTwoActive,
  holdTotalDays,
  hasRoundTwo,
  round1HoldDays,
  round2HoldDays,
  totalHoldDays,
  rewardAmountLabel,
  round1RewardAmountLabel,
  round2RewardAmountLabel,
  totalRewardAmountLabel,
} = storeToRefs(holdingsStore)
const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())

// The Zero MEW Fees offer is the default eligible offer shown in the hero slot
// when there's no live hold offer to feature: geo-restricted users (no reward
// info) and users who have dismissed their terminal hold offer.
const showZeroFeesOffer = computed(
  () => isTradingRestrictedInRegion.value || isHoldOfferDismissed.value,
)

const round = computed<1 | 2>(() => (isRoundTwoActive.value ? 2 : 1))

// Fire a reward-offer CTA event for a main-card action
const trackCta = (cta: string, campaign: 'hold' | 'buy_no_fees' = 'hold') =>
  analytics.trackRewardsAndOffersEvent(RerwadsAndOffersEvent.CLICKED_CTA, {
    campaign,
    cta,
    card_status: status.value,
    round: round.value,
    location: 'main_card',
  })

const onTrade = () => {
  trackCta('trade')
  walletMenuStore.openPanel('trade')
}
const onBuy = () => {
  trackCta('buy', 'buy_no_fees')
  walletMenuStore.openPanel('purchase')
}
const onMoreInfo = () => {
  analytics.trackRewardsAndOffersEvent(
    RerwadsAndOffersEvent.CLICKED_MORE_INFO,
    {
      campaign: 'hold',
      cta: 'more_info',
      card_status: status.value,
      round: round.value,
      location: 'main_card',
    },
  )
  holdingsStore.openModal()
}
const onContactSupport = () => {
  trackCta('contact_support')
  showIntercom()
}
const onExploreRewards = () => {
  trackCta('explore_rewards')
  window.open(configs.REWARDS_PAGE_URL, '_blank', 'noopener')
}

// Covers the promo CTA and the "Trade again" retry, both of which would
// otherwise invite a trade the season can no longer register.
const isDisabledCta = computed(
  () => status.value === 'notEligible' || !canRegisterTrade.value,
)
const disabledCtaLabel = computed(() => {
  if (isUnderReview.value) return t('rwaRewards.under_review')
  if (status.value === 'temporarilyPaused')
    return t('rwaRewards.temporarily_paused')
  if (status.value === 'campaignEnded') return t('rwaRewards.campaign_ended')
  if (isCampaignFull.value) return t('rwaRewards.campaign_full')
  return t('rwaRewards.not_eligible')
})
const disabledCtaTooltip = computed(() => {
  if (isUnderReview.value) return t('rwaRewards.under_review_tooltip')
  if (status.value === 'temporarilyPaused')
    return t('rwaRewards.temporarily_paused_tooltip')
  if (status.value === 'campaignEnded') return t('rwaRewards.campaign_ended')
  if (isCampaignFull.value) return t('rwaRewards.campaign_full_tooltip')
  return t('rwaRewards.not_eligible_tooltip')
})

const onClaim = async () => {
  if (isClaiming.value) return
  trackCta('claim')
  if (activeReward.value) await holdingsStore.claim(activeReward.value)
}

// Report the hold main-card impression once per status while it is visible
// (when the "no fees" card takes over — geo-restricted or dismissed hold offer
// — the hold card isn't shown, so skip; that card is tracked elsewhere).
const lastReportedStatus = ref<string | null>(null)
watch(
  [status, showZeroFeesOffer, round],
  ([currentStatus, zeroFees, currentRound]) => {
    if (zeroFees || !currentStatus) return
    const key = `${currentStatus}:${currentRound}`
    if (lastReportedStatus.value === key) return
    lastReportedStatus.value = key
    analytics.trackHoldRewardsMainCardEvent(
      HoldRewardsMainCardEvent.MODAL_SHOWN,
      { status: currentStatus, round: currentRound },
    )
  },
  { immediate: true },
)

// Strictly the reward's own claim deadline — never the season end. The two are
// different deadlines, and `expiration_timestamp` is optional: the store reads
// its absence as "never expires" (see `isClaimable`), so substituting the
// season end would put a countdown on a reward that has none.
const { text: subExpiresText } = useCountdown(
  () => activeReward.value?.expiration_timestamp,
)
// Nothing to say when the reward carries no deadline.
const subExpiresLabel = computed(() =>
  activeReward.value?.expiration_timestamp
    ? t('rwaRewards.expires_in', { time: subExpiresText.value })
    : '',
)

const holdCurrent = computed(() => {
  const start = activeReward.value?.start_timestamp
  if (!start) return 1
  const elapsed = Math.floor(
    (Date.now() - new Date(start).getTime()) / 86_400_000,
  )
  return Math.min(Math.max(elapsed + 1, 1), holdTotalDays.value)
})

// Server-driven when the season block has landed; the campaign's advertised
// round-1 copy otherwise.
const round1Label = computed(
  () => round1RewardAmountLabel.value ?? t('rwaRewards.reward_amount'),
)
const round2Label = computed(
  () => round2RewardAmountLabel.value ?? round1Label.value,
)
const rewardLabel = computed(
  () => rewardAmountLabel.value ?? t('rwaRewards.reward_amount'),
)
const earnedTotalLabel = computed(
  () => totalRewardAmountLabel.value ?? rewardLabel.value,
)

// "Hold and get up to 25 USDC" once both rounds' amounts are known; the
// single-round headline otherwise.
const headline = computed(() =>
  hasRoundTwo.value && totalRewardAmountLabel.value
    ? t('rwaRewards.hero_title_total', { total: totalRewardAmountLabel.value })
    : t('rwaRewards.hero_title', { amount: round1Label.value }),
)
const tradeLabel = computed(() =>
  t('rwaRewards.trade_amount', { amount: qualificationAmount.value }),
)

// "Hold for 14 days. Get 10 USDC." — the active round's length and reward.
const holdingTitle = computed(() =>
  t(
    'rwaRewards.hero_holding_title',
    { count: holdTotalDays.value, amount: rewardLabel.value },
    holdTotalDays.value,
  ),
)

const { remainingMs: holdRemaining } = useCountdown(
  () => activeReward.value?.qualification_timestamp,
)
const daysLeftLabel = computed(() => {
  const days = Math.max(0, Math.ceil((holdRemaining.value ?? 0) / 86_400_000))
  return t('rwaRewards.days_left', {
    time: `${days} ${t('rwaRewards.unit_day', days)}`,
  })
})

// Round 1 points ahead at the bonus; round 2 looks back at the whole hold.
const earnedDescription = computed(() => {
  if (isRoundTwoActive.value)
    return t('rwaRewards.hero_earned_desc_total', {
      count: totalHoldDays.value,
    })
  const r2Days = round2HoldDays.value
  if (hasRoundTwo.value && r2Days)
    return t(
      'rwaRewards.hero_earned_desc_next',
      { amount: round2Label.value, count: r2Days },
      r2Days,
    )
  return t('rwaRewards.hero_earned_desc')
})

// Both rewards paid, or the only reward on a single-round season.
const isSeasonComplete = computed(
  () => isRoundTwoActive.value || !hasRoundTwo.value,
)

// Computed, not a plain array: the qualification amount arrives with `/info` after
// setup runs, and a once-evaluated array would keep showing the pre-load placeholder.
const offerSteps = computed<{ n: number; text: string }[]>(() => {
  const r1Days = round1HoldDays.value
  const steps = [
    {
      n: 1,
      text: t('rwaRewards.hero_step_trade', {
        amount: qualificationAmount.value,
      }),
    },
    {
      n: 2,
      text: t(
        'rwaRewards.hero_step_hold',
        { count: r1Days, amount: round1Label.value },
        r1Days,
      ),
    },
  ]
  const r2Days = round2HoldDays.value
  if (hasRoundTwo.value && r2Days) {
    steps.push({
      n: 3,
      text: t(
        'rwaRewards.hero_step_hold_more',
        { count: r2Days, amount: round2Label.value },
        r2Days,
      ),
    })
  } else {
    steps.push({
      n: 3,
      text: t('rwaRewards.hero_step_claim', { amount: round1Label.value }),
    })
  }
  return steps
})
</script>
