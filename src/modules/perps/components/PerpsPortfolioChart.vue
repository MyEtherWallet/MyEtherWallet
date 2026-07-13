<template>
  <app-sheet
    :is-elivated="false"
    sheet-class="!pt-4 !pb-2 overflow-hidden w-full h-full flex flex-col justify-end !px-4"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-x-10 mb-2 gap-y-2"
    >
      <app-btn-group
        v-model:selected="selectedRange"
        :disabled="graphLoading"
        :btn-list="rangeOptions"
        size="xs"
        :has-full-width="isDesktopAndUp"
      >
        <template #btn-content="{ data }">
          {{ data.label }}
        </template>
      </app-btn-group>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="s in seriesOptions"
          :key="s.key"
          class="flex p items-center gap-1.5 rounded-full px-4 py-1.5 text-s-11 xs:text-s-12 font-medium transition-colors hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
          :class="activeSeries.has(s.key) ? 'bg-mewBg ' : 'bg-white'"
          @click="toggleSeries(s.key)"
        >
          <span
            class="inline-block size-4 rounded-full"
            :style="{ backgroundColor: s.color }"
          >
          </span>
          {{ s.label }}
        </button>
      </div>
    </div>
    <div
      v-if="graphLoading"
      class="flex-1 bg-grey-10 rounded-xl animate-pulse mx-4 mb-2 min-h-[150px]"
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
    <div v-else class="text-center py-8 text-info text-s-14">
      No portfolio history available
    </div>
  </app-sheet>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import AppSheet from '@/components/AppSheet.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import {
  usePerpsPortfolioGraph,
  type GraphRange,
} from '../composables/usePerpsPortfolioGraph'
import HistoryChart from '@/modules/portfolio/components/history/HistoryChart.vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const { isDesktopAndUp } = useAppBreakpoints()
const { graphData, graphLoading, graphRange, setRange } =
  usePerpsPortfolioGraph()

type SeriesKey = 'value' | 'invested' | 'pnl'

const seriesOptions: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'value', label: 'Value', color: 'rgb(0,90,229)' },
  { key: 'invested', label: 'Net Invested', color: '#9D00FF' },
  { key: 'pnl', label: 'PnL', color: 'rgb(5,192,165)' },
]

const tooltipLabels = seriesOptions.map(s => ({
  label: s.label,
  color: s.color,
}))

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

const rangeOptions: RangeOption[] = [
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: 'All', value: 'all' },
]

const selectedRange = ref<RangeOption>(
  rangeOptions.find(r => r.value === graphRange.value) ?? rangeOptions[2],
)

watch(selectedRange, r => {
  setRange(r.value)
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
