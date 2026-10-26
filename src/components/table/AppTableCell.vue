<script setup lang="ts">
import { computed, inject } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { formatChange, trendOf, type Trend } from '@/components/cell/cellSizes'
import { TABLE_CONTEXT, defaultTableContext } from './types'

/**
 * Table cell (design library, Figma `_TableCell` 2801:35945). Type Number is
 * `value` with an optional `change` line; the Trend types are `change` with a
 * 56×16 sparkline drawn from `series`. The default slot takes anything else.
 *
 * `column` ties the cell to a TableColumn key so it drops out at size S with
 * its header. Give every data cell one: a cell without it always renders and
 * pushes the row off the header's tracks.
 */
const props = defineProps<{
  column?: string
  value?: string
  change?: number
  series?: number[]
}>()

const { size, visibleKeys } = inject(TABLE_CONTEXT, defaultTableContext, true)

const TREND_CLASS: Record<Trend, string> = {
  up: 'text-text-success',
  down: 'text-text-error',
  neutral: 'text-text-disabled',
}

const visible = computed(
  () => !props.column || visibleKeys.value.includes(props.column),
)
const trend = computed(() => trendOf(props.change ?? 0))

// Figma Chart box. The line keeps 1px clear of the edges so the 1.5 stroke
// isn't clipped; a flat series sits at mid-height.
const SPARK_W = 56
const SPARK_H = 16
const points = computed(() => {
  const series = props.series ?? []
  const min = Math.min(...series)
  const span = Math.max(...series) - min
  const step = series.length > 1 ? SPARK_W / (series.length - 1) : 0
  return series
    .map((v, i) => {
      const y = span
        ? SPARK_H - 1 - ((v - min) / span) * (SPARK_H - 2)
        : SPARK_H / 2
      return `${(i * step).toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
})
</script>

<template>
  <div
    v-if="visible"
    role="cell"
    :class="[
      'flex h-11 min-w-0 flex-col justify-center',
      size === 's' ? 'items-end text-right' : 'items-start',
    ]"
  >
    <slot>
      <p
        v-if="value !== undefined && !series"
        class="max-w-full truncate text-label-base text-text-default"
      >
        {{ value }}
      </p>
      <p
        v-if="change !== undefined"
        data-test="table-cell-trend"
        :class="[
          'flex items-center whitespace-nowrap text-label-xs',
          TREND_CLASS[trend],
        ]"
      >
        {{ formatChange(change) }}
        <AppIcon
          v-if="trend !== 'neutral'"
          :name="trend === 'up' ? 'arrow-small-up' : 'arrow-small-down'"
          size="xxs"
        />
      </p>
      <svg
        v-if="series"
        data-test="table-cell-sparkline"
        :viewBox="`0 0 ${SPARK_W} ${SPARK_H}`"
        :class="['h-4 w-14', TREND_CLASS[trend]]"
        fill="none"
        aria-hidden="true"
      >
        <polyline
          :points="points"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </slot>
  </div>
</template>
