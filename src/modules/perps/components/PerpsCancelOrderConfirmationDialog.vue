<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full max-w-[440px]"
    z-index-container="z-[201]"
    z-index-overlay="z-[200]"
  >
    <template #title>
      <div class="flex items-center gap-2.5 mr-8 pt-5 pl-6">
        <app-token-logo
          :url="getLogoUrl(displaySymbol)"
          :symbol="displaySymbol"
          width="w-8"
          height="h-8"
        />
        <span class="font-bold text-s-20">{{
          $t('perps.cancel-order.title')
        }}</span>
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-5">
        <div class="bg-brand-subtle rounded-[20px] p-5 space-y-3">
          <div class="flex justify-between text-s-14">
            <span class="text-fg-subtle font-medium">{{
              $t('perps.confirm.market')
            }}</span>
            <span class="font-bold">{{ displaySymbol }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-fg-subtle font-medium">{{
              $t('perps.confirm.side-label')
            }}</span>
            <span
              class="font-bold"
              :class="order.side === 'buy' ? 'text-success' : 'text-error'"
            >
              {{
                order.side === 'buy'
                  ? $t('perps.confirm.long')
                  : $t('perps.confirm.short')
              }}
            </span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-fg-subtle font-medium">{{
              $t('perps.confirm.order-type-label')
            }}</span>
            <span class="font-bold">{{ humanCategory(order.type) }}</span>
          </div>
          <div
            v-if="order.type !== 'market'"
            class="flex justify-between text-s-14"
          >
            <span class="text-fg-subtle font-medium">{{
              $t('perps.cancel-order.price-label')
            }}</span>
            <span class="font-bold">{{
              formatPrice(getOrderPrice(order))
            }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-fg-subtle font-medium">{{
              $t('perps.trade.size')
            }}</span>
            <div class="text-right">
              <p class="font-bold">{{ order.size }} {{ displaySymbol }}</p>
              <p class="text-fg-subtle">{{ orderSizeInUsd }}</p>
            </div>
          </div>
          <div
            v-if="parseFloat(order.filledSize) > 0"
            class="flex justify-between text-s-14"
          >
            <span class="text-fg-subtle font-medium">{{
              $t('perps.cancel-order.filled-label')
            }}</span>
            <span class="font-bold"
              >{{ order.filledSize }} / {{ order.size }}
              {{ displaySymbol }}</span
            >
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <app-base-button
            :disabled="isCancelling"
            :is-loading="isCancelling"
            theme="error"
            class="flex-1"
            @click="$emit('confirm')"
          >
            {{
              isCancelling
                ? $t('perps.cancel-order.cancelling')
                : $t('perps.cancel-order.confirm-cancel')
            }}
          </app-base-button>
          <app-btn-text
            :disabled="isCancelling"
            class="mx-auto w-full"
            is-large
            @click="isOpen = false"
          >
            {{ $t('perps.trade.tab-close') }}
          </app-btn-text>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import { formatPrice, getOrderPrice } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'
import type { ApiOrder } from '../sdk/types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BigNumber from 'bignumber.js'

const { t } = useI18n()

const props = defineProps<{
  order: ApiOrder
  displaySymbol: string
  isCancelling: boolean
}>()

const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

defineEmits<{
  confirm: []
}>()

const orderSizeInUsd = computed(() => {
  return formatPrice(
    BigNumber(getOrderPrice(props.order))
      .times(BigNumber(props.order.size))
      .toString(),
  )
})

function humanCategory(type: ApiOrder['type']): string {
  switch (type) {
    case 'market':
      return t('perps.confirm.market')
    case 'limit':
      return t('perps.confirm.limit')
    case 'stopMarket':
      return t('perps.confirm.stop-loss')
    case 'takeProfitMarket':
      return t('perps.confirm.take-profit')
    default:
      return type
  }
}
</script>
