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
        <p class="text-s-14 font-semibold">This trade qualifies for rewards</p>
      </div>

      <!-- Variations 2 & 3: Trade is not eligible for rewards -->
      <div v-else class="flex items-center gap-3 text-s-14">
        <exclamation-circle-icon class="w-6 h-6 text-warning shrink-0" />
        <div class="text-left">
          <p class="font-semibold">This trade isn't eligible for rewards</p>
          <!-- Variation 3: cash out transactions never qualify -->
          <p v-if="isCashout && canClaimHold" class="text-info mt-[2px]">
            Cash out transactions don't qualify for rewards.
          </p>
          <!-- Variation 2: below the minimum spend threshold -->
          <p v-else class="text-info mt-[2px]">
            Trade ${{ amountNeeded }} more to qualify
          </p>
        </div>
      </div>
      <chevron-right-icon class="w-4 h-4" />
    </button>
    <rwa-trade-info-modal v-model:is-open="isTradeInfoOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHoldingsStore } from '@/stores/holdingsStore'

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
const { status } = storeToRefs(holdingsStore)

const canClaimHold = computed(
  () =>
    status.value === 'default' ||
    status.value === 'expired' ||
    status.value === 'lost',
)

const isTradeInfoOpen = ref(false)
const onClick = () => {
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
</script>
