<template>
  <svg
    :class="[sizeClass, 'animate-spin shrink-0']"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="9"
      cy="9"
      r="7.6"
      stroke="currentColor"
      stroke-opacity="0.2"
      stroke-width="2.8"
    />
    <path
      d="M16.6 9A7.6 7.6 0 0 0 9 1.4"
      stroke="currentColor"
      stroke-width="2.8"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    sizeClass?: string
  }>(),
  {
    sizeClass: 'w-[18px] h-[18px]',
  },
)
</script>
