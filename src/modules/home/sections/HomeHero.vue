<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useStocksStore } from '@/stores/stocksStore'
import { useCryptoTrending } from '@/modules/home/composables/useCryptoTrending'
import HeroPortfolioCard from '@/modules/home/components/HeroPortfolioCard.vue'
import HeroTrendingCard from '@/modules/home/components/HeroTrendingCard.vue'
import type { TrendingRowItem } from '@/modules/home/components/heroTrending'
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
  <div
    data-test="home-hero"
    class="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr_1fr]"
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
</template>
