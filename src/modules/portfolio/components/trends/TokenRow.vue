<template>
  <div class="w-full mb-2 py-1">
    <div class="grid grid-cols-4 w-full justify-between gap-1">
      <div class="col-span-2 flex items-center gap-2">
        <app-token-logo
          :url="token.logo_url"
          :alt="token.symbol"
          class="w-6 h-6 rounded-full object-cover flex-none mt-1"
        />
        <div>
          <p class="hidden xs:block text-s-14 font-medium text-wrap">
            {{ token.name }}
          </p>
          <p
            class="text-s-14 font-medium xs:text-s-12 xs:text-info xs:font-normal"
          >
            {{ truncate(token.symbol, 6) }}
          </p>
        </div>
      </div>
      <div class="col-span-1 text-s-14">
        <p>${{ formatFiatValue(token.price).value }}</p>
        <p
          class="text-s-11 flex items-center gap-[2px]"
          :class="{
            'text-error': token.percentChange < 0,
            'text-success': token.percentChange >= 0,
          }"
        >
          <span
            ><ArrowTrendingDownIcon
              v-if="token.percentChange < 0"
              class="text-error h-3 w-3" /><ArrowTrendingUpIcon
              v-else
              class="text-success h-3 w-3" /></span
          >{{ formatPercentageValue(token.percentChange).value }}
        </p>
      </div>
      <div class="text-right col-span-1">
        <p
          class="text-s-14"
          :class="{
            'text-error': token.percentChange < 0,
            'text-success': token.percentChange >= 0,
          }"
        >
          <span v-if="token.percentChange < 0"> -</span>
          <span v-else> +</span>${{
            formatFiatValue(token.gainOrLoss.abs()).value
          }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { truncate } from '@/utils/filters'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { type TokenGainOrLoss } from '@/modules/portfolio/types'
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/solid'
defineProps<{
  token: TokenGainOrLoss
}>()
</script>
