<template>
  <div
    v-if="banner"
    data-test="rwa-home-banner"
    :data-status="status"
    class="flex items-center gap-4 w-full min-h-[80px] px-5 py-4 rounded-16 border border-[#e6e6e6] bg-white"
  >
    <img
      :src="peggyIcon"
      alt=""
      class="pointer-events-none select-none w-10 h-10 shrink-0 object-contain"
    />
    <div class="flex flex-col flex-1 min-w-0">
      <p
        class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
      >
        {{ banner.title }}
      </p>
      <p class="text-s-14 leading-5 text-[#575757]">
        {{ banner.description }}
      </p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      <button
        v-if="banner.secondary"
        type="button"
        class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-primary hoverOpacity whitespace-nowrap"
        data-test="rwa-home-banner-secondary"
        @click="onSecondary"
      >
        {{ banner.secondary.label }}
      </button>
      <app-base-button
        v-if="banner.primary"
        size="medium"
        :is-loading="banner.primary.id === 'claim' && isClaiming"
        class="whitespace-nowrap text-s-14 font-semibold tracking-[-0.28px]"
        data-test="rwa-home-banner-primary"
        @click="onPrimary"
      >
        {{ banner.primary.label }}
      </app-base-button>
      <app-btn-icon-close
        class="bg-transparent"
        :aria-label="$t('rwaRewards.banner_dismiss')"
        data-test="rwa-home-banner-dismiss"
        @close="onDismiss"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useStorage } from '@vueuse/core'
import { safeLocalStorage } from '@/utils/safeStorage'
import peggyIcon from '@/assets/images/rwa-rewards/peggy-cool-thumbsup.webp'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useCountdown } from '@/modules/rwa_rewards/composables/useCountdown'
import {
  analytics,
  HoldRewardsHomeBannerEvent,
  RerwadsAndOffersEvent,
} from '@/analytics'

interface BannerCta {
  label: string
  id: 'trade' | 'trade_again' | 'claim' | 'check_progress' | 'more_info'
}
interface BannerContent {
  title: string
  description: string
  primary?: BannerCta
  secondary?: BannerCta
}

const { t } = useI18n()
const holdingsStore = useHoldingsStore()
const walletMenuStore = useWalletMenuStore()
const { isWatchOnly } = storeToRefs(useWalletStore())
const { openAccessDialog } = useAccessStore()
const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())
const {
  status,
  activeReward,
  isClaiming,
  canRegisterTrade,
  canRetryTrade,
  qualificationAmount,
  isRoundTwoActive,
  hasRoundTwo,
  round2HoldDays,
  totalHoldDays,
  rewardAmountLabel,
  round1RewardAmountLabel,
  round2RewardAmountLabel,
  totalRewardAmountLabel,
} = storeToRefs(holdingsStore)

const round = computed<1 | 2>(() => (isRoundTwoActive.value ? 2 : 1))

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
const totalLabel = computed(
  () => totalRewardAmountLabel.value ?? round1Label.value,
)

const { remainingMs: holdRemaining } = useCountdown(
  () => activeReward.value?.qualification_timestamp,
)
const daysLeft = computed(() =>
  Math.max(0, Math.ceil((holdRemaining.value ?? 0) / 86_400_000)),
)

/**
 * One banner per moment in the campaign. States with nothing to say on the
 * home page — a completed season, a blocked or paused wallet — return null
 * and the banner stays out of the layout.
 */
