<template>
  <div class="max-h-[482px]">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">{{ $t('stocks.recent_news') }}</h2>

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
    <app-sheet :is-elivated="false" class="!px-4 !py-4 lg:min-h-[258px] flex">
      <div v-if="!isLoading" class="flex flex-col gap-4 justify-center h-full">
        <a
          :href="article.articleUrl"
          target="_blank"
          rel="noopener noreferrer"
          v-for="(article, index) in paginatedArray"
          :key="`news-article-${index}-${article.title}`"
          class="flex gap-4 overflow-hidden hover:underline"
        >
          <img
            :src="article.thumbnailUrl"
            :alt="$t('stocks.article_image')"
            class="flex-none w-[64px] h-[64px] object-cover rounded-12"
          />
          <div class="flex flex-col gap-1 w-full h-full justify-between">
            <p class="text-s-14 line-clamp-2">
              {{ article.title }}
            </p>
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-s-11 text-info">
                {{
                  article.timestamp
                    ? new Date(article.timestamp).toLocaleDateString()
                    : ''
                }}
              </p>
              <span
v-for="ticker in article.tickers || []"
                :key="ticker"
                class="text-s-9 font-semibold tracking-sp-06 uppercase text-info bg-mewBg px-2 py-[1px] rounded"
              >
                {{ ticker }}
              </span>
            </div>
          </div>
        </a>
      </div>
      <div v-else class="flex flex-col gap-4 w-full">
        <div
          v-for="token in 3"
          :key="`loading-trending-${token}`"
          class="bg-grey-10 flex items-end justify-between rounded-16 w-full h-[60px]"
        ></div>
      </div>
    </app-sheet>
  </div>
</template>

<script setup lang="ts">
import AppSheet from '@components/AppSheet.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { usePaginate } from '@/composables/usePaginate'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'
const stocksStore = useStocksStore()
const { isLoadingOverview: isLoading, recentNews } = storeToRefs(stocksStore)

/** --------------------------
 * Pagination
 --------------------------*/
const itemsPerPage = ref(3)

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate(recentNews, itemsPerPage)
</script>
