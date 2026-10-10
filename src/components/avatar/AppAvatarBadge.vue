<script setup lang="ts">
import AvatarStatusDot from './AvatarStatusDot.vue'
import {
  STATUS_BADGE_BOX,
  type AvatarBadgeTone,
  type AvatarBadgeType,
  type AvatarStatus,
} from './types'

// _Avatar badge (1852:356). One circle, 1px solid white border, centered content.
//   Network — white bg, no padding, logo fills the box (bottom-right).
//   Icon    — grey bg (contrast: dark bg) 1px padding, holds a glyph (top-left).
//   Status  — a fixed 10px white dot-holder (top-right), same at every size.
// The parent (AppAvatar) sizes + positions the wrapper from the size table;
// Network / Icon fill it, Status renders its fixed 10px dot centered inside.
withDefaults(
  defineProps<{
    type: AvatarBadgeType
    status?: AvatarStatus
    tone?: AvatarBadgeTone
  }>(),
  { tone: 'default' },
)

// Icon badge fill per tone, semantic tokens only. `contrast` is the Cell's
// selected check (Figma background/contrast-default with text/inverted).
const ICON_TONE_CLASS: Record<AvatarBadgeTone, string> = {
  default: 'bg-background-default-hover text-text-default',
  contrast: 'bg-background-contrast-default text-text-inverted',
}

const statusStyle = {
  width: `${STATUS_BADGE_BOX}px`,
  height: `${STATUS_BADGE_BOX}px`,
}
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
    class="w-full h-full rounded-full border border-white overflow-hidden flex items-center justify-center box-border p-px [&_svg]:w-full [&_svg]:h-full"
    :class="ICON_TONE_CLASS[tone]"
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
