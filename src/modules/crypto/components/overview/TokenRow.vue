<template>
  <router-link
    class="flex gap-3 rounded-16 hoverBGWhite shadow-button py-2 px-3 items-center bg-white"
    :to="{
      name: TOKEN_INFO_ROUTE_NAMES.crypto,
      params: {
        tokenId: token.coinId,
      },
    }"
  >
    <app-token-logo :url="token.logoUrl" :symbol="token.symbol" />
    <div class="truncate">
      <p class="truncate text-s-14">{{ token.name }}</p>
      <p class="text-info text-s-12 uppercase">
        {{ truncate(token.symbol, 7) }}
      </p>
    </div>
    <div class="ml-auto">
      <p class="text-s-14 text-right">
        ${{ formatFiatValue(token.price).value }}
      </p>
      <p
        class="text-s-12 text-right"
        :class="{
          'text-error': token.priceChangePercentage24h < 0,
          'text-success': token.priceChangePercentage24h >= 0,
        }"
      >
        {{ formatPercentageValue(token.priceChangePercentage24h).value }}
      </p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import type { CryptoOverviewToken } from '@/mew_api/types'
import { truncate } from '@/utils/filters'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'

defineProps<{
  token: CryptoOverviewToken
}>()
</script>
