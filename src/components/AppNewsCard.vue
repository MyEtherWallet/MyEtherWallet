<script setup lang="ts">
defineProps<{
  title: string
  source?: string
  thumbnail?: string
  timestamp?: string | number
  href?: string
}>()
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
    <div v-if="source" class="mt-1 text-xs opacity-60">{{ source }}</div>
  </a>
</template>
