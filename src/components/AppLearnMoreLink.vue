<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-bgMuted text-black font-medium text-s-14 transition-opacity hover:opacity-90"
  >
    {{ label }}
    <AppIcon
      name="arrow-top-right-on-square"
      variant="filled"
      size="xxs"
      class="shrink-0"
    />
  </a>
</template>

<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'

defineProps<{
  href: string
  /** Passed in rather than translated here — callers own their i18n namespace. */
  label: string
}>()
</script>
