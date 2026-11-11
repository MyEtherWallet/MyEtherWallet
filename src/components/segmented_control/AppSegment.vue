<script setup lang="ts">
import AppIcon from '@components/icon/AppIcon.vue'
import type { IconName } from '@components/icon/icons'
import {
  SEGMENT_SIZE,
  SEGMENT_TONE_CLASS,
  type SegmentSize,
  type SegmentTone,
} from './types'

/**
 * Segment (Figma: MEW Web App — Design Library › Segment / _Base, 274:2783).
 * One option of an AppSegmentedControl, rendered as a radio button. `selected`
 * comes from the control; hover is CSS, never a prop. A leading avatar goes in
 * the `avatar` slot, which receives the AppAvatar size for this segment size.
 */
withDefaults(
  defineProps<{
    label?: string
    selected?: boolean
    size?: SegmentSize
    trailingIcon?: IconName
    tone?: SegmentTone
  }>(),
  {
    label: undefined,
    selected: false,
    size: 'default',
    trailingIcon: undefined,
    tone: undefined,
  },
)
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="selected"
    data-testid="segment"
    class="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-3xl text-label-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
    :class="[
      SEGMENT_SIZE[size].box,
      // Text colour sits here too: a tone's inverted text can't share a
      // static text-text-default (Tailwind order would pick the winner).
      selected && tone
        ? SEGMENT_TONE_CLASS[tone]
        : [
            'text-text-default',
            selected ? 'bg-background-alternative' : SEGMENT_SIZE[size].hover,
          ],
    ]"
  >
    <slot name="avatar" :size="SEGMENT_SIZE[size].avatar" />
    <span class="px-1.5">
      <slot>{{ label }}</slot>
    </span>
    <AppIcon v-if="trailingIcon" :name="trailingIcon" size="s" />
  </button>
</template>
