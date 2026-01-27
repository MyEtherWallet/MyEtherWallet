<template>
  <div class="flex flex-col mb-10 w-full divide-y divide-grey-10">
    <div class="pb-3 xs:pb-5">
      <!-- Header: Share and Watchlist (Placeholders) -->
      <div
        class="flex items-center justify-end gap-3 mt-2 sm:mt-4 mb-2 mr-[72px] xs:mr-[80px]"
      >
        <app-btn-icon label="Share" :disabled="isLoading">
          <ShareIcon class="h-5 w-5" />
        </app-btn-icon>
        <app-btn-icon label="Star" :disabled="isLoading">
          <StarIcon class="h-5 w-5" />
        </app-btn-icon>
      </div>

      <!-- Stock info: Logo, Name, Price -->
      <div
        v-if="isLoading || !stockData"
        class="mx-3 xs:mx-6 md:mx-4 lg:mx-10 h-[63px] lg:h-[65px] xl:h-[67px] animate-pulse bg-surface rounded-12 w-[60%]"
      ></div>
      <div
        v-else
        :class="[
          isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10',
          'px-4 py-0 flex items-start gap-4',
        ]"
      >
        <div class="relative">
          <app-token-logo
            :url="stockData.iconPngUrl || stockData.iconSvgUrl"
            :symbol="stockData.stockAlias || symbol"
            :is-stock="true"
            width="w-10 xs:w-[56px]"
            height="h-10 xs:h-[56px]"
          />
          <div
            class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
          >
            <app-token-logo
              v-if="selectedChain && existsOnCurrentChain"
              :url="selectedChain.icon"
              :symbol="selectedChain.name"
              width="w-5"
              height="h-5"
            />
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex flex-row flex-wrap items-end gap-2">
            <AppTokenSymbol
              :symbol="symbol"
              :is-stock="true"
              class="text-s-20 xs:text-s-24 xl:text-s-28 !font-bold !leading-p-110"
            />
            <h1 class="text-s-17 xs:text-s-20 leading-p-110 font-semibold">
              ({{ stockData.stockAlias }})
            </h1>
          </div>

          <div v-if="stockData.primaryMarket">
            <p class="text-s-20 xs:text-s-24 inline">
              ${{ formatFiatValue(stockData.primaryMarket.price).value }}
            </p>
            <div
              v-if="stockData.primaryMarket.priceChangePercentage24h"
              class="inline-block ml-2"
            >
              <ArrowTrendingDownIcon
                v-if="
                  Number(stockData.primaryMarket.priceChangePercentage24h) < 0
                "
                class="w-4 h-4 inline-block text-error"
              />
              <ArrowTrendingUpIcon
                v-else
                class="w-4 h-4 inline-block text-success"
              />
              <span
                :class="[
                  {
                    'text-success':
                      Number(
                        stockData.primaryMarket.priceChangePercentage24h,
                      ) >= 0,
                    'text-error':
                      Number(stockData.primaryMarket.priceChangePercentage24h) <
                      0,
                  },
                  'ml-1 text-s-14 xs:text-s-17 ',
                ]"
              >
                {{
                  formatPercentageValue(
                    stockData.primaryMarket.priceChangePercentage24h,
                  ).value
                }}
              </span>
            </div>
          </div>
          <p
            v-if="!isLoading && existsOnCurrentChain"
            class="text-s-8 xs:text-s-11 tracking-sp-06 font-bold uppercase text-info"
          >
            on {{ selectedChain?.name }}
          </p>
        </div>
      </div>
    </div>

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
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import ModuleStockInfoChart from './ModuleStockInfoChart.vue'
import StockUnderlyingAsset from './components/stock_info/StockInfoUnderlyingAsset.vue'
import StockInfoAbout from './components/stock_info/StockInfoAbout.vue'
import StockInfoPrice from './components/stock_info/StockInfoPrice.vue'
import TokenInfoSupportedChains from '../crypto/components/token_info/TokenInfoSupportedChains.vue'
import TokenInfoBalance from '../crypto/components/token_info/TokenInfoBalance.vue'
import {
  ShareIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/vue/24/outline'
import {
  formatFiatValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import type { GetWebStocksInfoSummaryResponse } from '@/mew_api/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
})

const { useMEWFetch } = useFetchMewApi()
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
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
const { data, isFetching, onFetchError, onFetchResponse } = useMEWFetch(
  fetchUrl,
  {
    refetch: true,
  },
)
  .get()
  .json<GetWebStocksInfoSummaryResponse>()

onFetchResponse(() => {
  if (data.value) {
    isLoadedData.value = true
    stockData.value = data.value
  }
})

onFetchError(() => {
  isLoadedData.value = true
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
</script>
