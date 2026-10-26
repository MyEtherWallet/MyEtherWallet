<script setup lang="ts">
import { computed, provide, useId, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import { TABLE_WRAPPER_SIZE, tableSizeFor, type TableSize } from './types'

/**
 * Table wrapper (design library, Figma TableWrapper 2913:98036). The white
 * card around an AppTable: title, toolbar, divider, then the table (which
 * carries its own footer).
 *
 * The card measures its own width for the Figma breakpoints (L 1280+, M from
 * 768, S below) and hands the size to the AppTable inside; `size` forces one.
 * `#toolbar` holds the searchbar and dropdowns (it gets `size`, so a searchbar
 * can go full width at S); `#action` is the primary button, at the end of the
 * toolbar at L/M and next to the title at S.
 */
const props = defineProps<{
  title: string
  description?: string
  size?: TableSize
}>()

const root = useTemplateRef<HTMLElement>('root')
const { width } = useElementSize(root, undefined, { box: 'border-box' })
const size = computed<TableSize>(() => props.size ?? tableSizeFor(width.value))
provide(TABLE_WRAPPER_SIZE, size)

const titleId = useId()
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
      <AppContentGroup
        :id="titleId"
        :title="title"
        :description="description"
        size="l"
        class="flex-1"
      />
      <div v-if="size === 's' && $slots.action" class="shrink-0">
        <slot name="action" :size="size" />
      </div>
    </div>

    <div
      v-if="$slots.toolbar || (size !== 's' && $slots.action)"
      data-test="table-toolbar"
      class="flex items-center gap-2"
    >
      <div
        v-if="$slots.toolbar"
        :class="[
          'flex min-w-0 flex-1 items-center gap-2',
          { 'flex-wrap': size === 's' },
        ]"
      >
        <slot name="toolbar" :size="size" />
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
