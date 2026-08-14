<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStocksStore } from '@/stores/stocksStore'
import AppNewsCard from '@/components/AppNewsCard.vue'
import AppPagination from '@/components/AppPagination.vue'

const PER_PAGE = 6

const { t, locale } = useI18n()
const stocksStore = useStocksStore()
const page = ref(1)

const total = computed(() => stocksStore.recentNews.length)
const pageItems = computed(() =>
  stocksStore.recentNews.slice(
    (page.value - 1) * PER_PAGE,
    page.value * PER_PAGE,
  ),
)

// recentNews carries no source field — derive a readable publisher name from
// the article host (e.g. "www.reuters.com" -> "Reuters").
const sourceFromUrl = (url?: string): string => {
  if (!url) return ''
  try {
    const name = new URL(url).hostname.replace(/^www\./, '').split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return ''
  }
}

// Relative label per the design: Today / Yesterday / N days ago, then an
// absolute date once an article is a week or older.
const DAY = 86400000
const dateLabel = (ts?: number): string => {
  if (!ts) return ''
  const days = Math.floor((Date.now() - ts) / DAY)
  if (days <= 0) return t('homePage.news.today')
  if (days === 1) return t('homePage.news.yesterday')
  if (days < 7) return t('homePage.news.daysAgo', { n: days })
  return new Date(ts).toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// recentNews doesn't type a `description` yet; read it optimistically so the
// card fills in as soon as the BE starts returning it. Until then, fall back to
// a useful placeholder that points the reader to the source article.
const newsDescription = (item: {
  description?: string
  articleUrl?: string
}): string => {
  if (item.description) return item.description
  const source = sourceFromUrl(item.articleUrl)
  return source
    ? t('homePage.news.readOnSource', { source })
    : t('homePage.news.readMore')
}
</script>

<template>
  <div>
    <p
      v-if="total === 0"
      data-test="news-empty"
      class="text-s-16 text-[#575757]"
    >
      {{ t('homePage.news.empty') }}
    </p>
    <template v-else>
      <div class="@container">
        <div
          class="grid grid-cols-1 gap-6 @min-[624px]:grid-cols-2 @min-[1136px]:grid-cols-3"
        >
          <AppNewsCard
            v-for="n in pageItems"
            :key="n.articleUrl"
            :title="n.title ?? ''"
            :source="sourceFromUrl(n.articleUrl)"
            :date="dateLabel(n.timestamp)"
            :description="newsDescription(n)"
            :ticker="n.tickers?.[0]"
            :href="n.articleUrl"
          />
        </div>
      </div>
      <AppPagination
        v-if="total > PER_PAGE"
        v-model="page"
        :total="total"
        :per-page="PER_PAGE"
        class="mt-6"
      >
        <template #label="{ page: p, pages }">
          {{ t('homePage.news.pagination', { page: p, total: pages }) }}
        </template>
      </AppPagination>
    </template>
  </div>
</template>
