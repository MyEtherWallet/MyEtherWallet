<template>
  <app-modal v-model="isOpen" :title="$t('perps.auto-close.title')">
    <div class="flex flex-col gap-4 px-4 sm:px-6">
      <!-- Asset & Price -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-2">
          <app-avatar
            type="perpsAsset"
            :url="getLogoUrl(displaySymbol)"
            :symbol="displaySymbol"
            class="shrink-0"
          />
          <app-content-group :title="displaySymbol" />
        </div>
        <p class="shrink-0 text-right">
          <span class="mr-2 text-text-sm text-text-subtle">{{
            $t('perps.auto-close.current-price')
          }}</span>
          <span class="text-label-base">{{ formatUsd(currentPrice) }}</span>
        </p>
      </div>

      <!-- Take Profit -->
      <transition name="fade" mode="out-in">
        <div
          v-if="hasTakeProfit"
          key="take-profit-input"
          class="flex flex-col gap-4 rounded-16 bg-background-default p-4"
        >
          <div class="flex items-center justify-between gap-2">
            <app-content-group
              :title="
                $t('perps.auto-close.take-profit-reaches', {
                  symbol: displaySymbol,
                })
              "
              wrap-title
              class="flex-1"
            />
            <app-base-button
              type="link"
              size="small"
              class="shrink-0"
              @click="removeTakeProfit"
            >
              {{ $t('perps.auto-close.remove') }}
            </app-base-button>
          </div>
          <div class="flex flex-col gap-1">
            <perps-amount
              v-model:amount="takeProfitPrice"
              :error="takeProfitError || ''"
              :validate-input="() => {}"
            >
              <template #footer>
                <!-- Wraps instead of squeezing the labels on narrow screens. -->
                <div class="mt-1 flex flex-wrap gap-2">
                  <app-chip
                    v-for="pct in takeProfitPills"
                    :key="pct"
                    surface="alternative"
                    :label="`${isLong ? '+' : '-'}${pct}%`"
                    :selected="activeTpPill === pct"
                    class="flex-1"
                    @click="$emit('setTakeProfitPct', pct)"
                  />
                </div>
              </template>
            </perps-amount>
            <transition name="fade" mode="out-in">
              <AppInputFeedback
                v-if="takeProfitError"
                type="error"
                :message="takeProfitError"
              />
            </transition>
          </div>
          <p class="text-right text-text-sm">
            <span class="text-text-subtle">{{
              $t('perps.auto-close.projected-profit')
            }}</span>
            <span
              v-if="tempProjectedProfit !== null && takeProfitPrice !== null"
              class="ml-2 text-label-sm text-text-success"
              >+{{ formatUsd(Math.abs(tempProjectedProfit)) }}</span
            >
            <span v-else class="ml-2 text-label-sm"> - </span>
          </p>
        </div>
        <button
          v-else
          key="add-take-profit"
          class="bg-background-default-hover font-medium rounded-16 px-3 pt-1 pb-2 sm:p-5 min-h-[199px] sm:min-h-[222px] hover:text-text-brand text hover:bg-background-brand-subtle transition-all duration-300 group"
          @click="setTempTakeProfitPrice"
        >
          <AppIcon
            name="plus-circle"
            variant="filled"
            class="mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
          />
          {{ $t('perps.auto-close.add-take-profit') }}
        </button>
      </transition>

      <!-- Stop Loss -->
      <transition name="fade" mode="out-in">
        <div
          v-if="hasStopLoss"
          key="stop-loss-input"
          class="flex flex-col gap-4 rounded-16 bg-background-default p-4"
        >
          <div class="flex items-center justify-between gap-2">
            <app-content-group
              :title="
                $t('perps.auto-close.stop-loss-reaches', {
                  symbol: displaySymbol,
                })
              "
              wrap-title
              class="flex-1"
            />
            <app-base-button
              type="link"
              size="small"
              class="shrink-0"
              @click="removeStopLoss"
            >
              {{ $t('perps.auto-close.remove') }}
            </app-base-button>
          </div>
          <div class="flex flex-col gap-1">
            <perps-amount
              v-model:amount="stopLossPrice"
              :error="stopLossError || ''"
              :validate-input="() => {}"
            >
              <template #footer>
                <div class="mt-1 flex flex-wrap gap-2">
                  <app-chip
                    v-for="pct in [1, 2, 3, 4, 5]"
                    :key="pct"
                    surface="alternative"
                    :label="`${isLong ? '-' : '+'}${pct}%`"
                    :selected="activeSlPill === pct"
                    class="flex-1"
                    @click="$emit('setStopLossPct', pct)"
                  />
                </div>
              </template>
            </perps-amount>
            <transition name="fade" mode="out-in">
              <AppInputFeedback
                v-if="stopLossError"
                type="error"
                :message="stopLossError"
              />
            </transition>
          </div>
          <p class="text-right text-text-sm">
            <span class="text-text-subtle">{{
              $t('perps.auto-close.projected-loss')
            }}</span>
            <span
              v-if="tempProjectedLoss !== null && stopLossPrice !== null"
              class="ml-2 text-label-sm text-text-error"
              >-{{ formatUsd(Math.abs(tempProjectedLoss)) }}</span
            >
            <span v-else class="ml-2 text-label-sm"> - </span>
          </p>
        </div>
        <button
          v-else
          key="add-stop-loss"
          class="bg-background-default-hover font-medium rounded-16 px-3 pt-1 pb-2 sm:p-5 min-h-[199px] sm:min-h-[222px] hover:text-text-brand text hover:bg-background-brand-subtle transition-all duration-300 group"
          @click="setTempStopLossPrice"
        >
          <AppIcon
            name="plus-circle"
            variant="filled"
            class="mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
          />
          {{ $t('perps.auto-close.add-stop-loss') }}
        </button>
      </transition>
    </div>

    <template #footer>
      <app-btn-group orientation="vertical" :has-padding="false">
        <app-base-button
          :disabled="!hasEdits || !!takeProfitError || !!stopLossError"
          @click="$emit('confirm')"
        >
          {{ $t('perps.auto-close.save') }}
        </app-base-button>
        <app-base-button
          type="tertiary"
          surface="alternative"
          @click="isOpen = false"
        >
          {{ $t('perps.auto-close.cancel') }}
        </app-base-button>
      </app-btn-group>
    </template>
  </app-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from 'vue'
