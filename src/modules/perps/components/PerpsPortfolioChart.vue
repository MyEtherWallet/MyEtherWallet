<template>
  <app-sheet
    :is-elivated="false"
    sheet-class="!pt-4 !pb-2 overflow-hidden w-full h-full flex flex-col justify-end !px-4"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-x-10 mb-2 gap-y-2"
    >
      <AppSegmentedControl
        v-model="selectedRangeValue"
        :items="rangeOptions"
        size="small"
        :label="$t('common.chart_range')"
      />

      <div class="flex flex-wrap items-center gap-2">
        <AppChip
          v-for="s in seriesOptions"
          :key="s.key"
          surface="alternative"
          :label="s.label"
          :selected="activeSeries.has(s.key)"
          @click="toggleSeries(s.key)"
        >
          <template #avatar>
            <span class="flex size-6 items-center justify-center">
              <span
                class="size-4 rounded-full"
                :style="{ backgroundColor: s.color }"
              />
            </span>
          </template>
        </AppChip>
      </div>
    </div>
    <div
      v-if="graphLoading"
      class="flex-1 bg-background-default-hover rounded-xl animate-pulse mx-4 mb-2 min-h-[150px]"
    ></div>
    <HistoryChart
      v-else-if="chartPointsBalance.length > 0"
      :data="[
        activeSeries.has('value') ? chartPointsBalance : [],
        activeSeries.has('invested') ? chartPointsInvested : [],
        activeSeries.has('pnl') ? chartPointsPnl : [],
      ]"
      :dispalay-y-axis="true"
      :series-labels="tooltipLabels"
      class="h-full !shrink -mx-4"
    />
    <div v-else class="text-center py-8 text-text-subtle text-s-14">
      {{ $t('perps.portfolio.no-history') }}
    </div>
  </app-sheet>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSheet from '@/components/AppSheet.vue'
import AppSegmentedControl from '@components/segmented_control/AppSegmentedControl.vue'
import AppChip from '@components/chip/AppChip.vue'
import {
  usePerpsPortfolioGraph,
  type GraphRange,
} from '../composables/usePerpsPortfolioGraph'
import HistoryChart from '@/modules/portfolio/components/history/HistoryChart.vue'

const { t } = useI18n()
const { graphData, graphLoading, graphRange, setRange } =
  usePerpsPortfolioGraph()

type SeriesKey = 'value' | 'invested' | 'pnl'

const seriesOptions = computed<
  { key: SeriesKey; label: string; color: string }[]
>(() => [
  {
    key: 'value',
    label: t('perps.portfolio.series-value'),
    color: 'rgb(0,90,229)',
  },
  {
    key: 'invested',
    label: t('perps.portfolio.series-net-invested'),
    color: '#9d00ff',
  },
  {
    key: 'pnl',
    label: t('perps.portfolio.series-pnl'),
    color: 'rgb(5,192,165)',
  },
])

const tooltipLabels = computed(() =>
  seriesOptions.value.map(s => ({
    label: s.label,
    color: s.color,
  })),
)

const activeSeries = reactive<Set<SeriesKey>>(
  new Set(['value', 'invested', 'pnl']),
)

function toggleSeries(key: SeriesKey) {
  if (activeSeries.has(key)) {
    if (activeSeries.size > 1) activeSeries.delete(key)
  } else {
    activeSeries.add(key)
  }
}

interface RangeOption {
  label: string
  value: GraphRange
}

const rangeOptions = computed<RangeOption[]>(() => [
  { label: t('perps.portfolio.range-24h'), value: '24h' },
  { label: t('perps.portfolio.range-7d'), value: '7d' },
  { label: t('perps.portfolio.range-30d'), value: '30d' },
  { label: t('perps.portfolio.range-all'), value: 'all' },
])

const selectedRangeValue = ref<GraphRange>(
  rangeOptions.value.find(r => r.value === graphRange.value)?.value ?? '30d',
)

watch(selectedRangeValue, value => {
  setRange(value)
})

const chartPointsBalance = computed(() =>
  graphData.value.map(p => ({
    timestamp: new Date(p.time).getTime(),
    value: parseFloat(p.marginBalance),
  })),
)

const chartPointsPnl = computed(() =>
  graphData.value.map(p => ({
    timestamp: new Date(p.time).getTime(),
    value: parseFloat(p.realizedPnl),
  })),
)

const chartPointsInvested = computed(() =>
  graphData.value.map(p => ({
    timestamp: new Date(p.time).getTime(),
    value: parseFloat(p.netInvested),
  })),
)
</script>
