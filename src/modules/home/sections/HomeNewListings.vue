<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
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
import { useCryptoNewCoins } from '../composables/useCryptoNewCoins'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import AppNewListingCard from '@/components/AppNewListingCard.vue'
import type { Tab, Tab_Panel } from '@/types/components/appTabs'

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
  to: RouteLocationRaw
}

const { t } = useI18n()
const router = useRouter()
const stocksStore = useStocksStore()
const walletMenu = useWalletMenuStore()
const watchlistStore = useWatchlistStore()
const { formatFiat, formatFiatCompact } = useCurrency()
const { newCoins, fetchNewCoins } = useCryptoNewCoins()

// Stocks overview is triggered by ViewHome; crypto newCoins is section-only.
onMounted(fetchNewCoins)

const activeTabIndex = ref(0)

const tabs = computed<Tab[]>(() => [
  {
    id: 'home-listings-stocks-tab',
    name: t('homePage.listings.tab.stocks'),
    controlsPanel: 'home-listings-stocks-panel',
  },
  {
    id: 'home-listings-crypto-tab',
    name: t('homePage.listings.tab.crypto'),
    controlsPanel: 'home-listings-crypto-panel',
  },
])

const panels: Tab_Panel[] = [
  {
    id: 'home-listings-stocks-panel',
    ariaLabelledBy: 'home-listings-stocks-tab',
  },
  {
    id: 'home-listings-crypto-panel',
    ariaLabelledBy: 'home-listings-crypto-tab',
  },
]

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
</script>

<template>
  <div class="relative">
    <AppTabs
      v-model:activeTabIndex="activeTabIndex"
      :tabs="tabs"
      :panel="panels"
      :label="t('homePage.listings.title')"
    >
      <template #tab-panel>
        <div class="relative mt-6">
          <AppSlideGroup :total-items="items.length">
            <template
              v-for="(it, index) in items"
              :key="it.key"
              #[`item-${index}`]
            >
              <AppNewListingCard
                :logo="it.logo"
                :symbol="it.symbol"
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
                :trade-label="t('homePage.listings.trade')"
                @select="router.push(it.to)"
                @trade="walletMenu.openPanel(it.tradePanel)"
                @toggle-favorite="
                  watchlistStore.setWatchlistItem(it.favoriteId, it.isStock)
                "
              />
            </template>
          </AppSlideGroup>
        </div>
      </template>
    </AppTabs>
  </div>
</template>