import AppModal from '@/components/modal/AppModal.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppChip from '@/components/chip/AppChip.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import PerpsAmount from './PerpsAmount.vue'
import { formatUsd } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import { analytics, PerpsTpSlEvent } from '@/analytics'

const isOpen = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  displaySymbol: string
  currentPrice: number
  tempProjectedProfit: number | null
  tempProjectedLoss: number | null
  activeTpPill: number | null
  activeSlPill: number | null
  // Position/order side. LONG → take profit above mark (price rises), stop loss
  // below (price falls); SHORT inverts both, so the pill labels flip sign.
  isLong: boolean
  // Largest valid take-profit drop for a short: the % move that lands on the
  // lowest positive increment-aligned price. Drives the biggest short pill so
  // it never resolves to a non-positive (backend-rejected) trigger.
  maxShortTakeProfitPct: number
  takeProfitError?: string
  stopLossError?: string
  hasEdits?: boolean
}>()

// A long's take profit is a price rise (+%), a short's is a price fall (-%).
// The backend requires a positive trigger, so a short's largest pill is the
// computed max drop (down to the lowest valid price) rather than a fixed value
// that could round to 0. Dropped when it isn't larger than the 50% pill (e.g.
// price not loaded, or an asset priced near its own increment).
const takeProfitPills = computed(() => {
  if (props.isLong) return [10, 20, 30, 50, 100]
  // Keep the base pills; append the computed max only when it's a larger drop
  // than 50% (otherwise the price hasn't loaded or the asset sits near its own
  // increment).
  const base = [10, 20, 30, 50]
  return props.maxShortTakeProfitPct > 50
    ? [...base, props.maxShortTakeProfitPct]
    : base
})

const emit = defineEmits<{
  clearTakeProfit: []
  clearStopLoss: []
  setTakeProfitPct: [pct: number]
  setStopLossPct: [pct: number]
  confirm: []
}>()

const takeProfitPrice = defineModel('takeProfitPrice', {
  type: [null, Number] as PropType<null | number>,
  required: true,
})

const stopLossPrice = defineModel('stopLossPrice', {
  type: [null, Number] as PropType<null | number>,
  required: true,
})

const hasStopLoss = ref(false)
const hasTakeProfit = ref(false)

const setTempTakeProfitPrice = () => {
  if (takeProfitPrice.value == null) {
    emit('setTakeProfitPct', 30)
  }
  hasTakeProfit.value = true
  void analytics.trackPerpsTpSlEvent(PerpsTpSlEvent.CLICKED_ADD_TP)
}

const setTempStopLossPrice = () => {
  if (stopLossPrice.value == null) {
    emit('setStopLossPct', 3)
  }
  hasStopLoss.value = true
  void analytics.trackPerpsTpSlEvent(PerpsTpSlEvent.CLICKED_ADD_SL)
}

const removeTakeProfit = () => {
  hasTakeProfit.value = false
  emit('clearTakeProfit')
}

const removeStopLoss = () => {
  hasStopLoss.value = false
  emit('clearStopLoss')
}

watch(isOpen, () => {
  if (isOpen.value) {
    // Reset local state when dialog is closed
    hasStopLoss.value = stopLossPrice.value !== null
    hasTakeProfit.value = takeProfitPrice.value !== null
  }
})
</script>
