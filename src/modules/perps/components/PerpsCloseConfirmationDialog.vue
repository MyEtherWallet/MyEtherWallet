<template>
  <app-dialog v-model:is-open="isOpen" class="w-full max-w-[440px]">
    <template #title>
      <div class="flex items-center gap-2.5 mr-8 pt-5 pl-6">
        <app-token-logo
          :url="getLogoUrl(displaySymbol)"
          :symbol="displaySymbol"
          width="w-8"
          height="h-8"
        />
        <span class="font-bold text-s-20">{{ dialogTitle }}</span>
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-5">
        <!-- Close Details -->
        <div class="bg-mewBg rounded-[20px] p-5 space-y-3">
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.side-label')
            }}</span>
            <span
              class="font-bold"
              :class="direction === 'long' ? 'text-error' : 'text-success'"
              >{{
                direction === 'long'
                  ? $t('perps.close.sell-close-long')
                  : $t('perps.close.buy-close-short')
              }}</span
            >
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.order-type-label')
            }}</span>
            <span class="font-bold">{{ $t('perps.confirm.market') }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.market-price')
            }}</span>
            <span class="font-bold">{{ formatUsd(currentPrice) }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.close.close-amount-label')
            }}</span>
            <span class="font-bold">{{
              formatUsd(parseFloat(closeAmount) || 0)
            }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium"
              >{{ $t('perps.trade.size') }}
            </span>
            <span class="font-bold"
              >{{ closeOrderSize }} {{ displaySymbol }}</span
            >
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.close.close-percentage-label')
            }}</span>
            <span class="font-bold">{{ Math.round(closeSliderValue) }}%</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.close.current-pnl-label')
            }}</span>
            <span
              class="font-bold"
              :class="positionPnl >= 0 ? 'text-success' : 'text-error'"
              >{{ formatPnl(String(positionPnl)) }} ({{
                (positionRoe * 100).toFixed(2)
              }}%)</span
            >
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="closeError"
          class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4"
        >
          <p class="text-error text-s-14 font-medium">{{ closeError }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-1">
          <app-base-button
            :disabled="isClosing"
            :is-loading="isClosing"
            class="flex-1"
            @click="$emit('confirm')"
            >{{
              isClosing
                ? $t('perps.close.closing')
                : $t('perps.close.confirm-close')
            }}</app-base-button
          >
          <app-btn-text
            :disabled="isClosing"
            class="mx-auto w-full"
            is-large
            @click="isOpen = false"
            >{{ $t('perps.confirm.cancel') }}</app-btn-text
          >
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import { formatUsd, formatPnl } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'

const { t } = useI18n()

const props = defineProps({
  displaySymbol: {
    type: String,
    required: true,
  },
  direction: {
    type: String as () => 'long' | 'short' | 'neutral',
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  closeAmount: {
    type: String,
    default: '',
  },
  closeOrderSize: {
    type: String,
    default: '',
  },
  closeSliderValue: {
    type: Number,
    default: 0,
  },
  positionPnl: {
    type: Number,
    default: 0,
  },
  positionRoe: {
    type: Number,
    default: 0,
  },
  closeError: {
    type: String,
    default: '',
  },
  isClosing: {
    type: Boolean,
    default: false,
  },
})

const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

defineEmits<{
  confirm: []
}>()

const directionLabel = computed(() =>
  props.direction === 'long'
    ? t('perps.confirm.long')
    : t('perps.confirm.short'),
)

const dialogTitle = computed(() =>
  t('perps.close.title', {
    symbol: props.displaySymbol,
    direction: directionLabel.value,
  }),
)
</script>
