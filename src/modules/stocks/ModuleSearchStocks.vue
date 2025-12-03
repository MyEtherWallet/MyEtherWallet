<template>
  <app-sheet
    :is-elivated="false"
    sheet-class="bg-no-repeat bg-cover flex items-center justify-center !lg:p-0 !relative bg-[url('@/assets/images/backgrounds/eth-left.webp'),_url('@/assets/images/backgrounds/eth-right.webp'),_radial-gradient(circle_500px_at_50%_100%,_rgba(255,255,255,0.5)_60%,transparent_100%),_linear-gradient(to_bottom,transparent,rgba(255,255,255,0.6)_90px,rgba(255,255,255,1)_190px),linear-gradient(to_right,rgba(90,197,210,1)_0%,rgba(149,206,253,1)_50%,rgba(126,138,250,1)_100%)] bg-[length:20%,_20%,_100%,_100%,_100%] xl:bg-[length:230px,_230px,_100%,_100%,_100%] bg-[position:_left_10px_top_10px,_right_10px_bottom_0px,_center_center,_center_center,_center_center]
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
          class="flex grow gap-4 justify-between items-center p-[6px] bg-surface !w-full md:w-auto max-w-[500px] rounded-full"
        >
          <app-search-input
            v-model="searchInput"
            class="grow"
            placeholder="Search stock name or ticker"
          />
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
import { ref } from 'vue'
const searchInput = ref('')

interface TrendingStock {
  ticker: string
  logoUrl: string
}
const tempTrending: TrendingStock[] = [
  {
    ticker: 'AAPL',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'GOOGL',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'AMZN',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'MSFT',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
  {
    ticker: 'TSLA',
    logoUrl:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  },
]
</script>

<style scoped>
.no-balance-gradient {
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
}
</style>
