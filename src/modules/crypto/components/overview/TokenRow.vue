<template>
  <router-link
    class="flex items-center w-full mb-1 py-1.5 hoverBGWhite cursor-pointer rounded-12 px-1 xs:px-3 transition-colors duration-200 gap-3"
    :to="getRouteParams"
  >
    <app-token-logo
      :url="token.logoUrl"
      :symbol="token.symbol"
      :is-stock="token.ondo !== null"
    />
    <div class="truncate">
      <app-token-symbol
        :symbol="token.symbol"
        :is-stock="props.token.ondo !== null"
      />
      <app-tooltip :text="name" v-if="name.length > 20">
        <p
          class="hidden xs:block text-s-12 text-info truncate mt-0.5 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
        >
          {{ name }}
        </p>
      </app-tooltip>
      <p
        v-else
        class="hidden xs:block text-s-12 text-info truncate mt-0.5 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
      >
        {{ name }}
      </p>
    </div>
    <div class="ml-auto">
      <p class="text-s-14 text-right">
        {{ formatFiat(token.price).display }}
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
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import {
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import { computed } from 'vue'

const { formatFiat } = useCurrency()

// TokenRow renders any crypto-overview-shaped token (new coins, trending, ondo
// gainers). It reads only the fields below, so the prop is typed to that shared
// subset — the full CryptoOverviewToken (with market cap / volume /
// supportedChains) and the narrower trending/gainers shapes all satisfy it.
interface TokenRowToken {
  coinId: string
  name: string
  symbol: string
  logoUrl: string | null
  price: number
  priceChangePercentage24h: number
  ondo: {
    stockAlias?: string | null
    primaryMarket: { symbol: string }
  } | null
}

const props = defineProps<{
  token: TokenRowToken
}>()

const name = computed(() => {
  return props.token.ondo !== null && props.token.ondo.stockAlias
    ? props.token.ondo.stockAlias
    : props.token.name
})

const getRouteParams = computed(() => {
  if (props.token.ondo !== null) {
    return {
      name: STOCK_INFO_ROUTE_NAMES.crypto,
      params: { symbol: props.token.ondo.primaryMarket.symbol },
    }
  } else {
    return {
      name: TOKEN_INFO_ROUTE_NAMES.crypto,
      params: { tokenId: props.token.coinId },
    }
  }
})
</script>
