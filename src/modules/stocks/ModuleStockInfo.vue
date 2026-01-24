<template>
  <div
    class="flex flex-col mb-10 grid grid-cols-1 w-full divide-y divide-grey-10"
  >
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
        class="mx-3 xs:mx-6 md:mx-4 lg:mx-10 h-[64px] xs:h-[80px] lg:h-[65px] animate-pulse bg-surface rounded-12 w-[60%]"
      ></div>
      <div v-else class="flex items-center gap-4 px-3 xs:px-6 md:px-4 lg:px-10">
        <div class="relative">
          <app-token-logo
            :url="stockData.iconPngUrl || stockData.iconSvgUrl"
            :symbol="stockData.stockAlias || symbol"
            :is-stock="true"
            width="w-10 xs:w-[56px]"
            height="h-10 xs:h-[56px]"
          />
        </div>

        <div class="flex flex-col">
          <div class="flex flex row items-end gap-1">
            <AppTokenSymbol
              :symbol="symbol"
              :is-stock="true"
              class="text-s-20 xs:text-s-24 !font-bold !leading-p-110"
            />
            <h1 class="text-s-17 xs:text-s-20 leading-p-110 font-bold">
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
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="flex flex-col px-3 xs:px-6 md:px-4 lg:px-10 py-3 xs:py-5">
      <div class="w-full">
        <ModuleStockInfoChart :symbol="symbol" />
      </div>
    </div>

    <!-- About -->
    <stock-info-about v-if="stockData" :data="stockData" />

    <!-- Underlying Asset Stats -->

    <StockUnderlyingAsset
      v-if="stockData"
      :asset="stockData.underlyingMarket"
      :ticker="stockData.stockAlias"
      :dividends="stockData.dividend"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import ModuleStockInfoChart from './ModuleStockInfoChart.vue'
import StockUnderlyingAsset from './components/stock_info/StockInfoUnderlyingAsset.vue'
import StockInfoAbout from './components/stock_info/StockInfoAbout.vue'
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

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
})

const { useMEWFetch } = useFetchMewApi()

/**--------------------
 * Fetch Stock Summary Data
 ---------------------*/

const fetchUrl = computed(
  () => `/v1/web/pages/stocks-info/stocks/${props.symbol}/summary`,
)

const { data: stockData, isFetching: isLoading } = useMEWFetch(fetchUrl, {
  refetch: true,
})
  .get()
  .json<GetWebStocksInfoSummaryResponse>()
</script>
