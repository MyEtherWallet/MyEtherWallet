<template>
  <table class="w-full table-fixed">
    <thead v-if="hasHeaders">
      <tr
        class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
      >
        <th
          v-for="(col, i) in columns"
          :key="i"
          class="px-1 py-2 font-bold"
          :class="[
            col.hidden,
            col.align === 'right'
              ? 'text-right'
              : col.align === 'center'
                ? 'text-center'
                : 'text-left',
            i === 0 ? 'sm:pl-4' : '',
            i === columns.length - 1 ? 'sm:pr-4' : '',
          ]"
          :style="col.width ? { width: col.width } : {}"
        >
          {{ col.header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row">
        <td
          :colspan="columns.length || 1"
          class="px-1 sm:px-4 py-2"
        >
          <div class="h-10 bg-grey-10 animate-pulse rounded-12"></div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface SkeletonColumn {
  /** Text alignment */
  align?: 'left' | 'right' | 'center'
  /** Fixed width (CSS value, e.g. '40px', '200px') */
  width?: string
  /** Responsive visibility classes (e.g. 'hidden md:table-cell') */
  hidden?: string
  /** Header label — renders a <thead> row when at least one column has this */
  header?: string
}

const props = withDefaults(
  defineProps<{
    /** Number of skeleton rows to display */
    rows?: number
    /** Column configuration array */
    columns?: SkeletonColumn[]
  }>(),
  {
    rows: 5,
    columns: () => [{ header: '' }, { header: '' }, { header: '' }],
  },
)

const hasHeaders = computed(() => props.columns.some(c => c.header))
</script>
