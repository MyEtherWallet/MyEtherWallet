<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  TITLE_SIZE_CLASS,
  DESCRIPTION_SIZE_CLASS,
  TITLE_WEIGHT_CLASS,
  type ContentGroupAlign,
  type ContentGroupSize,
} from './types'

/**
 * Content Group (design library, MEW-2271). A shared title + description pair
 * reused inside Pickers, Cells, rows, cards, Toasts and Modal headers — building
 * it once lets those compose it instead of re-implementing the layout.
 *
 * Colours use the current-system tokens (title `t-default`, description subtle
 * `info`); dark surfaces override the text colour via a wrapper/utility class on
 * the consumer side (e.g. a Toast passing `text-white`). The `inverted` prop
 * swaps only the *weights*, not the colour.
 */
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: ContentGroupSize
    align?: ContentGroupAlign
    /** Swaps emphasis: title becomes regular, description becomes semibold. */
    inverted?: boolean
    loading?: boolean
    /** Force a single-line, ellipsised description (defaults to wrapping). */
    noWrap?: boolean
  }>(),
  {
    size: 'm',
    align: 'left',
    inverted: false,
    loading: false,
    noWrap: false,
  },
)

const slots = useSlots()
const hasDescription = computed(() => props.description !== undefined)

const alignClass = computed(() =>
  props.align === 'right' ? 'items-end text-right' : 'items-start text-left',
)

const titleClass = computed(() => [
  TITLE_SIZE_CLASS[props.size],
  props.inverted ? 'font-normal' : TITLE_WEIGHT_CLASS[props.size],
])

const descriptionClass = computed(() => [
  DESCRIPTION_SIZE_CLASS[props.size],
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
        <div class="h-3 w-[35px] rounded-[4px] bg-grey-10 animate-pulse"></div>
      </div>
      <div v-if="hasDescription" class="py-[5px]">
        <div class="h-3 w-[79px] rounded-[4px] bg-grey-10 animate-pulse"></div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center gap-1 min-w-0">
        <span
          v-if="slots['title-icon']"
          class="w-[18px] h-[18px] shrink-0 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
        >
          <slot name="title-icon" />
        </span>
        <span
          data-testid="cg-title"
          class="truncate text-t-default"
          :class="titleClass"
        >
          {{ title }}
        </span>
      </div>

      <div v-if="hasDescription" class="flex items-center gap-1 min-w-0">
        <span
          v-if="slots['description-icon']"
          class="w-[18px] h-[18px] shrink-0 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
        >
          <slot name="description-icon" />
        </span>
        <span
          data-testid="cg-description"
          class="text-info"
          :class="descriptionClass"
        >
          {{ description }}
        </span>
      </div>
    </template>
  </div>
</template>
