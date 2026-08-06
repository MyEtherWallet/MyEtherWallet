<script setup lang="ts">
// Connected-account indicator (Figma "Connected indicator"): a centered dot in
// a square slot so it aligns with the watch-only eye icon. Shared by the header
// pill, saved-address rows (sm: 6px dot / 12px slot) and the active card
// (md: 8px dot / 16px slot).
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'sm' })
</script>

<template>
  <span
    class="flex items-center justify-center flex-shrink-0"
    :class="size === 'md' ? 'w-4 h-4' : 'w-3 h-3'"
    aria-hidden="true"
  >
    <span
      class="rounded-full bg-[#05c0a5]"
      :class="size === 'md' ? 'w-2 h-2' : 'w-1.5 h-1.5'"
    />
  </span>
</template>
