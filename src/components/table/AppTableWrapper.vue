<script setup lang="ts">
import { computed, provide, useId, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import {
  EMPHASIS_TEXT_CLASS,
  SUPPORTING_TEXT_CLASS,
  TONE_EMPHASIS_CLASS,
  TONE_SUPPORTING_CLASS,
} from '@/components/content_group/types'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'
import { TABLE_WRAPPER, tableSizeFor, type TableSize } from './types'

/**
 * Table wrapper (design library, Figma TableWrapper 2913:98036). The white
 * card around an AppTable: title, toolbar, divider, then the table (which
 * carries its own footer).
 *
 * The card measures its own width for the Figma breakpoints (L 1280+, M from
 * 768, S below) and hands the size to the AppTable inside; `size` forces one.
 * Toolbar: `v-model:search` shows the searchbar first (240px, full width at
 * S; `searchPlaceholder` sets its text), then `#filters` (it gets `size`) for
 * the dropdowns and filter buttons beside it; `#action` is the primary button,
 * at the end of the toolbar at L/M and next to the title at S.
 *
 * The title is a real heading (`titleTag`, h2 by default; h1 when the card is
 * the page's main content) styled as Content Group L, and names both the card
 * and the table inside it.
 */
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: TableSize
    titleTag?: 'h1' | 'h2' | 'h3'
    searchPlaceholder?: string
  }>(),
  { titleTag: 'h2' },
)
/** Bind it to show the searchbar. */
const search = defineModel<string>('search')

const root = useTemplateRef<HTMLElement>('root')
const { width } = useElementSize(root, undefined, { box: 'border-box' })
const size = computed<TableSize>(() => props.size ?? tableSizeFor(width.value))
const titleId = useId()
provide(TABLE_WRAPPER, { size, titleId })
</script>

<template>
  <section
    ref="root"
    :aria-labelledby="titleId"
    :class="[
      'flex w-full flex-col gap-6 rounded-16 bg-background-alternative',
      size === 's' ? 'p-4' : 'p-6',
    ]"
  >
    <div data-test="table-heading" class="flex items-center gap-6">
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <component
          :is="titleTag"
          :id="titleId"
          :class="[EMPHASIS_TEXT_CLASS.l, TONE_EMPHASIS_CLASS.default]"
        >
          {{ title }}
        </component>
        <p
          v-if="description"
          :class="[SUPPORTING_TEXT_CLASS.l, TONE_SUPPORTING_CLASS.default]"
        >
          {{ description }}
        </p>
      </div>
      <div v-if="size === 's' && $slots.action" class="shrink-0">
        <slot name="action" :size="size" />
      </div>
    </div>

    <div
      v-if="
        search !== undefined ||
        $slots.filters ||
        (size !== 's' && $slots.action)
      "
      data-test="table-toolbar"
      class="flex items-center gap-2"
    >
      <div
        v-if="search !== undefined || $slots.filters"
        :class="[
          'flex min-w-0 flex-1 items-center gap-2',
          { 'flex-wrap': size === 's' },
        ]"
      >
        <AppSearchbar
          v-if="search !== undefined"
          v-model="search"
          variant="default"
          :placeholder="searchPlaceholder"
          :class="['shrink-0', size === 's' ? 'w-full' : 'w-60']"
        />
        <slot name="filters" :size="size" />
      </div>
      <div v-if="size !== 's' && $slots.action" class="ml-auto shrink-0">
        <slot name="action" :size="size" />
      </div>
    </div>

    <!-- The divider is an 8px slot: pull it in so the line sits 24 from both sides. -->
    <AppDivider class="-my-1" />

    <slot :size="size" />
  </section>
</template>
