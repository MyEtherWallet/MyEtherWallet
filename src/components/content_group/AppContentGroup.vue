<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  EMPHASIS_TEXT_CLASS,
  SUPPORTING_TEXT_CLASS,
  TONE_EMPHASIS_CLASS,
  TONE_SUPPORTING_CLASS,
  type ContentGroupAlign,
  type ContentGroupSize,
  type ContentGroupTone,
} from './types'

/**
 * Content Group (design library, MEW-2271). A shared title + description pair
 * reused inside Pickers, Cells, rows, cards, Toasts and Modal headers — building
 * it once lets those compose it instead of re-implementing the layout.
 *
 * Colours come from `tone`: `default` (emphasis `text/default`, supporting
 * `text/subtle`) for light surfaces, `inverse` (white / white-70) for dark ones
 * such as a Toast or a dark modal header. The spans set their colour
 * explicitly, so a wrapper's `text-*` class would never reach them — use
 * `tone` instead. `inverted` swaps the two line styles: the title takes the
 * supporting style and the description the emphasis one.
 *
 * The `title-icon` / `description-icon` slots trail their line (the design
 * never puts them on the left) and take an Icon and/or Avatar. Both slots pass
 * `size` ('xs', 18px) for the consumer to bind, whatever the group `size`.
 */
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: ContentGroupSize
    align?: ContentGroupAlign
    /** Text colours for the surface underneath: `default` (light) or `inverse` (dark). */
    tone?: ContentGroupTone
    /** Swaps emphasis: title gets the supporting style, description the emphasis one. */
    inverted?: boolean
    loading?: boolean
    /** Force a single-line, ellipsised description (defaults to wrapping). */
    noWrap?: boolean
  }>(),
  {
    size: 'm',
    align: 'left',
    tone: 'default',
    inverted: false,
    loading: false,
    noWrap: false,
  },
)

const slots = useSlots()
// Icon and Avatar both name their 18px size 'xs'; slots pass it as `size`.
const SLOT_SIZE = 'xs' as const
// An empty string counts as "no description": it would otherwise render a blank
// second row (and a skeleton bar while loading) plus the row gap.
const hasDescription = computed(() => !!props.description)

// Text alignment cascades to the (possibly wrapping) text and the inline-block
// skeleton bars. The rows themselves stay full-width (default stretch) so the
// title can actually clip — items-start/end would shrink them to content width.
const alignClass = computed(() =>
  props.align === 'right' ? 'text-right' : 'text-left',
)

// Positions the text + trailing icons within a full-width row.
const rowJustifyClass = computed(() =>
  props.align === 'right' ? 'justify-end' : 'justify-start',
)

const emphasisClass = computed(() => [
  EMPHASIS_TEXT_CLASS[props.size],
  TONE_EMPHASIS_CLASS[props.tone],
])

const supportingClass = computed(() => [
  SUPPORTING_TEXT_CLASS[props.size],
  TONE_SUPPORTING_CLASS[props.tone],
])

const titleClass = computed(() =>
  props.inverted ? supportingClass.value : emphasisClass.value,
)

const descriptionClass = computed(() => [
  ...(props.inverted ? emphasisClass.value : supportingClass.value),
  props.noWrap ? 'truncate' : '',
])
</script>

<template>
  <div
    data-testid="cg-root"
    class="flex flex-col min-w-0"
    :class="[alignClass, { 'gap-1': size === 'l' }]"
  >
    <!-- Loading: 12px bars (4px radius) in 22px rows, per Figma for both sizes. -->
    <template v-if="loading">
      <div class="py-[5px]">
        <div
          class="inline-block h-3 w-[35px] rounded-[4px] bg-background-skeleton animate-pulse"
        ></div>
      </div>
      <div v-if="hasDescription" class="py-[5px]">
        <div
          class="inline-block h-3 w-[79px] rounded-[4px] bg-background-skeleton animate-pulse"
        ></div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center gap-1 min-w-0" :class="rowJustifyClass">
        <span
          data-testid="cg-title"
          class="truncate min-w-0"
          :class="titleClass"
        >
          {{ title }}
        </span>
        <span
          v-if="slots['title-icon']"
          class="flex shrink-0 items-center gap-1"
        >
          <slot name="title-icon" :size="SLOT_SIZE" />
        </span>
      </div>

      <div
        v-if="hasDescription"
        class="flex items-center gap-1 min-w-0"
        :class="rowJustifyClass"
      >
        <span
          data-testid="cg-description"
          class="min-w-0"
          :class="descriptionClass"
        >
          {{ description }}
        </span>
        <span
          v-if="slots['description-icon']"
          class="flex shrink-0 items-center gap-1"
        >
          <slot name="description-icon" :size="SLOT_SIZE" />
        </span>
      </div>
    </template>
  </div>
</template>
