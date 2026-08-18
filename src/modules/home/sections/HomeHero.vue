<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useStocksStore } from '@/stores/stocksStore'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useCryptoTrending } from '@/modules/home/composables/useCryptoTrending'
import { useWatchlistRows } from '@/modules/home/composables/useWatchlistRows'
import HeroPortfolioCard from '@/modules/home/components/HeroPortfolioCard.vue'
import HeroTrendingCard from '@/modules/home/components/HeroTrendingCard.vue'
import HeroBanner from '@/modules/home/components/HeroBanner.vue'
import HeroWatchlistBanner from '@/modules/home/components/HeroWatchlistBanner.vue'
import HomeWatchlistTable from '@/modules/home/components/HomeWatchlistTable.vue'
import HomeWatchlistOnboardingDialog from '@/modules/home/components/HomeWatchlistOnboardingDialog.vue'
import type { TrendingRowItem } from '@/modules/home/components/heroTrending'
import {
  ROUTES_MAIN,
  STOCK_INFO_ROUTE_NAMES,
  TOKEN_INFO_ROUTE_NAMES,
} from '@/router/routeNames'

// Feature flags — flip to `true` to re-enable on the home page.
// Promo "Trade and get 5 USDC" banner above the cards (copy/campaign still TBD).
const SHOW_HERO_TRADE_BANNER: boolean = false
// Build-your-watchlist banner + table + add-to-watchlist modal.
const SHOW_WATCHLIST: boolean = false

const { t } = useI18n()

// "Build your watchlist" banner, shown below the cards only while the user's
// watchlist is empty (first-time onboarding). Once it has items, the table
// replaces the banner. Only wired when the flag is on so it doesn't fetch or
// initialise perps while hidden.
const watchlistStore = useWatchlistStore()
const { watchListedTokens, watchListedStocks, watchListedPerps } =
  storeToRefs(watchlistStore)
const isWatchlistEmpty = computed(
  () =>
    !watchListedTokens.value.length &&
    !watchListedStocks.value.length &&
    !watchListedPerps.value.length,
)

const watchlist = SHOW_WATCHLIST ? useWatchlistRows() : null
watchlist?.refresh()
const watchlistRows = computed(() => watchlist?.rows.value ?? [])
// Show the table only when there is actually something to render (or it's still
// loading) — otherwise fall back to the banner. This covers both "removed
// everything" and watchlisted ids that never resolve to a row.
const showWatchlistTable = computed(
  () =>
    SHOW_WATCHLIST &&
    !isWatchlistEmpty.value &&
    ((watchlist?.isLoading.value ?? false) || watchlistRows.value.length > 0),
)

// Opens the build-your-watchlist onboarding wizard.
const isOnboardingOpen = ref(false)
const onWatchlistBegin = () => {
  isOnboardingOpen.value = true
}

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
    <!-- Container-query layout so the Hero reflows on the AVAILABLE width (which
         shrinks when the wallet side panel opens), not the viewport:
         - wide: 3 columns (balance 2fr + the two trending 1fr each),
         - medium (side panel open / smaller screens): balance full-width on top,
           the two trending side-by-side in a row below,
         - narrow: fully stacked. -->
    <div class="@container">
      <!-- Jumps map to viewport ~768 / ~1440 (container = viewport − ~144px of
           rail + section padding): stacked → balance-top + 2 trending (2 cols)
           → 3 columns. The side panel shrinks the container, so it collapses
           early when open. -->
      <div
        class="grid grid-cols-1 gap-6 @min-[624px]:grid-cols-2 @min-[1296px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
      >
        <HeroPortfolioCard
          class="@min-[624px]:col-span-2 @min-[1296px]:col-span-1"
        />
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
    <template v-if="SHOW_WATCHLIST">
      <HeroWatchlistBanner
        v-if="!showWatchlistTable"
        @begin="onWatchlistBegin"
      />
      <HomeWatchlistTable v-else :rows="watchlistRows" />
      <HomeWatchlistOnboardingDialog v-model:is-open="isOnboardingOpen" />
    </template>
  </div>
</template>
