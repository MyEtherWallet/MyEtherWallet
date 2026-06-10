<template>
  <div class="flex flex-col mb-10 w-full divide-y divide-grey-10">
    <app-asset-info-header
      :is-loading="isLoading"
      :has-data="!!stockData"
      :share-text="shareText"
      :is-watchlisted="isWatchlisted"
      :icon-url="stockData?.iconPngUrl || stockData?.iconSvgUrl || undefined"
      :symbol="stockData?.stockAlias || symbol"
      :name="stockData?.stockAlias || ''"
      :current-price="stockData?.primaryMarket?.price ?? null"
      :price-change-percentage="
        stockData?.primaryMarket?.priceChangePercentage24h ?? null
      "
      :selected-chain="selectedChain"
      :exists-on-current-chain="existsOnCurrentChain"
      :is-open-side-menu="isOpenSideMenu"
      :is-stock="true"
      @toggle-watchlist="toggleWatchlist"
    />

    <!-- Chart -->
    <div class="flex flex-col py-6">
      <div class="w-full px-3 xs:px-6 md:px-4 lg:px-10">
        <ModuleStockInfoChart :symbol="symbol" />
      </div>
      <token-info-balance
        v-if="!isLoading"
        :is-loading="isFetching"
        :chain-balances="stockData?.chainBalances"
        :token-icon-url="
          stockData?.iconPngUrl || stockData?.iconSvgUrl || undefined
        "
        :token-symbol="symbol"
        :supported-chains="stockData?.supportedChains"
        :current-price="stockData?.primaryMarket?.price || undefined"
        :is-stock="true"
      />
    </div>
    <!-- Price Stats -->
    <stock-info-price v-if="stockData" :data="stockData" />
    <!-- About -->
    <stock-info-about v-if="stockData" :data="stockData" />

    <!-- Underlying Asset Stats -->

    <StockUnderlyingAsset
      v-if="stockData"
      :asset="stockData.underlyingMarket"
      :ticker="stockData.stockAlias"
      :dividends="stockData.dividend"
    />
    <token-info-supported-chains
      v-if="stockData"
      :is-loading="isLoading"
      :token-icon-url="stockData.iconPngUrl || stockData.iconSvgUrl"
      :token-symbol="stockData.stockAlias || symbol"
      :supported-chains="stockData.supportedChains"
    />
    <div
      v-if="isLoading"
      :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6 ']"
    >
      <div
        class="h-[308px] xs:h-[227px] animate-pulse bg-surface rounded-12 w-full"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import AppAssetInfoHeader from '@/components/AppAssetInfoHeader.vue'
import ModuleStockInfoChart from './ModuleStockInfoChart.vue'
import StockUnderlyingAsset from './components/stock_info/StockInfoUnderlyingAsset.vue'
import StockInfoAbout from './components/stock_info/StockInfoAbout.vue'
import StockInfoPrice from './components/stock_info/StockInfoPrice.vue'
import TokenInfoSupportedChains from '../crypto/components/token_info/TokenInfoSupportedChains.vue'
import TokenInfoBalance from '../crypto/components/token_info/TokenInfoBalance.vue'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import type { GetWebStocksInfoSummaryResponse } from '@/mew_api/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
})

const { useMEWFetch } = useFetchMewApi()
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
const recentlyViewedTokensStore = useRecentlyViewedTokensStore()

/** --------------------
 * Watchlist
 --------------------*/
const watchlistStore = useWatchlistStore()
const { isWatchListed, setWatchlistItem } = watchlistStore

const isWatchlisted = computed(() => isWatchListed(props.symbol))

const toggleWatchlist = () => {
  setWatchlistItem(props.symbol, true) // true = isStock
}

/**--------------------
 * Fetch Stock Summary Data
 ---------------------*/
/**
 * Used to store fetched token data locally when switching between addresses
 */
const stockData = ref<GetWebStocksInfoSummaryResponse | undefined>(undefined)

const walletStore = useWalletStore()
const { walletAddress } = storeToRefs(walletStore)

const fetchUrl = computed(() => {
  const base = `/v1/web/pages/stocks-info/stocks/${props.symbol}/summary`
  if (walletAddress.value) {
    return `${base}?evmAddresses=${walletAddress.value}`
  }
  return base
})

const isLoadedData = ref(false)
const { data, isFetching, onFetchResponse } = useMEWFetch(fetchUrl, {
  refetch: true,
})
  .get()
  .json<GetWebStocksInfoSummaryResponse>()

onFetchResponse(() => {
  if (data.value) {
    isLoadedData.value = true
    stockData.value = data.value
    recentlyViewedTokensStore.addToken({
      id: props.symbol,
      symbol: props.symbol,
      icon: data.value.iconPngUrl || data.value.iconSvgUrl || undefined,
      name: data.value.stockAlias || props.symbol,
      isStock: true,
    })
  }
})

const isLoading = computed(() => {
  return !isLoadedData.value
})
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const existsOnCurrentChain = computed(() => {
  if (
    stockData.value &&
    stockData.value.supportedChains &&
    selectedChain.value
  ) {
    return stockData.value.supportedChains.some(
      chain => chain.chainName === selectedChain.value?.name,
    )
  }
  return false
})

/** --------------------
 * Share
 --------------------*/
const shareText = computed(() => {
  const ticker = stockData.value?.stockAlias || props.symbol
  const price = stockData.value?.primaryMarket?.price
    ? `$${formatFiatValue(stockData.value.primaryMarket.price).value}`
    : ''
  return t('common.share_message', { ticker, price })
})
</script>
