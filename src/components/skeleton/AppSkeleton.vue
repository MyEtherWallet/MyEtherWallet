<script setup lang="ts">
import { SKELETON_SHAPE_CLASS, type SkeletonShape } from './types'

/**
 * Skeleton (design library, Figma ⚒️ Utils › Skeleton 2930:104). Loading
 * placeholder with the Figma shimmer: a translucent grey base and a brighter
 * band that slides across it (see `skeleton-shimmer` in main.css). The caller
 * sizes it (`class="h-3 w-[60px]"`), since every component that loads defines
 * its own bar sizes.
 *
 * @example <AppSkeleton class="h-3 w-[60px]" />
 * @example <AppSkeleton shape="circle" class="size-8" />
 */
withDefaults(defineProps<{ shape?: SkeletonShape }>(), {
  shape: 'rectangle',
})
</script>

<template>
  <div
    aria-hidden="true"
    data-testid="skeleton"
    :class="[
      'relative overflow-hidden bg-[var(--skeleton-base)]',
      SKELETON_SHAPE_CLASS[shape],
    ]"
  >
    <div class="skeleton-shimmer absolute inset-y-0 left-0 w-[200%]" />
  </div>
</template>
