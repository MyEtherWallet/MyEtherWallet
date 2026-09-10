<script setup lang="ts">
import { computed } from 'vue'
import AvatarStatusDot from './AvatarStatusDot.vue'
import {
  statusBadgeBox,
  type AvatarBadgeType,
  type AvatarSize,
  type AvatarStatus,
} from './types'

// _Avatar badge (1852:356). One circle, 1px solid white border, centered content.
//   Network — white bg, no padding, logo fills the box (bottom-right).
//   Icon    — #e6e6e6 bg, 1px padding, holds a glyph (top-left).
//   Status  — a small white dot-holder (top-right); only M (8px) is design-specced.
// The parent (AppAvatar) sizes + positions this from the size table; Network /
// Icon fill their wrapper, Status renders a smaller centered dot inside it.
const props = defineProps<{
  type: AvatarBadgeType
  size: AvatarSize
  status?: AvatarStatus
}>()

const statusStyle = computed(() => {
  const box = statusBadgeBox(props.size)
  return { width: `${box}px`, height: `${box}px` }
})
</script>

<template>
  <div
    v-if="type === 'network'"
    class="w-full h-full rounded-full border border-white bg-white overflow-hidden flex items-center justify-center box-border"
  >
    <slot />
  </div>

  <div
    v-else-if="type === 'icon'"
    class="w-full h-full rounded-full border border-white bg-avatar-badge-icon-bg overflow-hidden flex items-center justify-center box-border p-px text-t-default [&_svg]:w-full [&_svg]:h-full"
  >
    <slot />
  </div>

  <div v-else class="w-full h-full flex items-center justify-center">
    <div
      class="rounded-full bg-white p-px flex items-center justify-center box-border"
      :style="statusStyle"
    >
      <AvatarStatusDot :type="status ?? 'muted'" />
    </div>
  </div>
</template>
