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
              v-if="showDropdown"
              class="absolute bottom-[-4px] left-[5px] z-10 w-full max-w-[calc(100%-10px)] bg-white rounded-20 shadow-2xl border-surface border-2 px-2 py-4 translate-y-full min-h-[180px] overflow-y-auto"
            >
              <p
                v-if="searchInput && searchInput !== '' && results.length === 0"
                class="text-s-14 text-info text-center text-wrap break-all font-medium mb-4 mt-1 ml-3 border-b-grey-outline border-b-1 pt-3 pb-6"
              >
                <exclamation-circle-icon
                  class="inline-block w-5 h-5 text-grey-50 mr-1"
                />
                No results found for:
                {{ searchInput }}
              </p>
              <div
                v-if="
                  !searchInput || searchInput === '' || results.length === 0
                "
              >
                <p class="text-s-12 font-medium text-info ml-3 mb-1">
                  Recently Viewed
                </p>
                <div
                  class="flex items-center justify-start gap-1 flex-wrap mb-2"
                >
                  <button
                    v-for="(stock, i) in tempTrending"
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
                </div>
                <p class="text-s-12 font-medium text-info ml-3 mb-1 mt-5">
                  Trending
                </p>
                <div
                  class="flex items-center justify-start gap-1 flex-wrap mb-2"
                >
                  <button
                    v-for="(stock, i) in tempTrending"
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
                </div>
              </div>
              <div v-if="results.length" class="flex flex-col">
                <button
                  v-for="(stock, i) in results"
                  :key="stock.ticker"
                  class="w-full flex items-center gap-3 hoverNoBG rounded-12 py-2 px-3 text-left"
                  :class="{ 'bg-mewBg': i == 0 }"
                >
                  <app-token-logo :symbol="stock.ticker" :url="stock.logoUrl" />
                  <div class="w-full">
                    <p class="uppercase text-s-14 font-medium">
                      {{ stock.ticker }}
                    </p>
                    <p class="text-s-12 text-info">{{ stock.name }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-s-14">
                      ${{ formatFiatValue(randomPrice).value }}
                    </p>
                    <p
                      class="text-s-12"
                      :class="{
                        'text-error': randomPercentage < 0,
                        'text-success': randomPercentage >= 0,
                      }"
                    >
                      {{ formatPercentageValue(randomPercentage).value }}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </transition>
        </div>
        <div class="mt-4 flex gap-1 flex-wrap items-center justify-center">
          <p class="font-semibold text-s-14">Trending:</p>
          <button
            v-for="(stock, i) in tempTrending"
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
        </div>
      </div>
    </div>
  </app-sheet>
  <!-- Search Stocks Module Content Goes Here -->
</template>

<script setup lang="ts">
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppSheet from '@/components/AppSheet.vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'
import { ref, watch } from 'vue'
import {
  formatFiatValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'

import { useFocusWithin, watchDebounced } from '@vueuse/core'

const searchInput = ref('')

interface TrendingStock {
  ticker: string
  logoUrl: string
  name: string
}
const tempTrending: TrendingStock[] = [
  {
    ticker: 'AAPL',
    name: 'AAPLon',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'GOOGL',
    name: 'GOOGLon',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'AMZN',
    name: 'AMZNon',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'MSFT',
    name: 'MSFTon',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'TSLA',
    name: 'TSLAon',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
]

const showDropdown = ref(false)

const focusTarget = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(focusTarget)

watchDebounced(
  focused,
  () => {
    showDropdown.value = focused.value
  },
  { debounce: 500 },
)

// TEMP
const results = ref<TrendingStock[]>([])
watch(searchInput, newValue => {
  if (newValue && newValue !== '') {
    results.value = tempTrending.filter(
      stock =>
        stock.ticker.toLowerCase().includes(newValue.toLowerCase()) ||
        stock.name.toLowerCase().includes(newValue.toLowerCase()),
    )
  } else {
    results.value = []
  }
})

const randomPrice = Math.floor(Math.random() * 1000) / 100 + 100
const randomPercentage = Math.random() * 4 - 2
</script>

<style scoped>
/* .no-balance-gradient {
  background:
    radial-gradient(
      circle 500px at 50% 100%,
      rgba(255, 255, 255, 0.5) 60%,
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.6) 90px,
      rgba(255, 255, 255, 1) 190px
    ),
    linear-gradient(
      to right,
      rgba(90, 197, 210, 1) 0%,
      rgba(149, 206, 253, 1) 50%,
      rgba(126, 138, 250, 1) 100%
    );
} */
</style>
