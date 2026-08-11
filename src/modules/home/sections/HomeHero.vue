<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useStocksStore } from '@/stores/stocksStore'
import { useCryptoTrending } from '@/modules/home/composables/useCryptoTrending'
import HeroPortfolioCard from '@/modules/home/components/HeroPortfolioCard.vue'
import HeroTrendingCard from '@/modules/home/components/HeroTrendingCard.vue'
import HeroBanner from '@/modules/home/components/HeroBanner.vue'
import type { TrendingRowItem } from '@/modules/home/components/heroTrending'

// Promo banner above the cards. Visible with placeholder copy for now; the
// final copy and whether it wires to an external campaign/service are still
// TBD. Flip to `false` (or wire to a real feature flag) when it needs to be
// hidden.
const SHOW_HERO_TRADE_BANNER = true
import {
  ROUTES_MAIN,
  STOCK_INFO_ROUTE_NAMES,
  TOKEN_INFO_ROUTE_NAMES,
} from '@/router/routeNames'

const { t } = useI18n()

// Card 2 — stocks: reuse the overview `trending` already fetched by ViewHome.
const stocksStore = useStocksStore()
const { trending: stockTrending, isLoadingOverview } = storeToRefs(stocksStore)

const stockItems = computed<TrendingRowItem[]>(() =>
  stockTrending.value.slice(0, 5).map(item => ({
    logo: item.iconPngUrl || item.iconSvgUrl,
    symbol: item.primaryMarket.symbol,
    name: item.underlyingMarket.name,
    isStock: true,
    price: item.primaryMarket.price ? Number(item.primaryMarket.price) : 0,
    change: item.primaryMarket.priceChangePercentage24h
      ? parseFloat(item.primaryMarket.priceChangePercentage24h)
      : 0,
    to: {
      name: STOCK_INFO_ROUTE_NAMES.stocks,
      params: { symbol: item.primaryMarket.symbol },
    },
  })),
)

// Card 3 — crypto: dedicated trending-tokens fetch (top 5).
const {
  trending: cryptoTrending,
  fetchTrending,
  isLoading: isLoadingCrypto,
} = useCryptoTrending()

const cryptoItems = computed<TrendingRowItem[]>(() =>
  cryptoTrending.value.slice(0, 5).map(item => ({
    logo: item.logoUrl ?? undefined,
    symbol: item.symbol,
    name: item.name,
    isStock: !!item.ondo,
    price: item.price,
    change: item.priceChangePercentage24h,
    to: item.ondo
      ? {
          name: STOCK_INFO_ROUTE_NAMES.crypto,
          params: { symbol: item.ondo.primaryMarket.symbol },
        }
      : {
          name: TOKEN_INFO_ROUTE_NAMES.crypto,
          params: { tokenId: item.coinId },
        },
  })),
)

onMounted(fetchTrending)
</script>

<template>
  <div data-test="home-hero" class="flex flex-col gap-6">
    <HeroBanner v-if="SHOW_HERO_TRADE_BANNER" />
    <div
      class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
    >
      <HeroPortfolioCard />
      <HeroTrendingCard
        :title="t('homePage.hero.trendingStocks')"
        :see-all-to="{ name: ROUTES_MAIN.STOCKS.NAME }"
        :items="stockItems"
        :is-loading="isLoadingOverview"
      />
      <HeroTrendingCard
        :title="t('homePage.hero.trendingCrypto')"
        :see-all-to="{ name: ROUTES_MAIN.CRYPTO.NAME }"
        :items="cryptoItems"
        :is-loading="isLoadingCrypto"
      />
    </div>
  </div>
</template>
