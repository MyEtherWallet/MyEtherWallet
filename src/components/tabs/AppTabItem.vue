<script setup lang="ts">
/**
 * TabItem (Figma: MEW Web App — Design Library › TabItem / _base, node 1072:611).
 * A single selectable tab; the container owns selection, the tablist and
 * keyboard navigation. Hover is CSS only.
 *
 * @example
 * <AppTabItem label="Stocks" :selected="tab === 'stocks'" @click="tab = 'stocks'" />
 */
import { computed } from 'vue'
import type { AppTabItemProps } from './types'

const props = withDefaults(defineProps<AppTabItemProps>(), {
  label: undefined,
  selected: false,
  disabled: false,
})

// The border is always 1px (transparent at rest) so height never jumps
const stateClass = computed(() => {
  if (props.selected) return 'border-border-selected text-text-default'
  if (props.disabled)
    return 'cursor-default border-transparent text-text-disabled'
  return 'border-transparent text-text-muted hover:border-border-hover hover:text-text-default'
})
</script>

<template>
  <button
    type="button"
    role="tab"
    :aria-selected="selected"
    :disabled="disabled"
    class="flex flex-col items-center justify-center border-b px-2 pb-2 text-label-base break-words focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus"
    :class="stateClass"
    data-testid="tab-item"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
