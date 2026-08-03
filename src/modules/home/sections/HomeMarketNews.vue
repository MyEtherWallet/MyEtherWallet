<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStocksStore } from '@/stores/stocksStore'
import AppNewsCard from '@/components/AppNewsCard.vue'
import AppPagination from '@/components/AppPagination.vue'

const PER_PAGE = 6

const { t } = useI18n()
const stocksStore = useStocksStore()
const page = ref(1)

const total = computed(() => stocksStore.recentNews.length)
const pageItems = computed(() =>
  stocksStore.recentNews.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE),
)
</script>

<template>
  <div>
    <p
      v-if="total === 0"
      data-test="news-empty"
      class="text-sm opacity-70"
    >
      {{ t('homePage.news.empty') }}
    </p>
    <template v-else>
      <div class="grid gap-6 md:grid-cols-3">
        <AppNewsCard
          v-for="n in pageItems"
          :key="n.articleUrl"
          :title="n.title ?? ''"
          :thumbnail="n.thumbnailUrl"
          :timestamp="n.timestamp"
          :href="n.articleUrl"
        />
      </div>
      <AppPagination
        v-if="total > PER_PAGE"
        v-model="page"
        :total="total"
        :per-page="PER_PAGE"
        class="mt-6"
      />
    </template>
  </div>
</template>
