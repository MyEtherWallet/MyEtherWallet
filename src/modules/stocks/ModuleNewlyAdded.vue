<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">Newly Added</h2>

      <div class="flex">
        <app-btn-icon
          class=""
          :disabled="isLoading || currentPage === 0"
          label="previous page"
          @click="prevPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>
        <app-btn-icon
          class=""
          :disabled="isLoading || currentPage >= totalPages - 1"
          label="next page"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-2" v-if="!isLoading">
      <div v-for="token in paginatedArray" :key="token.symbol">
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
import { ref } from 'vue'
import { usePaginate } from '@/composables/usePaginate'
import TokenRow from './components/TokenRow.vue'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'

const stocksStore = useStocksStore()
const { isLoadingOverview: isLoading, newlyAdded: newlyAddedTokens } =
  storeToRefs(stocksStore)

/** --------------------------
 * Pagination
 --------------------------*/
const itemsPerPage = ref(4)

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate(newlyAddedTokens, itemsPerPage)
</script>
