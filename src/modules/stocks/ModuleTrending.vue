<template>
  <!-- Top: Trending -->
  <div>
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">{{ $t('common.trending') }}</h2>

      <div class="flex">
        <app-btn-icon
          class=""
          :disabled="isLoading || currentPage === 0"
          :label="$t('common.previous_page')"
          @click="prevPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>
        <app-btn-icon
          class=""
          :disabled="isLoading || currentPage >= totalPages - 1"
          :label="$t('common.next_page')"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>
    <app-sheet :is-elivated="false" class="!py-3 !px-2 lg:min-h-[244px]">
      <div class="grid grid-cols-1 gap-1" v-if="!isLoading">
        <div v-for="token in paginatedArray" :key="token.primaryMarket.symbol">
          <token-row :token="token" />
        </div>
      </div>
      <div class="grid grid-cols-1 gap-1 animate-pulse" v-else>
        <div
          v-for="token in 3"
          :key="`loading-trending-${token}`"
          class="basis-full bg-grey-10 flex items-end justify-between rounded-16 w-full h-[55px]"
        ></div>
      </div>
    </app-sheet>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSheet from '@/components/AppSheet.vue'
import TokenRow from './components/TokenRow.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { usePaginate } from '@/composables/usePaginate'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'

const stocksStore = useStocksStore()
const { isLoadingOverview: isLoading, trending: trendingTokens } =
  storeToRefs(stocksStore)

/** --------------------------
 * Pagination
 --------------------------*/
const itemsPerPage = ref(4)

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate(trendingTokens, itemsPerPage)
</script>
