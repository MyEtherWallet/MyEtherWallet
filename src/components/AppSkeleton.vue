<script setup lang="ts">
import { computed, type PropType } from 'vue'

/**
 * Skeleton placeholder (design library). A pulsing `background/skeleton` block
 * sized by the caller (`class="h-3 w-12"`); `shape="circle"` for avatars.
 * Same fill + animation as the inline bars in AppContentGroup and
 * AppTableSkeleton, so mixed loading states read as one surface.
 */
const props = defineProps({
  shape: {
    type: String as PropType<'bar' | 'circle'>,
    default: 'bar',
  },
})

const isCircle = computed(() => props.shape === 'circle')
</script>

<template>
  <div
    aria-hidden="true"
    class="animate-pulse bg-background-skeleton"
    :class="isCircle ? 'rounded-full' : 'rounded-[4px]'"
  />
</template>
