<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-surface-strong text-fg font-medium text-s-14 transition-opacity hover:opacity-90"
  >
    {{ label }}
    <arrow-top-right-on-square-icon
      class="w-4 h-4 shrink-0"
      aria-hidden="true"
    />
  </a>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'

defineProps<{
  href: string
  /** Passed in rather than translated here — callers own their i18n namespace. */
  label: string
}>()
</script>
