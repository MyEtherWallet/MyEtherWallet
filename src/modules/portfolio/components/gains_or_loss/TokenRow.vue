<template>
  <router-link :to="routeParams" class="flex">
    <div
      class="w-full mb-1 py-1.5 hoverBGWhite cursor-pointer rounded-12 px-1 xs:px-3 transition-colors duration-200"
    >
      <div class="grid grid-cols-4 w-full items-center justify-between gap-2">
        <div class="col-span-2 flex items-center gap-3">
          <app-token-logo
            :url="token.logo_url"
            :alt="token.symbol"
            :is-stock="token.is_stock"
          />
          <div class="flex flex-col overflow-hidden">
            <app-token-symbol
              :symbol="token.symbol"
              :is-stock="token.is_stock"
            />
            <app-tooltip :text="name" v-if="name.length > 20">
              <p
                class="hidden xs:block text-s-12 text-fg-subtle truncate mt-0.5 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
              >
                {{ name }}
              </p>
            </app-tooltip>
            <p
              v-else
              class="hidden xs:block text-s-12 text-fg-subtle truncate mt-0.5 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
            >
              {{ name }}
            </p>
          </div>
        </div>
        <div class="col-span-1 flex flex-col items-start">
          <p class="text-s-14 font-normal">
            {{ formatFiat(token.price).display }}
          </p>
          <div
            class="text-s-11 font-normal flex items-center gap-[2px]"
            :class="{
              'text-error': token.percentChange < 0,
              'text-success': token.percentChange >= 0,
            }"
          >
            <span
              >{{ token.percentChange >= 0 ? '+' : ''
              }}{{ formatPercentageValue(token.percentChange).value }}</span
            >
          </div>
        </div>
        <div
          class="text-right col-span-1 flex flex-col items-end justify-center"
        >
          <p
            class="text-s-14 font-normal tracking-tight"
            :class="{
              'text-error': token.gainOrLoss.isLessThan(0),
              'text-success': token.gainOrLoss.isGreaterThan(0),
            }"
          >
            {{ token.gainOrLoss.isLessThan(0) ? '-' : '+'
            }}{{ formatFiat(token.gainOrLoss.abs()).display }}
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script setup lang="ts">
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { type TokenGainOrLoss } from '@/modules/portfolio/types'
import {
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import { computed } from 'vue'

const { formatFiat } = useCurrency()

const props = defineProps<{
  token: TokenGainOrLoss
}>()

const name = computed(() => {
  return props.token.stock_alias ? props.token.stock_alias : props.token.name
})

const routeParams = computed(() => {
  if (props.token.stock_route) {
    return {
      name: STOCK_INFO_ROUTE_NAMES.home,
      params: { symbol: props.token.stock_route },
    }
  }
  return {
    name: TOKEN_INFO_ROUTE_NAMES.home,
    params: { tokenId: props.token.id },
  }
})
</script>
