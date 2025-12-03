<template>
  <div class="max-h-[482px]">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">Recent News</h2>

      <div class="flex">
        <app-btn-icon
          class=""
          :disabled="isLoading || currentPage === 1"
          label="previous page"
          @click="prevPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>
        <app-btn-icon
          class=""
          :disabled="isLoading || currentPage >= totalPages"
          label="next page"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>
    <app-sheet :is-elivated="false" class="!px-4 !py-3 lg:min-h-[244px] flex">
      <div class="flex flex-col gap-2 lg:gap-4 justify-center h-full">
        <a
          :href="article.article_url"
          target="_blank"
          rel="noopener noreferrer"
          v-for="(article, index) in paginatedArray"
          :key="`news-article-${index}-${article.title}`"
          class="flex gap-4 overflow-hidden hover:underline"
        >
          <img
            :src="article.image_url"
            alt="Article Image"
            class="flex-none w-10 h-10 lg:w-[60px] lg:h-[60px] object-cover rounded-8"
          />
          <div class="flex flex-col gap-1 w-full">
            <a
              class="text-s-14 max-h-[21px] lg:max-h-[42px] text-ellipsis overflow-hidden"
            >
              {{ article.title }}
            </a>
            <p class="text-s-11 text-info">
              {{ new Date(article.published_utc).toLocaleDateString() }}
            </p>
          </div>
        </a>
      </div>
    </app-sheet>
  </div>
</template>

<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { usePaginate } from '@/composables/usePaginate'
const isLoading = ref(false)

const tempData = Array(10).fill({
  article_url:
    'https://uk.investing.com/news/stock-market-news/markets-are-underestimating-fed-cuts-ubs-3559968',
  description:
    'UBS analysts warn that markets are underestimating the extent of future interest rate cuts by the Federal Reserve, as the weakening economy is likely to justify more cuts than currently anticipated.',
  image_url: 'https://i-invdn-com.investing.com/news/LYNXNPEC4I0AL_L.jpg',
  keywords: ['Federal Reserve', 'interest rates', 'economic data'],
  published_utc: '2024-06-24T18:33:53Z',
  tickers: ['UBS'],
  title:
    'Markets are underestimating Fed cuts: UBS By Investing.com - Investing.com UK',
})

/** --------------------------
 * Pagination
 --------------------------*/
const itemsPerPage = ref(3)

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate(tempData, itemsPerPage)
</script>
