<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  TITLE_SIZE_CLASS,
  DESCRIPTION_SIZE_CLASS,
  TITLE_WEIGHT_CLASS,
  TONE_TITLE_CLASS,
  TONE_DESCRIPTION_CLASS,
  type ContentGroupAlign,
  type ContentGroupSize,
  type ContentGroupTone,
} from './types'

/**
 * Content Group (design library, MEW-2271). A shared title + description pair
 * reused inside Pickers, Cells, rows, cards, Toasts and Modal headers — building
 * it once lets those compose it instead of re-implementing the layout.
 *
 * Colours come from `tone`: `default` (title `t-default`, description `info`) for
 * light surfaces, `inverse` (white / white-70) for dark ones such as a Toast or
 * a dark modal header. The spans set their colour explicitly, so a wrapper's
 * `text-*` class would never reach them — use `tone` instead. The `inverted`
 * prop swaps only the *weights*, not the colour.
 */
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: ContentGroupSize
    align?: ContentGroupAlign
    /** Text colours for the surface underneath: `default` (light) or `inverse` (dark). */
    tone?: ContentGroupTone
    /** Swaps emphasis: title becomes regular, description becomes semibold. */
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
// An empty string counts as "no description": it would otherwise render a blank
// second row (and a skeleton bar while loading) plus the row gap.
const hasDescription = computed(() => !!props.description)

// Text alignment cascades to the (possibly wrapping) text and the inline-block
// skeleton bars. The rows themselves stay full-width (default stretch) so the
// title can actually clip — items-start/end would shrink them to content width.
const alignClass = computed(() =>
  props.align === 'right' ? 'text-right' : 'text-left',
)

// Positions the icon + text within a full-width row.
const rowJustifyClass = computed(() =>
  props.align === 'right' ? 'justify-end' : 'justify-start',
)

const titleClass = computed(() => [
  TITLE_SIZE_CLASS[props.size],
  TONE_TITLE_CLASS[props.tone],
  props.inverted ? 'font-normal' : TITLE_WEIGHT_CLASS[props.size],
])

const descriptionClass = computed(() => [
  DESCRIPTION_SIZE_CLASS[props.size],
  TONE_DESCRIPTION_CLASS[props.tone],
  props.inverted ? 'font-semibold' : 'font-normal',
  props.noWrap ? 'truncate' : '',
])
</script>

<template>
  <div
    data-testid="cg-root"
    class="flex flex-col gap-0.5 min-w-0"
    :class="alignClass"
  >
    <!-- Loading: skeleton bars keep line height stable (12px tall, 4px radius). -->
    <template v-if="loading">
      <div class="py-[5px]">
        <div
          class="inline-block h-3 w-[35px] rounded-[4px] bg-grey-10 animate-pulse"
        ></div>
      </div>
      <div v-if="hasDescription" class="py-[5px]">
        <div
          class="inline-block h-3 w-[79px] rounded-[4px] bg-grey-10 animate-pulse"
        ></div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center gap-1 min-w-0" :class="rowJustifyClass">
        <span
          v-if="slots['title-icon']"
          class="w-[18px] h-[18px] shrink-0 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
        >
          <slot name="title-icon" />
        </span>
        <span
          data-testid="cg-title"
          class="truncate min-w-0"
          :class="titleClass"
        >
          {{ title }}
        </span>
      </div>

      <div
        v-if="hasDescription"
        class="flex items-center gap-1 min-w-0"
        :class="rowJustifyClass"
      >
        <span
          v-if="slots['description-icon']"
          class="w-[18px] h-[18px] shrink-0 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
        >
          <slot name="description-icon" />
        </span>
        <span
          data-testid="cg-description"
          class="min-w-0"
          :class="descriptionClass"
        >
          {{ description }}
        </span>
      </div>
    </template>
  </div>
</template>