const content = computed<BannerContent | null>(() => {
  const moreInfo: BannerCta = {
    label: t('rwaRewards.more_info'),
    id: 'more_info',
  }
  switch (status.value) {
    case 'default':
      // A promo only while the season still registers trades.
      if (!canRegisterTrade.value || isTradingRestrictedInRegion.value)
        return null
      return {
        title: t('rwaRewards.banner_default_title', {
          total: totalLabel.value,
        }),
        description: t('rwaRewards.banner_default_desc', {
          amount: qualificationAmount.value,
        }),
        secondary: moreInfo,
        primary: {
          label: t('rwaRewards.trade_amount', {
            amount: qualificationAmount.value,
          }),
          id: 'trade',
        },
      }
    case 'holding': {
      const count = daysLeft.value
      return {
        title: t('rwaRewards.banner_holding_title', { count }, count),
        description: t(
          'rwaRewards.banner_holding_desc',
          { count, amount: rewardLabel.value },
          count,
        ),
        secondary: {
          label: t('rwaRewards.check_progress'),
          id: 'check_progress',
        },
      }
    }
    case 'earned': {
      const r2Days = round2HoldDays.value
      let description = t('rwaRewards.hero_earned_desc')
      if (isRoundTwoActive.value)
        description = t('rwaRewards.hero_earned_desc_total', {
          count: totalHoldDays.value,
        })
      else if (hasRoundTwo.value && r2Days)
        description = t(
          'rwaRewards.banner_earned_desc_next',
          { amount: round2Label.value, count: r2Days },
          r2Days,
        )
      return {
        title: t('rwaRewards.banner_earned_title'),
        description,
        secondary: moreInfo,
        primary: {
          label: t('rwaRewards.claim_amount', { amount: rewardLabel.value }),
          id: 'claim',
        },
      }
    }
    case 'lost':
    case 'expired': {
      const lost = status.value === 'lost'
      // Round 1 can be started over; a finished round 2 is terminal, so the
      // banner only states what happened.
      const retry = canRetryTrade.value
      return {
        title: lost
          ? t('rwaRewards.not_held_long_enough')
          : t('rwaRewards.reward_expired'),
        description: lost
          ? t('rwaRewards.hero_lost_desc')
          : t('rwaRewards.hero_expired_desc'),
        secondary: retry ? moreInfo : undefined,
        primary: retry
          ? { label: t('rwaRewards.trade_again'), id: 'trade_again' }
          : undefined,
      }
    }
    default:
      return null
  }
})

// Dismissal is per moment: hiding the "hold for 9 more days" banner must not
// also hide the "here's your reward" one that follows. Persisted so a reload
// doesn't bring a dismissed banner back.
const dismissedKeys = useStorage<string[]>(
  'mew-rwa-home-banner-dismissed',
  [],
  safeLocalStorage,
)
const stateKey = computed(
  () => `${activeReward.value?.uuid ?? 'offer'}:${status.value}:${round.value}`,
)
const isDismissed = computed(() => dismissedKeys.value.includes(stateKey.value))
const banner = computed(() => (isDismissed.value ? null : content.value))

const trackCta = (cta: string) =>
  analytics.trackRewardsAndOffersEvent(RerwadsAndOffersEvent.CLICKED_CTA, {
    campaign: 'hold',
    cta,
    card_status: status.value,
    round: round.value,
    location: 'home_banner',
  })

const onDismiss = () => {
  if (!dismissedKeys.value.includes(stateKey.value))
    dismissedKeys.value = [...dismissedKeys.value, stateKey.value]
  analytics.trackHoldRewardsHomeBannerEvent(
    HoldRewardsHomeBannerEvent.DISMISSED,
    { status: status.value, round: round.value },
  )
}

const openModal = () => holdingsStore.openModal()

const onSecondary = () => {
  const cta = banner.value?.secondary
  if (!cta) return
  if (cta.id === 'more_info') {
    analytics.trackRewardsAndOffersEvent(
      RerwadsAndOffersEvent.CLICKED_MORE_INFO,
      {
        campaign: 'hold',
        cta: 'more_info',
        card_status: status.value,
        round: round.value,
        location: 'home_banner',
      },
    )
  } else {
    trackCta(cta.id)
  }
  openModal()
}

const onPrimary = async () => {
  const cta = banner.value?.primary
  if (!cta) return
  trackCta(cta.id)
  if (cta.id === 'claim') {
    // Same guards as the cards: a watch-only address is sent to log in, and a
    // claim already in flight is left alone.
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
  walletMenuStore.openPanel('trade')
}

// One impression per banner moment.
watch(
  banner,
  (current, previous) => {
    if (!current || current === previous) return
    analytics.trackHoldRewardsHomeBannerEvent(
      HoldRewardsHomeBannerEvent.SHOWN,
      {
        status: status.value,
        round: round.value,
      },
    )
  },
  { immediate: true },
)
</script>
