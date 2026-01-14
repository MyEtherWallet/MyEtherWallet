<template>
  <router-link
    :to="{
      name: TOKEN_INFO_ROUTE_NAMES.crypto,
      params: {
        tokenId: token.coinId,
      },
    }"
    class="flex"
  >
    <div
      class="w-full mb-1 py-1.5 hoverBGWhite cursor-pointer rounded-12 px-3 transition-colors duration-200"
    >
      <div class="grid grid-cols-3 w-full items-center justify-between gap-2">
        <div class="col-span-2 flex items-center gap-3">
          <app-token-logo
            :url="token.logoUrl"
            :symbol="token.symbol"
            class="w-8 h-8 rounded-full shadow-sm"
          />
          <div class="flex flex-col overflow-hidden">
            <app-tooltip :text="token.name" v-if="token.name.length > 20">
              <p
                class="text-s-15 font-medium truncate leading-tight max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
              >
                {{ token.name }}
              </p>
            </app-tooltip>
            <p
              v-else
              class="text-s-15 font-medium truncate leading-tight max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
            >
              {{ token.name }}
            </p>
            <p class="text-s-12 font-normal text-info uppercase tracking-tight">
              {{ truncate(token.symbol, 10) }}
            </p>
          </div>
        </div>
        <div class="col-span-1 flex flex-col items-end">
          <p class="text-s-14 font-normal">
            ${{ formatFiatValue(token.price).value }}
          </p>
          <div
            class="text-s-11 font-normal flex items-center gap-[2px]"
            :class="{
              'text-error': token.priceChangePercentage24h < 0,
              'text-success': token.priceChangePercentage24h >= 0,
            }"
          >
            <span
              >{{ token.priceChangePercentage24h >= 0 ? '+' : ''
              }}{{
                formatPercentageValue(token.priceChangePercentage24h).value
              }}</span
            >
            <ArrowTrendingDownIcon
              v-if="token.priceChangePercentage24h < 0"
              class="h-2.5 w-2.5"
            />
            <ArrowTrendingUpIcon v-else class="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import type { CryptoOverviewToken } from '@/mew_api/types'
import { truncate } from '@/utils/filters'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/solid'

defineProps<{
  token: CryptoOverviewToken
}>()
</script>
