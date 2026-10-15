<template>
  <div
    :class="[
      'flex gap-4',
      isVertical
        ? 'flex-col items-stretch [&>*]:w-full [&>*]:shrink-0'
        : 'items-center justify-end [&>*]:flex-1 [&>*]:min-w-0',
      { 'p-4': hasPadding },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * AppBtnGroup — visual grouping of related actions.
 *
 * Implements the design-library Button Group (Figma node 1771:11996). It is a
 * layout container only: pass AppBaseButtons through the default slot and the
 * group handles orientation, spacing and sizing.
 *
 * - `horizontal` — buttons share the width equally, aligned to the end.
 * - `vertical` — buttons stack full-width.
 *
 * The convention from the design is secondary-then-primary, so the primary
 * action lands on the right (horizontal) or bottom (vertical).
 *
 * NOTE: not to be confused with AppSegmentedControl (formerly named
 * AppBtnGroup), which is the selectable tab/segmented control.
 *
 * @example
 * <app-btn-group>
 *   <app-base-button type="secondary" surface="alternative" @click="cancel">
 *     {{ $t('common.cancel') }}
 *   </app-base-button>
 *   <app-base-button @click="confirm">{{ $t('common.confirm') }}</app-base-button>
 * </app-btn-group>
 */
import { computed, type PropType } from 'vue'

const props = defineProps({
  /**
   * @orientation - `horizontal` splits the row evenly; `vertical` stacks.
   */
  orientation: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  /**
   * @hasPadding - Figma wraps the group in 16px padding. Turn off when the
   * parent (dialog footer, card) already provides its own.
   */
  hasPadding: {
    type: Boolean,
    default: false,
  },
})

// Children are sized by the container rather than by cloning slot content, so
// any button-like element can be dropped in and still share the row (or fill
// the column) — gap and padding are both size/4 (16px) per the design.
const isVertical = computed(() => props.orientation === 'vertical')
</script>
