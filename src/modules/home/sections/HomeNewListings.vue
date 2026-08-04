<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useStocksStore } from '@/stores/stocksStore'
import {
  useWalletMenuStore,
  type WalletPanel,
} from '@/stores/walletMenuStore'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useCurrency } from '@/composables/useCurrency'
import {
  STOCK_INFO_ROUTE_NAMES,
  TOKEN_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import type { CryptoOverviewToken } from '@/mew_api/types'
import { useCryptoNewCoins } from '../composables/useCryptoNewCoins'
import {
  useNewListingSwap,
  type ListingSupportedChain,
} from '../composables/useNewListingSwap'
import AppTabBar from '@/components/AppTabBar.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import AppNewListingCard from '@/components/AppNewListingCard.vue'
import AppTooltipHint from '@/components/AppTooltipHint.vue'

// Unified shape both stock and crypto listings map onto for the card.
interface ListingCardItem {
  key: string
  symbol: string
  name?: string
  price?: string
  description?: string
  marketCap: string
  change?: number
  volume: string
  logo?: string
  favorite: boolean
  favoriteId: string
  isStock: boolean
  tradePanel: WalletPanel
  ctaLabel: string
  tooltip: string
  to: RouteLocationRaw
  // Crypto only: on-chain chains from the overview payload, when present. Absent
  // (undefined) → useNewListingSwap looks the coin up by id instead.
  supportedChains?: ListingSupportedChain[]
}

const { t } = useI18n()
const router = useRouter()
const stocksStore = useStocksStore()
const walletMenu = useWalletMenuStore()
const watchlistStore = useWatchlistStore()
const { formatFiat, formatFiatCompact } = useCurrency()
const { newCoins, fetchNewCoins } = useCryptoNewCoins()
const { openSwapForToken } = useNewListingSwap()

// Stocks overview is triggered by ViewHome; crypto newCoins is section-only.
onMounted(fetchNewCoins)

const activeTabIndex = ref(0)

const slideGroup = ref<{ scrollToStart: () => void } | null>(null)

// Reset the carousel to the first card whenever the tab changes so we never
// land mid-scroll on the newly-shown set.
watch(activeTabIndex, () => {
  nextTick(() => slideGroup.value?.scrollToStart?.())
})

const tabLabels = computed(() => [
  t('homePage.listings.tab.stocks'),
  t('homePage.listings.tab.crypto'),
])

const stockItems = computed<ListingCardItem[]>(() =>
  stocksStore.newlyAdded.map(item => ({
    key: item.primaryMarket.symbol,
    name: item.underlyingMarket.name,
    symbol: item.primaryMarket.symbol,
    price: item.primaryMarket.price
      ? formatFiat(item.primaryMarket.price).display
      : undefined,
    // data gap: newlyAdded has no description field (src/mew_api/schema.ts) —
    // card renders without one until a source exists.
    description: undefined,
    marketCap: item.underlyingMarket.marketCap
      ? formatFiatCompact(item.underlyingMarket.marketCap).display
      : '-',
    change: item.primaryMarket.priceChangePercentage24h
      ? parseFloat(item.primaryMarket.priceChangePercentage24h)
      : undefined,
    volume: item.underlyingMarket.volume24h
      ? formatFiatCompact(item.underlyingMarket.volume24h).display
      : '-',
    logo: item.iconPngUrl || item.iconSvgUrl,
    favorite: watchlistStore.isWatchListed(item.primaryMarket.symbol),
    favoriteId: item.primaryMarket.symbol,
    isStock: true,
    tradePanel: 'trade',
    ctaLabel: t('homePage.listings.trade'),
    tooltip: t('homePage.listings.openStockPage'),
    to: {
      name: STOCK_INFO_ROUTE_NAMES.stocks,
      params: { symbol: item.primaryMarket.symbol },
    },
  })),
)

// Crypto tab: the `newCoins` from the crypto overview. These only carry
// price + 24h change (no market cap / volume in the API), so those stats show
// "-". Ondo-backed coins link to the stock page; the rest to the token page.
const cryptoItems = computed<ListingCardItem[]>(() =>
  newCoins.value.map(item => ({
    key: item.coinId,
    name: item.name,
    symbol: item.symbol,
    price: formatFiat(item.price).display,
    description: undefined,
    marketCap: '-',
    change: item.priceChangePercentage24h,
    volume: '-',
    logo: item.logoUrl ?? undefined,
    favorite: watchlistStore.isWatchListed(item.coinId),
    favoriteId: item.coinId,
    isStock: false,
    tradePanel: 'swap',
    ctaLabel: t('homePage.listings.swap'),
    tooltip: t('homePage.listings.openCryptoPage'),
    // ponytail: cast until the BE adds `supportedChains` to overview newCoins
    // (same shape as the stocks response) and the schema is regenerated.
    supportedChains: (
      item as CryptoOverviewToken & {
        supportedChains?: ListingSupportedChain[]
      }
    ).supportedChains,
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

const items = computed<ListingCardItem[]>(() =>
  activeTabIndex.value === 0 ? stockItems.value : cryptoItems.value,
)

// Open the wallet drawer with the card's token preselected.
// - Stocks open the Trade panel, which restores its "to" token from
//   selectedTradeTokenSymbol — set that first (same as ViewStockInfo / the
//   stocks & balance tables).
// - Crypto opens the Swap panel, which matches its "to" token by on-chain
//   contract address. useNewListingSwap resolves it from the payload's
//   supportedChains, then primes the swap values and opens the panel itself.
const onTrade = (it: ListingCardItem) => {
  if (it.isStock) {
    walletMenu.setSelectedTradeTokenSymbol(it.symbol)
    walletMenu.openPanel('trade')
  } else {
    openSwapForToken(it.symbol, it.name ?? '', it.supportedChains)
  }
}
</script>

<template>
  <div class="relative">
    <AppTabBar v-model="activeTabIndex" :tabs="tabLabels" />
    <div class="relative mt-6">
      <AppSlideGroup ref="slideGroup" :total-items="items.length" edge-nav>
        <template
          v-for="(it, index) in items"
          :key="it.key"
          #[`item-${index}`]
        >
          <AppTooltipHint :text="it.tooltip">
            <AppNewListingCard
              :logo="it.logo"
              :symbol="it.symbol"
              :is-stock="it.isStock"
              :name="it.name"
              :price="it.price"
              :description="it.description"
              :market-cap-label="t('homePage.listings.stat.marketCap')"
              :market-cap="it.marketCap"
              :change-label="t('homePage.listings.stat.change24h')"
              :change="it.change"
              :volume-label="t('homePage.listings.stat.volume24h')"
              :volume="it.volume"
              :favorite="it.favorite"
              :trade-label="it.ctaLabel"
              @select="router.push(it.to)"
              @trade="onTrade(it)"
              @toggle-favorite="
                watchlistStore.setWatchlistItem(it.favoriteId, it.isStock)
              "
            />
          </AppTooltipHint>
        </template>
      </AppSlideGroup>
    </div>
  </div>
</template>
