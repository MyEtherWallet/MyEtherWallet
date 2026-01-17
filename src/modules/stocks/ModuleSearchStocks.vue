<template>
  <app-sheet
    :is-elivated="false"
    sheet-class="bg-no-repeat xl:bg-contain flex items-center justify-center !lg:p-0 !relative bg-[url('@/assets/images/backgrounds/eth-left.webp'),_url('@/assets/images/backgrounds/eth-right.webp'),_radial-gradient(circle_500px_at_50%_100%,_rgba(255,255,255,0.5)_60%,transparent_100%),_linear-gradient(to_bottom,transparent,rgba(255,255,255,0.6)_90px,rgba(255,255,255,1)_190px),linear-gradient(to_right,rgba(90,197,210,1)_0%,rgba(149,206,253,1)_50%,rgba(126,138,250,1)_100%)] bg-[size:0px,_0px,_100%,_100%,_100%] lg:bg-[size:190px,_190px,_100%,_100%,_100%] xl:bg-[size:230px,_230px,_100%,_100%,_100%] bg-[position:_left_10px_top_10px,_right_10px_bottom_0px,_center_center,_center_center,_center_center]
"
  >
    <div class="w-full flex flex-col gap-6 lg:gap-10 lg:py-8">
      <div class="lg:ml-4 lg:mt-3 text-center">
        <h1 class="text-s-28 lg:text-s-40 font-bold">
          Explore Tokenized Stock
        </h1>
        <p class="text-s-14 lg:text-s-16 text-info">
          100+ stock options, powered by Ondo
        </p>
      </div>
      <div class="flex items-center justify-center flex-col">
        <div
          class="flex grow gap-4 justify-between items-center p-[6px] bg-surface !w-full md:w-auto max-w-[500px] rounded-full relative"
        >
          <app-search-input
            ref="focusTarget"
            v-model="searchInput"
            class="grow"
            placeholder="Search stock name or ticker"
          />
          <transition name="fade" mode="out-in">
            <div
              v-if="focused"
              class="absolute bottom-[-4px] left-[5px] z-10 w-full max-w-[calc(100%-10px)] bg-white rounded-20 shadow-2xl border-surface border-1 px-2 py-4 translate-y-full overflow-y-auto max-h-[300px] overflow-y-auto"
            >
              <transition name="fade" mode="out-in">
                <div
                  v-if="isLoading"
                  key="search_is_loading"
                  class="h-[64px] flex items-center justify-center"
                >
                  <svg
                    aria-hidden="true"
                    class="animate-spin mx-auto text-primary fill-white/90"
                    viewBox="0 0 100 101"
                    width="24"
                    height="24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
                <div v-else key="search_loaded_results">
                  <!-- Results-->
                  <div
                    v-if="results.length && searchInput !== ''"
                    class="flex flex-col gap-1"
                  >
                    <button
                      v-for="(stock, i) in results"
                      :key="stock.primaryMarket.symbol"
                      class="w-full flex items-center gap-3 hoverNoBG rounded-12 py-2 px-3 text-left"
                      :class="{ 'bg-mewBg': i == 0 }"
                    >
                      <app-token-logo
                        :symbol="stock.primaryMarket.symbol"
                        :url="stock.iconPngUrl || stock.iconSvgUrl"
                        :is-stock="true"
                      />
                      <div class="grow min-w-0">
                        <app-token-symbol
                          :symbol="stock.primaryMarket.symbol"
                          :is-stock="true"
                        />
                        <app-tooltip
                          :text="stock.underlyingMarket.name"
                          v-if="stock.underlyingMarket.name.length > 12"
                        >
                          <p class="text-s-12 text-info truncate">
                            {{ stock.underlyingMarket.name }}
                          </p>
                        </app-tooltip>
                        <p v-else class="text-s-12 text-info truncate">
                          {{ stock.underlyingMarket.name }}
                        </p>
                      </div>
                      <div class="flex flex-col items-end flex-none">
                        <p class="text-s-14 font-medium">
                          ${{
                            formatFiatValue(stock.primaryMarket.price).value
                          }}
                        </p>
                        <p
                          :class="
                            parseFloat(
                              stock.primaryMarket.priceChangePercentage24h,
                            ) > 0
                              ? 'text-success'
                              : 'text-error'
                          "
                          class="text-s-12"
                        >
                          {{
                            formatPercentageValue(
                              stock.primaryMarket.priceChangePercentage24h,
                            ).value
                          }}
                        </p>
                      </div>
                    </button>
                  </div>
                  <p
                    v-if="showNoDataMessage"
                    key="search_no_data_message"
                    class="text-s-14 text-info flex items-center justify-center text-wrap break-all h-[64px]"
                  >
                    <exclamation-circle-icon
                      class="inline-block w-5 h-5 text-grey-50 mr-1"
                    />
                    No results found for:
                    {{ searchInput }}
                  </p>
                  <!-- Suggestions Trending and Recently Viewed -->
                  <div
                    v-if="
                      !searchInput || searchInput === '' || results.length === 0
                    "
                  >
                    <!-- <p class="text-s-12 font-medium text-info ml-3 mb-1">
                  Recently Viewed
                </p>
                <div
                  class="flex items-center justify-start gap-1 flex-wrap mb-2"
                >
                  <button
                    v-for="(stock, i) in trendingTokens"
                    :key="i"
                    class="flex items-center justify-start hoverNoBG rounded-full py-1 px-2"
                  >
                    <app-token-logo
                      :symbol="stock.ticker"
                      :url="stock.logoUrl"
                      height="w-5"
                      width="w-5"
                      class="mr-1"
                    />
                    <p class="uppercase text-s-14">{{ stock.ticker }}</p>
                  </button>
                </div> -->
                    <!-- Trending-->
                    <div
                      v-if="
                        !searchInput ||
                        searchInput === '' ||
                        results.length === 0
                      "
                    >
                      <p class="text-s-12 font-medium text-info ml-3 mb-1">
                        Trending
                      </p>
                      <div
                        class="flex items-center justify-start gap-1 flex-wrap mb-2"
                      >
                        <button
                          v-for="(stock, i) in trendingTokens.slice(0, 4)"
                          :key="i"
                          class="flex items-center justify-start hoverNoBG rounded-full py-1 px-2"
                        >
                          <app-token-logo
                            :symbol="stock.primaryMarket.symbol"
                            :url="stock.iconPngUrl || stock.iconSvgUrl"
                            height="w-6"
                            width="w-6"
                            class="mr-1 text-s-12"
                            :is-stock="true"
                          />
                          <app-token-symbol
                            :symbol="stock.primaryMarket.symbol"
                            :is-stock="true"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </transition>
        </div>
        <div class="mt-4 flex gap-1 flex-wrap items-center justify-center">
          <p class="font-semibold text-s-14">Trending:</p>
          <button
            v-for="(stock, i) in trendingTokens.slice(0, 4)"
            :key="i"
            class="flex items-center justify-start hoverNoBG rounded-full py-1 px-2"
          >
            <app-token-logo
              :symbol="stock.primaryMarket.symbol"
              :url="stock.iconPngUrl || stock.iconSvgUrl"
              height="h-6"
              width="w-6"
              class="mr-1 text-s-12"
              :is-stock="true"
            />
            <app-token-symbol
              :symbol="stock.primaryMarket.symbol"
              :is-stock="true"
            />
          </button>
        </div>
      </div>
    </div>
  </app-sheet>
