<script setup lang="ts">
import AppIcon from '@components/icon/AppIcon.vue'
import type { IconName } from '@components/icon/icons'
import { SEGMENT_SIZE, type SegmentSize } from './types'

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
  }>(),
  {
    label: undefined,
    selected: false,
    size: 'default',
    trailingIcon: undefined,
  },
)
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="selected"
    data-testid="segment"
    class="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-3xl text-label-sm text-text-default transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus"
    :class="[
      SEGMENT_SIZE[size].box,
      selected ? 'bg-background-alternative' : SEGMENT_SIZE[size].hover,
    ]"
  >
    <slot name="avatar" :size="SEGMENT_SIZE[size].avatar" />
    <span class="px-1.5">
      <slot>{{ label }}</slot>
    </span>
    <AppIcon v-if="trailingIcon" :name="trailingIcon" size="s" />
  </button>
</template>
