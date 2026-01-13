<template>
  <!-- Top: Trending -->
  <div>
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">Trending</h2>

      <div class="flex">
        <app-btn-icon
          class=""
          :disabled="isLoading || page === 1"
          label="previous page"
          @click="previousPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>
        <app-btn-icon
          class=""
          :disabled="isLoading || page >= totalPages"
          label="next page"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-2" v-if="!isLoading">
      <div v-for="token in currentTrendingTokens" :key="token.symbol">
        <token-row :token="token" />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-2 animate-pulse" v-else>
      <div
        v-for="token in 3"
        :key="`loading-trending-${token}`"
        class="basis-full bg-grey-10 flex items-end justify-between rounded-16 w-full h-[55px]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'
import BigNumber from 'bignumber.js'
import TokenRow from './components/TokenRow.vue'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'

const stocksStore = useStocksStore()
const { isLoadingOverview: isLoading, trending: trendingTokens } =
  storeToRefs(stocksStore)

/** --------------------------
 * Pagination
 --------------------------*/
const itemsPerPage = ref(4)
const page = ref(1)

const totalPages = computed(() =>
  new BigNumber(trendingTokens.value.length)
    .div(itemsPerPage.value)
    .integerValue(BigNumber.ROUND_CEIL)
    .toNumber(),
)

const currentTrendingTokens = computed(() => {
  const startIndex = (page.value - 1) * itemsPerPage.value
  const endIndex = page.value * itemsPerPage.value
  return trendingTokens.value.slice(startIndex, endIndex)
})

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1
  }
}
const previousPage = () => {
  if (page.value > 1) {
    page.value -= 1
  }
}
</script>
