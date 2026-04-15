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
            col.align === 'right' ? 'text-right' : 'text-left',
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
      <tr v-for="row in rows" :key="row" class="h-14">
        <td
          v-for="(col, i) in columns"
          :key="i"
          class="px-1 py-3"
          :class="[
            col.hidden,
            col.align === 'right' ? 'text-right' : 'text-left',
            i === 0 ? 'sm:pl-4 rounded-l-12' : '',
            i === columns.length - 1 ? 'sm:pr-4 rounded-r-12' : '',
            col.class,
          ]"
          :style="col.width ? { width: col.width } : {}"
        >
          <!-- Icon + text (name column) -->
          <div v-if="col.type === 'name'" class="flex items-center gap-3">
            <div
              class="size-8 rounded-full bg-grey-10 animate-pulse shrink-0"
            ></div>
            <div class="flex flex-col gap-1.5 min-w-0">
              <div
                class="h-3.5 bg-grey-10 animate-pulse rounded-full"
                :style="{ width: nameWidth(row) }"
              ></div>
              <div
                class="h-2.5 w-12 bg-grey-10 animate-pulse rounded-full"
              ></div>
            </div>
          </div>

          <!-- Plain text bar -->
          <div
            v-else-if="!col.type || col.type === 'text'"
            class="animate-pulse rounded-full bg-grey-10 h-3.5"
            :class="col.align === 'right' ? 'ml-auto' : ''"
            :style="{ width: textWidth(row, i) }"
          ></div>

          <!-- Chart / sparkline area -->
          <div
            v-else-if="col.type === 'chart'"
            class="flex flex-col items-end gap-1.5"
          >
            <div
              class="h-3 w-10 bg-grey-10 animate-pulse rounded-full"
            ></div>
            <div
              class="h-6 w-[70px] bg-grey-10 animate-pulse rounded"
            ></div>
          </div>

          <!-- Button pair (Long / Short) -->
          <div
            v-else-if="col.type === 'buttons'"
            class="flex gap-2 justify-end"
          >
            <div
              class="h-8 w-16 bg-grey-10 animate-pulse rounded-full"
            ></div>
            <div
              class="h-8 w-16 bg-grey-10 animate-pulse rounded-full"
            ></div>
          </div>

          <!-- Single action button -->
          <div
            v-else-if="col.type === 'action'"
            class="flex justify-end"
          >
            <div
              class="h-8 w-20 bg-grey-10 animate-pulse rounded-full"
            ></div>
          </div>

          <!-- Small icon only (star, chevron) -->
          <div
            v-else-if="col.type === 'icon'"
            class="flex justify-center"
          >
            <div
              class="size-5 bg-grey-10 animate-pulse rounded-full"
            ></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface SkeletonColumn {
  /** Column type determines the placeholder shape */
  type?: 'text' | 'name' | 'chart' | 'buttons' | 'action' | 'icon'
  /** Text alignment */
  align?: 'left' | 'right' | 'center'
  /** Fixed width (CSS value, e.g. '40px', '200px') */
  width?: string
  /** Responsive visibility classes (e.g. 'hidden md:table-cell') */
  hidden?: string
  /** Additional CSS classes */
  class?: string
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
    columns: () => [
      { type: 'name' },
      { type: 'text', align: 'right' },
      { type: 'text', align: 'right' },
      { type: 'text', align: 'right' },
    ],
  },
)

const hasHeaders = computed(() => props.columns.some(c => c.header))

/** Vary name widths per row to look organic */
function nameWidth(row: number): string {
  const widths = ['72px', '56px', '64px', '80px', '48px', '60px', '68px', '52px']
  return widths[(row - 1) % widths.length]
}

/** Vary text bar widths per row+col to look organic */
function textWidth(row: number, col: number): string {
  const widths = ['48px', '56px', '40px', '64px', '52px', '44px', '60px']
  return widths[(row + col) % widths.length]
}
</script>
