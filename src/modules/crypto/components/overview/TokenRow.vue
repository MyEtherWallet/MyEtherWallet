<template>
  <router-link
    class="flex w-full mb-1 py-1.5 hoverBGWhite cursor-pointer rounded-12 px-3 transition-colors duration-200 gap-3"
    :to="{
      name: TOKEN_INFO_ROUTE_NAMES.crypto,
      params: {
        tokenId: token.coinId,
      },
    }"
  >
    <app-token-logo :url="token.logoUrl" :symbol="token.symbol" />
    <div class="truncate">
      <app-token-symbol :symbol="token.symbol" />
      <app-tooltip :text="token.name" v-if="token.name.length > 20">
        <p
          class="hidden xs:block text-s-12 text-info truncate mt-0.5 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
        >
          {{ token.name }}
        </p>
      </app-tooltip>
      <p
        v-else
        class="hidden xs:block text-s-12 text-info truncate mt-0.5 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
      >
        {{ token.name }}
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
import AppTooltip from '@/components/AppTooltip.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import type { CryptoOverviewToken } from '@/mew_api/types'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'

defineProps<{
  token: CryptoOverviewToken
}>()
</script>
