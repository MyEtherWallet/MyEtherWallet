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

    <template v-if="status === 'holding'">
      <div class="relative z-10 w-full">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black max-w-[210px]"
        >
          {{ $t('rwaRewards.hero_holding_title') }}
        </p>
      </div>

      <div class="relative z-10 flex flex-col gap-4 w-full">
        <rwa-hold-tracker
          :current="holdCurrent"
          :days-left-label="daysLeftLabel"
        />
        <app-base-button
          theme="neutral"
          class="w-full text-s-16 font-semibold tracking-[-0.32px]"
          @click="onMoreInfo"
        >
          {{ $t('rwaRewards.more_info') }}
        </app-base-button>
      </div>
    </template>

    <template v-else-if="status === 'lost'">
      <div class="relative z-10 flex flex-col gap-1 max-w-[200px]">
        <!-- A season that has already ended has nothing left to count down
             to; the countdown would sit at "0 seconds". -->
        <p
          v-if="!isCampaignEnded"
          class="text-s-12 font-normal leading-[18px] text-[#575757] whitespace-nowrap"
        >
          {{ $t('rwaRewards.hero_offer_expires', { time: expiresText }) }}
        </p>
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
        <rwa-hold-tracker :current="holdCurrent" :failed-day="holdCurrent" />
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
            class="flex-1 text-s-16 font-semibold tracking-[-0.32px]"
            @click="onTrade"
          >
            {{ $t('rwaRewards.trade_again') }}
          </app-base-button>
          <app-base-button
            theme="neutral"
            class="text-s-16 font-semibold tracking-[-0.32px]"
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </app-base-button>
        </div>
      </div>
    </template>

    <template v-else-if="status === 'earned'">
      <div class="relative z-10 flex flex-col gap-1 max-w-[200px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black"
        >
          {{ $t('rwaRewards.hero_earned_title') }}
        </p>
        <p class="text-s-12 leading-[18px] text-[#575757]">
          {{ $t('rwaRewards.hero_earned_desc') }}
        </p>
      </div>
      <rwa-claim-card
        class="relative z-10"
        variant="claim"
        :amount-label="$t('rwaRewards.reward_amount')"
        :subtitle="subExpiresLabel"
        :claim-label="$t('rwaRewards.claim')"
        :loading="isClaiming"
        @claim="onClaim"
      />
    </template>

    <template v-else-if="status === 'claimed'">
      <div class="relative z-10 flex flex-col gap-1 max-w-[200px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black whitespace-pre-line"
        >
          {{ $t('rwaRewards.hero_claimed_title') }}
        </p>
        <p class="text-s-12 leading-[18px] text-[#575757]">
          {{ $t('rwaRewards.hero_claimed_desc') }}
        </p>
      </div>
      <div class="relative z-10 flex flex-col gap-4 w-full">
        <rwa-claim-card
          variant="sent"
          :amount-label="$t('rwaRewards.reward_amount')"
          :subtitle="$t('rwaRewards.sub_sent')"
        />
        <app-base-button
          theme="neutral"
          class="w-full text-s-16 font-semibold tracking-[-0.32px]"
          @click="onHide"
        >
          {{ $t('rwaRewards.hide_offer') }}
        </app-base-button>
      </div>
    </template>

    <template v-else-if="status === 'expired'">
      <div class="relative z-10 flex flex-col gap-1 max-w-[200px]">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black whitespace-pre-line"
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
          :amount-label="$t('rwaRewards.reward_amount')"
          :subtitle="$t('rwaRewards.sub_closed')"
        />
        <app-base-button
          theme="neutral"
          class="w-full text-s-16 font-semibold tracking-[-0.32px]"
          @click="onHide"
        >
          {{ $t('rwaRewards.hide_offer') }}
        </app-base-button>
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

    <template v-else>
      <div class="relative z-10 flex flex-col gap-1 w-full pr-[90px]">
        <p
          v-if="!isCampaignEnded"
          class="text-s-14 font-normal leading-5 text-[#575757] whitespace-nowrap"
        >
          {{ $t('rwaRewards.hero_offer_expires', { time: expiresText }) }}
        </p>
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black whitespace-pre-line"
        >
          {{ $t('rwaRewards.hero_title') }}
        </p>
      </div>

      <div class="relative z-10 flex flex-col gap-4 w-full">
        <div class="flex flex-col w-full">
          <rwa-modal-step
            v-for="(step, i) in steps"
            :key="step.n"
            variant="plain"
            :number="step.n"
            :last="i === steps.length - 1"
            path-height="36px"
          >
            <p class="text-s-14 leading-5 text-[#575757] pt-0.5">
              {{ step.pre }}
              <span class="font-semibold text-black tracking-[-0.28px]">{{
                step.bold
              }}</span
              ><span v-if="step.post"> {{ step.post }}</span>
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
            @click="onTrade"
          >
            {{ $t('rwaRewards.trade_now') }}
          </app-base-button>
          <app-base-button
            theme="neutral"
            class="text-[clamp(12px,4.2cqi,16px)] font-semibold tracking-[-0.32px] whitespace-nowrap"
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
  seasonEnd,
  status,
  activeReward,
  isClaiming,
  isHoldOfferDismissed,
  isCampaignFull,
  isCampaignEnded,
  isUnderReview,
  canRegisterTrade,
} = storeToRefs(holdingsStore)
const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())

