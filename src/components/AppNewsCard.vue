<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  source?: string
  thumbnail?: string
  timestamp?: string | number
  href?: string
}>()

// Matches the guard/format pattern in src/modules/stocks/ModuleNews.vue for
// the same StockNewsItem.timestamp field.
const formattedDate = computed(() =>
  props.timestamp ? new Date(props.timestamp).toLocaleDateString() : '',
)
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    data-test="news-card"
    class="block rounded-2xl p-4 hover:bg-black/5"
  >
    <img
      v-if="thumbnail"
      :src="thumbnail"
      alt=""
      class="mb-3 h-40 w-full rounded-lg object-cover"
    />
    <div data-test="news-title" class="font-semibold">{{ title }}</div>
    <div class="mt-1 flex items-center gap-2 text-xs opacity-60">
      <span v-if="source">{{ source }}</span>
      <span v-if="formattedDate" data-test="news-date">{{ formattedDate }}</span>
    </div>
  </a>
</template>
