<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStocksStore } from '@/stores/stocksStore'
import { useCurrency } from '@/composables/useCurrency'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import AppNewListingCard from '@/components/AppNewListingCard.vue'
import type { Tab, Tab_Panel } from '@/types/components/appTabs'

const { t } = useI18n()
const stocksStore = useStocksStore()
const { formatFiat } = useCurrency()

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

const stockItems = computed(() =>
  stocksStore.newlyAdded.map(item => ({
    key: item.primaryMarket.symbol,
    name: item.underlyingMarket.name,
    symbol: item.primaryMarket.symbol,
    price: item.primaryMarket.price
      ? formatFiat(item.primaryMarket.price).display
      : undefined,
    change: item.primaryMarket.priceChangePercentage24h
      ? parseFloat(item.primaryMarket.priceChangePercentage24h)
      : undefined,
    logo: item.iconPngUrl || item.iconSvgUrl,
    to: {
      name: STOCK_INFO_ROUTE_NAMES.stocks,
      params: { symbol: item.primaryMarket.symbol },
    },
  })),
)

// No crypto "newly added" overview endpoint exists yet (unlike stocksStore's
// `newlyAdded`, there's no equivalent crypto store/composable at the time of
// writing) — documented placeholder until that data source lands.
const cryptoItems: (typeof stockItems)['value'] = []

const items = computed(() =>
  activeTabIndex.value === 0 ? stockItems.value : cryptoItems,
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
                :name="it.name"
                :symbol="it.symbol"
                :price="it.price"
                :change="it.change"
                :logo="it.logo"
                :to="it.to"
              />
            </template>
          </AppSlideGroup>
        </div>
      </template>
    </AppTabs>
  </div>
</template>
