<template>
  <div class="flex flex-col gap-3 mt-3">
    <!-- Swap Row -->
    <div class="flex items-center gap-3">
      <div
        class="rounded-lg p-1.5 shrink-0"
        :class="[!swapClaimed && !swapNoRewards ? 'bg-blue-10' : 'bg-grey-5']"
      >
        <arrow-path-rounded-square-icon
          class="w-5 h-5"
          :class="[
            !swapClaimed && !swapNoRewards ? ' text-primary' : 'text-[#64748b]',
          ]"
        />
      </div>
      <div class="flex-1 min-w-0">
        <span class="text-s-14 font-semibold">Swap → Earn $5</span>
        <template v-if="!swapClaimed && !swapNoRewards">
          <div
            class="w-full h-1.5 bg-blue-10 rounded-full overflow-hidden mt-1 flex"
          >
            <div
              class="h-full bg-primary rounded-full transition-all"
              :style="{ width: `${swapRemainingPct}%` }"
            />
          </div>
          <p class="text-s-12 text-primary mt-0.5">
            <b>{{ swapRemainingCount ?? '—' }}/{{ swapTotal ?? '—' }}</b>
            rewards left
          </p>
        </template>
        <p
          v-else-if="swapClaimed"
          class="text-s-12 font-medium mt-0.5 text-success"
        >
          Reward claimed
        </p>
        <p v-else class="text-s-12 font-medium mt-0.5 text-error">
          No rewards left
        </p>
      </div>
      <app-base-button
        v-if="!swapClaimed && !swapNoRewards"
        size="small"
        is-outline
        class="shrink-0"
        @click="$emit('swap')"
      >
        Swap $50+
      </app-base-button>
      <button v-else class="back-in-btn shrink-0">
        Back in {{ swapClaimed ? timeUntilNextEligible : timeUntilHourReset }}
        <clock-icon class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Trade Row -->
    <div class="flex items-center gap-3">
      <div
        class="rounded-lg p-1.5 shrink-0"
        :class="[!tradeClaimed && !tradeNoRewards ? 'bg-blue-10' : 'bg-grey-5']"
      >
        <chart-bar-square-icon
          class="w-5 h-5"
          :class="[
            !tradeClaimed && !tradeNoRewards
              ? 'text-primary'
              : 'text-[#64748b]',
          ]"
        />
      </div>
      <div class="flex-1 min-w-0">
        <span class="text-s-14 font-semibold">Trade → Earn $5</span>
        <template v-if="!tradeClaimed && !tradeNoRewards">
          <div
            class="w-full h-1.5 bg-blue-10 rounded-full overflow-hidden mt-1 flex"
          >
            <div
              class="h-full bg-primary rounded-full transition-all"
              :style="{ width: `${tradeRemainingPct}%` }"
            />
          </div>
          <p class="text-s-12 text-primary mt-0.5">
            <b>{{ tradeRemainingCount ?? '—' }}/{{ tradeTotal ?? '—' }}</b>
            rewards left
          </p>
        </template>
        <p
          v-else-if="tradeClaimed"
          class="text-s-12 font-medium mt-0.5 text-success"
        >
          Reward claimed
        </p>
        <p v-else class="text-s-12 font-medium mt-0.5 text-error">
          No rewards left
        </p>
      </div>
      <app-base-button
        v-if="!tradeClaimed && !tradeNoRewards"
        size="small"
        is-outline
        class="shrink-0"
        @click="$emit('trade')"
      >
        Trade $25+
      </app-base-button>
      <button v-else class="back-in-btn shrink-0">
        Back in
        {{ tradeClaimed ? timeUntilNextEligible : timeUntilHourReset }}
        <clock-icon class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import {
  ArrowPathRoundedSquareIcon,
  ChartBarSquareIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'

defineProps<{
  swapClaimed: boolean
  swapNoRewards: boolean
  swapRemainingPct: number
  swapRemainingCount: number | null
  swapTotal: number | null
  tradeClaimed: boolean
  tradeNoRewards: boolean
  tradeRemainingPct: number
  tradeRemainingCount: number | null
  tradeTotal: number | null
  timeUntilHourReset: string
  timeUntilNextEligible: string
}>()

defineEmits<{
  swap: []
  trade: []
}>()
</script>

<style scoped>
.back-in-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1.5px dashed #94a3b8;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  white-space: nowrap;
  cursor: default;
}
</style>