</template>

<script setup lang="ts">
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import AppSheet from '@/components/AppSheet.vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'
import { ref, computed } from 'vue'
import {
  formatFiatValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { useFocusWithin, watchDebounced } from '@vueuse/core'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { type GetWebStocksSummaryResponse } from '@/mew_api/types'

const stocksStore = useStocksStore()
const { trending: trendingTokens, isLoadingOverview } = storeToRefs(stocksStore)

const searchInput = ref('')
const { useMEWFetch } = useFetchMewApi()

const searchUrl = '/v1/web/pages/stocks/summary'

const { data: searchData, isFetching } = useMEWFetch(searchUrl)
  .get()
  .json<GetWebStocksSummaryResponse>()

const results = computed(() => {
  if (isLoading.value || !searchInput.value || searchInput.value === '')
    return []
  const query = searchInput.value.toLowerCase()
  const data = searchData.value || []

  const startsWithMatches: GetWebStocksSummaryResponse = []
  const containsMatches: GetWebStocksSummaryResponse = []

  data.forEach(item => {
    const symbol = item.primaryMarket.symbol.toLowerCase()
    const name = item.underlyingMarket.name.toLowerCase()

    if (symbol.startsWith(query) || name.startsWith(query)) {
      startsWithMatches.push(item)
    } else if (symbol.includes(query) || name.includes(query)) {
      containsMatches.push(item)
    }
  })

  return [...startsWithMatches, ...containsMatches]
})

const showDropdown = ref(false)

const focusTarget = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(focusTarget)

const isLoading = computed(() => {
  return isLoadingOverview.value || isFetching.value
})
const showNoDataMessage = computed(() => {
  return (
    searchInput.value && searchInput.value !== '' && results.value.length === 0
  )
})

watchDebounced(
  focused,
  () => {
    showDropdown.value = focused.value
  },
  { debounce: 500 },
)
</script>
