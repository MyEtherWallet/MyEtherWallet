<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'
import TableSparkline from '@/components/TableSparkline.vue'
import type { CellRightAccessory } from '@/components/cell/cellSizes'
import { formatPercentageValue } from '@/utils/numberFormatHelper'

/**
 * Cell right accessory (design library, MEW-2445). Internal to AppCell, which
 * renders it from its `rightAccessory` prop; not meant for direct use. Figma:
 * Cell › `_right accesory / _base`, component set 1058:908.
 */
const props = defineProps<{ accessory: CellRightAccessory }>()

type Trend = 'up' | 'down' | 'neutral'

const TREND_CLASS: Record<Trend, string> = {
  up: 'text-text-success',
  down: 'text-text-error',
  neutral: 'text-text-subtle',
}

const trendOf = (n: number): Trend =>
  n > 0 ? 'up' : n < 0 ? 'down' : 'neutral'

const change = computed(() =>
  'change' in props.accessory ? props.accessory.change : 0,
)
const trend = computed(() => trendOf(change.value))

const changeText = computed(() => {
  // The shared formatter returns a bare '0' here; Figma wants 0.00%.
  if (trend.value === 'neutral') return '0.00%'
  // The formatter keeps the sign, bounds included ('> -0.01%', '< -1000%');
  // Figma wants the U+2212 minus.
  const value = formatPercentageValue(change.value).value.replace('-', '−')
  // A '+' in front of a bound would read '+< 0.01%'.
  return trend.value === 'up' && !/^[<>]/.test(value) ? `+${value}` : value
})

// TableSparkline picks its colour from the sign of percentChange.
const graphChange = computed(() => {
  const { accessory } = props
  if (accessory.kind !== 'graph') return 0
  if (accessory.trend) return accessory.trend === 'up' ? 1 : -1
  const { points } = accessory
  return points.length ? points[points.length - 1] - points[0] : 0
})
</script>

<template>
  <div
    class="flex min-h-10 shrink-0 flex-col items-end justify-center whitespace-nowrap text-right"
  >
    <template v-if="accessory.kind === 'balance'">
      <p class="text-label-base text-text-default">{{ accessory.primary }}</p>
      <p v-if="accessory.secondary" class="text-text-sm text-text-subtle">
        {{ accessory.secondary }}
      </p>
    </template>

    <template v-else-if="accessory.kind === 'balance-performance'">
      <p class="text-label-base text-text-default">{{ accessory.primary }}</p>
      <p :class="['text-text-sm', TREND_CLASS[trend]]">{{ changeText }}</p>
    </template>

    <div
      v-else-if="accessory.kind === 'performance'"
      data-test="cell-accessory-performance"
      :class="['flex items-center gap-1 text-label-base', TREND_CLASS[trend]]"
    >
      <AppIcon
        v-if="trend !== 'neutral'"
        :name="trend === 'up' ? 'arrow-small-up' : 'arrow-small-down'"
        size="s"
      />
      <span>{{ changeText }}</span>
    </div>

    <TableSparkline
      v-else-if="accessory.kind === 'graph'"
      :points="accessory.points"
      :width="64"
      :height="24"
      :percent-change="graphChange"
      aria-hidden="true"
    />

    <span
      v-else-if="accessory.kind === 'icon'"
      data-test="cell-accessory-icon"
      class="flex size-8 items-center justify-center"
      aria-hidden="true"
    >
      <AppIcon
        :name="accessory.icon"
        size="m"
        variant="filled"
        class="text-icon-default"
      />
    </span>

    <div v-else class="flex flex-col items-end gap-2.5">
      <AppSkeleton class="h-3 w-12" />
      <AppSkeleton class="h-3 w-20" />
    </div>
  </div>
</template>
