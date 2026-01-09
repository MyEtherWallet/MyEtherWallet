<template>
  <router-link
    :to="{
      name: TOKEN_INFO_ROUTE_NAMES.home,
      params: {
        tokenId: token.id,
      },
    }"
    class="flex"
  >
    <div
      class="w-full mb-1 py-1.5 hoverBGWhite cursor-pointer rounded-14 px-3 transition-colors duration-200"
    >
      <div class="grid grid-cols-4 w-full items-center justify-between gap-2">
        <div class="col-span-2 flex items-center gap-3">
          <app-token-logo
            :url="token.logo_url"
            :alt="token.symbol"
            class="w-8 h-8 rounded-full shadow-sm"
          />
          <div class="flex flex-col overflow-hidden">
            <app-tooltip :text="token.name" v-if="token.name.length > 20">
              <p
                class="hidden xs:block text-s-15 font-bold truncate leading-tight max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
              >
                {{ token.name }}
              </p>
            </app-tooltip>
            <p
              v-else
              class="hidden xs:block text-s-15 font-bold truncate leading-tight max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
            >
              {{ token.name }}
            </p>
            <p
              class="text-s-13 font-medium text-info xs:font-normal uppercase tracking-tight"
            >
              {{ truncate(token.symbol, 10) }}
            </p>
          </div>
        </div>
        <div class="col-span-1 flex flex-col items-start">
          <p class="text-s-14 font-medium">
            ${{ formatFiatValue(token.price).value }}
          </p>
          <div
            class="text-s-11 font-bold flex items-center gap-[2px]"
            :class="{
              'text-error': token.percentChange < 0,
              'text-success': token.percentChange >= 0,
            }"
          >
            <span
              >{{ token.percentChange >= 0 ? '+' : ''
              }}{{ formatPercentageValue(token.percentChange).value }}</span
            >
            <ArrowTrendingDownIcon
              v-if="token.percentChange < 0"
              class="h-2.5 w-2.5"
            />
            <ArrowTrendingUpIcon v-else class="h-2.5 w-2.5" />
          </div>
        </div>
        <div
          class="text-right col-span-1 flex flex-col items-end justify-center"
        >
          <p
            class="text-s-15 font-bold tracking-tight"
            :class="{
              'text-error': token.gainOrLoss.isLessThan(0),
              'text-success': token.gainOrLoss.isGreaterThan(0),
            }"
          >
            {{ token.gainOrLoss.isLessThan(0) ? '-' : '+' }}${{
              formatFiatValue(token.gainOrLoss.abs()).value
            }}
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script setup lang="ts">
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTooltip from '@/components/AppTooltip.vue'
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
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'

defineProps<{
  token: TokenGainOrLoss
}>()
</script>
