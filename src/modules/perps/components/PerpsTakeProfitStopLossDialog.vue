<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full max-w-[440px]"
    title="Auto Close"
  >
    <!-- <template #title>
      <div class="mr-8 pt-5 pl-6">
        <span class="font-bold sm:text-s-20"> Take Profit / Stop loss</span>
      </div>
    </template> -->
    <template #content>
      <div class="px-3 sm:px-6 pb-6 pt-4 flex flex-col gap-4">
        <!-- Asset & Price -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <app-token-logo
              :url="getLogoUrl(displaySymbol)"
              :symbol="displaySymbol"
              width="w-7"
              height="h-7"
            />
            <span class="font-bold text-s-16">{{ displaySymbol }}</span>
          </div>
          <div class="text-right">
            <span class="text-info text-s-14 mr-2">Current price</span>
            <span class="font-bold text-s-16">{{
              formatUsd(currentPrice)
            }}</span>
          </div>
        </div>

        <!-- Take Profit -->
        <transition name="fade" mode="out-in">
          <div
            v-if="hasTakeProfit"
            key="take-profit-input"
            class="bg-mewBg rounded-20 px-4 py-3 sm:p-5"
          >
            <div class="flex justify-between items-center pl-3">
              <p class="text-s-12 sm:text-s-14 font-bold">
                Take profit if {{ displaySymbol }} reaches
              </p>
              <app-btn-text
                class="text-primary text-s-12 sm:text-s-14"
                @click="removeTakeProfit"
              >
                Remove
              </app-btn-text>
            </div>
            <perps-amount
              v-model:amount="takeProfitPrice"
              :error="takeProfitError ? precisionMessage : ''"
              :validate-input="() => {}"
            >
              <template #footer>
                <div class="flex justify-start gap-2 mt-1">
                  <button
                    v-for="pct in [10, 20, 30, 50, 100]"
                    :key="pct"
                    class="w-full px-2 sm:px-[10px] py-1 text-s-9 sm:text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                    :class="
                      activeTpPill === pct ? '!bg-mewBg text-primary' : ''
                    "
                    @click="$emit('setTakeProfitPct', pct)"
                  >
                    +{{ pct }}%
                  </button>
                </div>
              </template>
            </perps-amount>
            <transition name="fade" mode="out-in">
              <div
                v-if="takeProfitError"
                class="text-error text-s-12 mt-1 pl-3"
              >
                {{ precisionMessage }}
              </div>
            </transition>
            <div class="text-right text-s-12 sm:text-s-13 mt-2 mr-2">
              <span class="text-info">Projected profit</span>
              <span
                v-if="tempProjectedProfit !== null && takeProfitPrice !== null"
                class="text-success ml-2 font-medium"
                >+{{ formatUsd(Math.abs(tempProjectedProfit)) }}</span
              >
              <span v-else class="ml-2 font-medium"> - </span>
            </div>
          </div>
          <button
            v-else
            key="add-take-profit"
            class="bg-surface font-medium rounded-20 px-3 pt-1 pb-2 sm:p-5 min-h-[199px] sm:min-h-[222px] hover:text-primary text hover:bg-mewBg transition-all duration-300 group"
            @click="setTempTakeProfitPrice"
          >
            <plus-circle-icon
              class="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
            />
            Add Take Profit
          </button>
        </transition>

        <!-- Stop Loss -->
        <transition name="fade" mode="out-in">
          <div
            v-if="hasStopLoss"
            key="stop-loss-input"
            class="bg-mewBg rounded-20 px-4 py-3 sm:p-5"
          >
            <div class="flex justify-between items-center pl-3">
              <p class="text-s-12 sm:text-s-14 font-bold">
                Stop loss if {{ displaySymbol }} reaches
              </p>
              <app-btn-text
                class="text-primary text-s-12 sm:text-s-14"
                @click="removeStopLoss"
              >
                Remove
              </app-btn-text>
            </div>
            <perps-amount
              v-model:amount="stopLossPrice"
              :error="stopLossError ? precisionMessage : ''"
              :validate-input="() => {}"
            >
              <template #footer>
                <div class="flex justify-start gap-2 mt-1">
                  <button
                    v-for="pct in [1, 2, 3, 4, 5]"
                    :key="pct"
                    class="w-full px-2 sm:px-[10px] py-1 text-s-9 sm:text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                    :class="
                      activeSlPill === pct ? '!bg-mewBg text-primary' : ''
                    "
                    @click="$emit('setStopLossPct', pct)"
                  >
                    -{{ pct }}%
                  </button>
                </div>
              </template>
            </perps-amount>
            <transition name="fade" mode="out-in">
              <div v-if="stopLossError" class="text-error text-s-12 mt-1 pl-3">
                {{ precisionMessage }}
              </div>
            </transition>
            <div class="text-right text-s-12 sm:text-s-13 mt-2 mr-2">
              <span class="text-info">Projected loss</span>
              <span
                v-if="tempProjectedLoss !== null && stopLossPrice !== null"
                class="text-error font-medium ml-2"
                >-{{ formatUsd(Math.abs(tempProjectedLoss)) }}</span
              >
              <span v-else class="ml-2 font-medium"> - </span>
            </div>
          </div>
          <button
            v-else
            key="add-stop-loss"
            class="bg-surface font-medium rounded-20 px-3 pt-1 pb-2 sm:p-5 min-h-[199px] sm:min-h-[222px] hover:text-primary text hover:bg-mewBg transition-all duration-300 group"
            @click="setTempStopLossPrice"
          >
            <plus-circle-icon
              class="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
            />
            Add Stop Loss
          </button>
        </transition>

        <!-- Actions -->
        <div class="flex flex-col gap-1">
          <app-base-button
            :disabled="!hasEdits"
            class="w-full"
            @click="$emit('confirm')"
          >
            Save
          </app-base-button>
          <app-btn-text
            class="mx-auto w-full"
            is-large
            @click="isOpen = false"
          >
            Cancel
          </app-btn-text>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import PerpsAmount from './PerpsAmount.vue'
import { formatUsd } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { analytics, PerpsTpSlEvent } from '@/analytics'

const isOpen = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  displaySymbol: string
  currentPrice: number
  tempProjectedProfit: number | null
  tempProjectedLoss: number | null
  activeTpPill: number | null
  activeSlPill: number | null
  takeProfitError?: boolean
  stopLossError?: boolean
  quoteDecimals?: number
  hasEdits?: boolean
}>()

const precisionMessage = computed(() => {
  const dec = props.quoteDecimals ?? 2
  if (dec === 0) return 'Price must be a whole number'
  return `Price supports up to ${dec} decimal place${dec === 1 ? '' : 's'}`
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
