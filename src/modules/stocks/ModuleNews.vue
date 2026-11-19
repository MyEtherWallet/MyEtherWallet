<template>
  <div class="max-h-[482px]">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">{{ $t('stocks.recent_news') }}</h2>

      <div class="flex">
        <app-btn-icon
          :disabled="isLoading || currentPage === 0"
          :label="$t('common.previous_page')"
          @click="prevPage"
        >
          <AppIcon name="chevron-left" size="xxs" variant="filled" />
        </app-btn-icon>
        <app-btn-icon
          :disabled="isLoading || currentPage >= totalPages - 1"
          :label="$t('common.next_page')"
          @click="nextPage"
        >
          <AppIcon name="chevron-right" size="xxs" variant="filled" />
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
          class="group flex gap-4 overflow-hidden"
        >
          <img
            :src="article.thumbnailUrl"
            :alt="$t('stocks.article_image')"
            class="flex-none w-16 h-16 object-cover rounded-12"
          />
          <div class="flex flex-col gap-1 w-full h-full justify-between">
            <p class="text-s-14 line-clamp-2 group-hover:underline">
              {{ article.title }}
            </p>
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-s-11 text-text-subtle">
                {{
                  article.timestamp
                    ? new Date(article.timestamp).toLocaleDateString()
                    : ''
                }}
              </p>
              <!-- Max 4 tags, so an article with many tickers doesn't make
                   this card taller than Newly Added / Trending next to it. -->
              <AppTag
                v-for="ticker in article.tickers?.slice(0, 4) ?? []"
                :key="ticker"
                variant="subtle"
                class="text-[10px]/[12px]!"
                :label="ticker"
              />
            </div>
          </div>
        </a>
      </div>
      <div v-else class="flex flex-col gap-4 w-full">
        <div
          v-for="token in 3"
          :key="`loading-trending-${token}`"
          class="bg-background-default-hover flex items-end justify-between rounded-16 w-full h-[60px]"
        ></div>
      </div>
    </app-sheet>
  </div>
</template>

<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppTag from '@/components/tag/AppTag.vue'
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
