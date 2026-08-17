<template>
  <div>
    <button
      v-if="showBanner"
      class="w-full hoverNoBG rounded-16 flex items-center justify-between border border-solid p-4 gap-5"
      :class="qualifies ? 'border-success' : 'border-grey-10'"
      @click="onClick"
    >
      <!-- Variation 1: Trade qualifies for rewards -->
      <div v-if="qualifies" class="flex items-center gap-3">
        <check-circle-icon class="w-6 h-6 text-success shrink-0" />
        <p class="text-s-14 font-semibold">
          {{ t('rewards.trade_qualifies') }}
        </p>
      </div>

      <!-- Variations 2 & 3: Trade is not eligible for rewards -->
      <div v-else class="flex items-center gap-3 text-s-14">
        <exclamation-circle-icon class="w-6 h-6 text-warning shrink-0" />
        <div class="text-left">
          <p class="font-semibold">{{ t('rewards.trade_not_eligible') }}</p>
          <!-- Variation 3: cash out transactions never qualify -->
          <p v-if="isCashout && canClaimHold" class="text-info mt-[2px]">
            {{ t('rewards.cashout_not_qualify') }}
          </p>
          <!-- Variation 2: below the minimum spend threshold -->
          <p v-else class="text-info mt-[2px]">
            {{ t('rewards.trade_more_to_qualify', { amount: amountNeeded }) }}
          </p>
        </div>
      </div>
      <chevron-right-icon class="w-4 h-4" />
    </button>
    <rwa-trade-info-modal v-model:is-open="isTradeInfoOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid'

const { t } = useI18n()
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import {
  analytics,
  TradeConfirmationBannerEvent,
  RerwadsAndOffersEvent,
} from '@/analytics'

const props = defineProps<{
  // USD value of the trade (the amount being spent)
  tradeAmount: string
  // Whether the trade is a cash out (selling a tradable asset for a supporting asset)
  isCashout: boolean
}>()

const rewardsStore = useRewardsStore()
const { isBanned, canClaimTradeReward } = storeToRefs(rewardsStore)

const canClaimTrade = computed(
  () => canClaimTradeReward.value && isBanned.value === false,
)
const holdingsStore = useHoldingsStore()
const { status, canRegisterTrade } = storeToRefs(holdingsStore)

// Only surface the hold campaign while a new trade can still be registered for
// it — otherwise fall through to the trade campaign.
const canClaimHold = computed(
  () =>
    canRegisterTrade.value &&
    (status.value === 'default' ||
      status.value === 'expired' ||
      status.value === 'lost'),
)

// Which reward campaign this banner is surfacing
const campaign = computed<'hold' | 'trade'>(() =>
  canClaimHold.value ? 'hold' : 'trade',
)

const isTradeInfoOpen = ref(false)
const onClick = () => {
  analytics.trackRewardsAndOffersEvent(
    RerwadsAndOffersEvent.CLICKED_MORE_INFO,
    {
      campaign: campaign.value,
      cta: qualifies.value ? 'qualifies' : 'not_eligible',
      location: 'trade_confirmation',
    },
  )
  if (canClaimHold.value) {
    holdingsStore.openModal()
  } else {
    isTradeInfoOpen.value = true
    return
  }
}

// Minimum USD spend required to qualify for a trade reward
const MIN_SPEND_HOLD = 100

const minSpend = computed(() =>
  canClaimHold.value
    ? MIN_SPEND_HOLD
    : canClaimTrade.value
      ? Number(rewardsStore.minSpendTrade)
      : 0,
)

// Only render once we know the threshold, or for cash outs (which never qualify)
const showBanner = computed(() => canClaimHold.value || canClaimTrade.value)

const toAmountNumber = computed(() => Number(props.tradeAmount))

const qualifies = computed(() => {
  const spendingThresholdReached =
    minSpend.value > 0 && toAmountNumber.value >= minSpend.value
  if (canClaimHold.value) return spendingThresholdReached && !props.isCashout
  return spendingThresholdReached && canClaimTrade.value
})

// How much more (USD) the user needs to trade to reach the threshold
const amountNeeded = computed(() => {
  const diff = minSpend.value - toAmountNumber.value
  return diff > 0 ? diff.toFixed(2) : '0.00'
})

// Report the banner impression once it becomes visible
watch(
  showBanner,
  visible => {
    if (visible) {
      analytics.trackTradeConfirmationBannerEvent(
        TradeConfirmationBannerEvent.SHOWN,
        {
          campaign: campaign.value,
          isQualified: qualifies.value,
        },
      )
    }
  },
  { immediate: true },
)
</script>