// The Zero MEW Fees offer is the default eligible offer shown in the hero slot
// when there's no live hold offer to feature: geo-restricted users (no reward
// info) and users who have dismissed their terminal hold offer.
const showZeroFeesOffer = computed(
  () => isTradingRestrictedInRegion.value || isHoldOfferDismissed.value,
)

// Fire a reward-offer CTA event for a main-card action
const trackCta = (cta: string, campaign: 'hold' | 'buy_no_fees' = 'hold') =>
  analytics.trackRewardsAndOffersEvent(RerwadsAndOffersEvent.CLICKED_CTA, {
    campaign,
    cta,
    card_status: status.value,
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
      location: 'main_card',
    },
  )
  holdingsStore.openModal()
}
const onContactSupport = () => {
  trackCta('contact_support')
  showIntercom()
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
const onHide = () => {
  trackCta('hide_offer')
  if (activeReward.value) holdingsStore.dismiss(activeReward.value.uuid)
}

// Report the hold main-card impression once per status while it is visible
// (when the "no fees" card takes over — geo-restricted or dismissed hold offer
// — the hold card isn't shown, so skip; that card is tracked elsewhere).
const lastReportedStatus = ref<string | null>(null)
watch(
  [status, showZeroFeesOffer],
  ([currentStatus, zeroFees]) => {
    if (zeroFees || !currentStatus) return
    if (lastReportedStatus.value === currentStatus) return
    lastReportedStatus.value = currentStatus
    analytics.trackHoldRewardsMainCardEvent(
      HoldRewardsMainCardEvent.MODAL_SHOWN,
      { status: currentStatus },
    )
  },
  { immediate: true },
)
const { text: expiresText } = useCountdown(() => seasonEnd.value)
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
    ? t('rwaRewards.sub_expires', { time: subExpiresText.value })
    : '',
)

const HOLD_TOTAL = 14
const holdCurrent = computed(() => {
  const start = activeReward.value?.start_timestamp
  if (!start) return 1
  const elapsed = Math.floor(
    (Date.now() - new Date(start).getTime()) / 86_400_000,
  )
  return Math.min(Math.max(elapsed + 1, 1), HOLD_TOTAL)
})
const { remainingMs: holdRemaining } = useCountdown(
  () => activeReward.value?.qualification_timestamp,
)
const daysLeftLabel = computed(() => {
  const days = Math.max(0, Math.ceil((holdRemaining.value ?? 0) / 86_400_000))
  return t('rwaRewards.days_left', {
    time: `${days} ${t('rwaRewards.unit_day', days)}`,
  })
})

const steps: { n: number; pre: string; bold: string; post?: string }[] = [
  {
    n: 1,
    pre: t('rwaRewards.hero_step1'),
    bold: t('rwaRewards.hero_step1_bold'),
    post: t('rwaRewards.hero_step1_post'),
  },
  {
    n: 2,
    pre: t('rwaRewards.hero_step2'),
    bold: t('rwaRewards.hero_step2_bold'),
  },
  {
    n: 3,
    pre: t('rwaRewards.hero_step3'),
    bold: t('rwaRewards.hero_step3_bold'),
  },
]
</script>
