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
        <span class="font-bold text-s-20"
          >Confirm {{ orderSide === 'buy' ? 'Long' : 'Short' }}
          {{ displaySymbol }}</span
        >
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-5">
        <!-- Order Details -->
        <div class="bg-mewBg rounded-[20px] p-5 space-y-3">
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Side</span>
            <span
              class="font-bold"
              :class="orderSide === 'buy' ? 'text-success' : 'text-error'"
              >{{ orderSide === 'buy' ? 'Long' : 'Short' }}</span
            >
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Order type</span>
            <span class="font-bold">{{
              orderType === 'market' ? 'Market' : 'Limit'
            }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Market price</span>
            <span class="font-bold">{{ formatUsd(currentPrice) }}</span>
          </div>
          <div
            v-if="orderType === 'limit'"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">Limit price</span>
            <span class="font-bold">${{ limitPrice }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Margin</span>
            <span class="font-bold">{{
              formatUsd(parseFloat(inputAmount) || 0)
            }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Leverage</span>
            <span class="font-bold">{{ leverage }}&times;</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Position size</span>
            <span class="font-bold">{{ formatUsd(positionSizeUsd) }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium"
              >Size ({{ displaySymbol }})</span
            >
            <span class="font-bold">{{ orderSize }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">Est. liquidation</span>
            <span class="font-bold">{{
              estimatedLiquidation ? formatUsd(estimatedLiquidation) : '$0.00'
            }}</span>
          </div>
          <div
            v-if="takeProfitPrice !== null"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">Take Profit</span>
            <span class="text-success font-bold">{{
              formatUsd(takeProfitPrice!)
            }}</span>
          </div>
          <div
            v-if="stopLossPrice !== null"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">Stop Loss</span>
            <span class="text-error font-bold">{{
              formatUsd(stopLossPrice!)
            }}</span>
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="orderError || leverageError || limitPriceOutOfTolerance"
          class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4"
        >
          <p class="text-error text-s-14 font-medium">
            {{
              orderError ||
              leverageError ||
              'Price must be within +/- 10% tolerance'
            }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-1">
          <app-base-button
            :theme="orderSide === 'buy' ? 'success' : 'error'"
            :disabled="
              isSubmitting ||
              !!orderError ||
              !!leverageError ||
              limitPriceOutOfTolerance
            "
            :is-loading="isSubmitting"
            class="flex-1"
            @click="$emit('confirm')"
            >{{
              isSubmitting
                ? 'Processing...'
                : `Confirm ${orderSide === 'buy' ? 'Long' : 'Short'}`
            }}</app-base-button
          >
          <app-btn-text
            :disabled="isSubmitting"
            class="mx-auto w-full"
            is-large
            @click="isOpen = false"
            >Cancel</app-btn-text
          >
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { formatUsd } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'

const isOpen = defineModel<boolean>('isOpen', { default: false })

defineProps<{
  orderSide: 'buy' | 'sell'
  orderType: 'market' | 'limit'
  displaySymbol: string
  currentPrice: number
  limitPrice: string
  inputAmount: string
  leverage: number
  positionSizeUsd: number
  orderSize: string
  estimatedLiquidation: number | null
  takeProfitPrice: number | null
  stopLossPrice: number | null
  orderError: string | null
  isSubmitting: boolean
  leverageError: string | null
  limitPriceOutOfTolerance: boolean
}>()

defineEmits<{
  confirm: []
}>()
</script>
