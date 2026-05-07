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
        <span class="font-bold text-s-20">Cancel Order</span>
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-5">
        <div class="bg-mewBg rounded-[20px] p-5 space-y-3">
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Market</span>
            <span class="font-bold">{{ displaySymbol }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Side</span>
            <span
              class="font-bold"
              :class="order.side === 'buy' ? 'text-success' : 'text-error'"
            >
              {{ order.side === 'buy' ? 'Long' : 'Short' }}
            </span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Order type</span>
            <span class="font-bold">{{ humanCategory(order.type) }}</span>
          </div>
          <div
            v-if="order.type !== 'market'"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">Price</span>
            <span class="font-bold">{{ formatPrice(order.price) }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Size</span>
            <div class="text-right">
              <p class="font-bold">{{ order.size }} {{ displaySymbol }}</p>
              <p class="text-grey-50">{{ orderSizeInUsd }}</p>
            </div>
          </div>
          <div
            v-if="parseFloat(order.filledSize) > 0"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">Filled</span>
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
            {{ isCancelling ? 'Cancelling...' : 'Confirm Cancel' }}
          </app-base-button>
          <app-btn-text
            :disabled="isCancelling"
            class="mx-auto w-full"
            is-large
            @click="isOpen = false"
          >
            Close
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
import { formatPrice } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'
import type { ApiOrder } from '../sdk/types'
import { computed } from 'vue'
import BigNumber from 'bignumber.js'

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
    BigNumber(props.order.price).times(BigNumber(props.order.size)).toString(),
  )
})

function humanCategory(type: ApiOrder['type']): string {
  switch (type) {
    case 'market':
      return 'Market'
    case 'limit':
      return 'Limit'
    case 'stopMarket':
      return 'Stop Market'
    case 'takeProfitMarket':
      return 'Take Profit Market'
    default:
      return type
  }
}
</script>
