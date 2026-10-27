<template>
  <span
    :class="[
      'flex size-8 shrink-0 items-center justify-center rounded-full',
      ICON_CONTAINER_TONE_CLASS[tone],
    ]"
  >
    <AppIcon :name="icon" variant="filled" />
  </span>
</template>

<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconName } from '@/components/icon/icons'
import {
  ICON_CONTAINER_TONE_CLASS,
  type IconContainerTone,
} from '@/components/icon_container/types'

/**
 * Icon Container (design library `_Icon`): a 32px tinted circle holding a 24px
 * filled glyph. Decorative, since AppIcon already hides the svg; the caller
 * conveys the meaning in text.
 *
 * @example <AppIconContainer icon="check-circle" tone="success" />
 */
defineProps<{ icon: IconName; tone: IconContainerTone }>()
</script>
