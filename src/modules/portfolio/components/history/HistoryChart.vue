<template>
  <div class="chart-wrapper flex relative">
    <Line
      ref="historyChart"
      :data="chartData"
      :options="chartOptions"
      :plugins="plugins"
    />
    <div
      v-if="customTooltip"
      ref="tooltipEl"
      class="chart-custom-tooltip"
      :class="`chart-custom-tooltip--${customTooltip.placement}`"
      :style="customTooltip.style"
    >
      <div class="tooltip-title">{{ customTooltip.title }}</div>
      <div
        v-for="row in customTooltip.rows"
        :key="row.label"
        class="tooltip-row"
      >
        <span
          class="tooltip-dot"
          :style="{ backgroundColor: row.color }"
        ></span>
        <span class="tooltip-label">{{ row.label }}</span>
        <span class="tooltip-value">{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { useCurrency } from '@/composables/useCurrency'

interface DataPoint {
  timestamp: number
  value: number
}

interface SeriesLabel {
  label: string
  color: string
}

interface TooltipState {
  title: string
  rows: { label: string; value: string; color: string }[]
  style: Record<string, string>
  placement: 'top' | 'bottom'
}

const props = defineProps<{
  /** 7 days * 24 hours = 168 values (oldest -> newest) */
  data: DataPoint[] | Array<DataPoint[]>
  dispalayYAxis?: boolean
  /** Labels for [data, topData, bottomData] series in tooltip */
  seriesLabels?: SeriesLabel[]
}>()

/**
 * CHART TEMP
 */
Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
)

const colors = {
  upColor: 'rgb(5,192,165,1)',
  downColor: 'rgb(239,68,68,1)',
  bgUp: 'rgba(5,192,165,0.07)',
  bgDown: 'rgba(239,68,68,0.07)',
  bgGrey: 'rgba(0,0,0,0.05)',
  tooltipBg: 'rgba(0,0,0,0.7)',
}

const customTooltip = ref<TooltipState | null>(null)
const tooltipEl = ref<HTMLElement | null>(null)

const isMultiSeries = computed(() => Array.isArray(props.data[0]))
const primaryData = computed(() =>
  isMultiSeries.value
    ? (props.data[0] as DataPoint[])
    : (props.data as DataPoint[]),
)
const topData = computed(() =>
  isMultiSeries.value ? ((props.data as DataPoint[][])[1] ?? []) : [],
)
const bottomData = computed(() =>
  isMultiSeries.value ? ((props.data as DataPoint[][])[2] ?? []) : [],
)
const points = computed(() => primaryData.value.map(d => d.value))
const topPoints = computed(() => topData.value.map(d => d.value))
const bottomPoints = computed(() => bottomData.value.map(d => d.value))

// Use the first non-empty series as the source of x-axis labels
const labels = computed(() => {
  const source =
    primaryData.value.length > 0
      ? primaryData.value
      : topData.value.length > 0
        ? topData.value
        : bottomData.value
  return source.map(d => d.timestamp)
})

const chartWidth = ref<number>(0)
const chartHeight = ref<number>(0)
const gradient = ref<CanvasGradient | null>(null)
const plugins = [
  {
    id: 'verticalLine',
    afterDraw: (chart: Chart) => {
      if ((chart.tooltip?.opacity ?? 0) > 0) {
        const x = chart.tooltip!.caretX
        const ctx = chart.ctx
        const topY = chart.chartArea.top
        const bottomY = chart.chartArea.bottom

        ctx.save()
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(0,90,229,0.65)'
        ctx.stroke()
        ctx.restore()
      }
    },
  },
]

const chartData = computed<ChartData<'line'>>(() => {
  const lineSettings = {
    borderWidth: 1.5,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointHoverBorderColor: '#fff',
    tension: 0.5, // low smoothing to keep detail
  }
  const dataSet: ChartData<'line'> = {
    labels: labels.value,
    datasets: [
      {
        data: points.value,
        borderColor: 'rgb(0,90,229,1)',
        fill: true,
        ...lineSettings,
        backgroundColor: function (context) {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) {
            // This case happens on initial chart load
            return
          }

          const _chartWidth = chartArea.right - chartArea.left
          const _chartHeight = chartArea.bottom - chartArea.top

          if (
            !gradient.value ||
            _chartWidth !== chartWidth.value ||
            _chartHeight !== chartHeight.value
          ) {
            // Create the gradient because this is either the first render
            // or the size of the chart has changed
            chartWidth.value = _chartWidth
            chartHeight.value = _chartHeight
            gradient.value = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            )
            gradient.value.addColorStop(0, 'rgba(0,90,229,0.40)')
            gradient.value.addColorStop(0.5, 'rgba(0,90,229,0.15)')
            gradient.value.addColorStop(1, 'rgba(0,90,229,0)')
          }
          return gradient.value
        },
      },
    ],
  }
  if (topPoints.value.length > 0) {
    dataSet.datasets!.push({
      data: topPoints.value,
      borderColor: '#9D00FF',
      ...lineSettings,
    })
  }
  if (bottomPoints.value.length > 0) {
    dataSet.datasets!.push({
      data: bottomPoints.value,
      borderColor: colors.upColor,
      ...lineSettings,
    })
  }
  return dataSet
})
const yBounds = computed(() => {
  const arr = points.value
  if (arr.length === 0) {
    return { min: 0, max: 1 }
  }
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const span = Math.max(max - min, 1e-9)
  return {
    min: min - span * 0.05,
    max: max + span * 0.05,
  }
})

const { formatFiat, rate, currencySymbol } = useCurrency()

const chartOptions = computed<ChartOptions<'line'>>(() => {
  // Track currency refs so the chart re-renders when the display currency changes.
  void rate.value
  void currencySymbol.value
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: props.seriesLabels
        ? {
            enabled: false,
            intersect: false,
            external: function (context) {
              const { tooltip, chart } = context
              if (tooltip.opacity === 0) {
                customTooltip.value = null
                return
              }
              const dataIndex = tooltip.dataPoints?.[0]?.dataIndex
              if (dataIndex == null) return

              const allData = [
                primaryData.value,
                topData.value,
                bottomData.value,
              ]

              const timestamp = allData
                .map(series => series?.[dataIndex]?.timestamp)
                .find(ts => ts != null)
              let title = ''
              if (timestamp != null) {
                const date = new Date(timestamp)
                if (!isNaN(date.getTime())) {
                  title = date.toLocaleString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                }
              }
              const rows: TooltipState['rows'] = []
              props.seriesLabels!.forEach((s, i) => {
                const seriesData = allData[i]
                if (!seriesData || seriesData.length === 0) return
                const val = seriesData[dataIndex]?.value
                if (val == null) return
                rows.push({
                  label: s.label,
                  color: s.color,
                  value: formatFiat(val).value,
                })
              })

              const chartRect = chart.canvas.getBoundingClientRect()
              const wrapperEl = chart.canvas.parentElement
              const wrapperRect = wrapperEl?.getBoundingClientRect()
              const offsetLeft = wrapperRect
                ? chartRect.left - wrapperRect.left
                : 0
              const offsetTop = wrapperRect
                ? chartRect.top - wrapperRect.top
                : 0

              const estRowHeight = 22
              const estTooltipHeight = 46 + rows.length * estRowHeight
              const estTooltipWidth = tooltipEl.value?.offsetWidth ?? 200
              const gap = 12

              const caretX = tooltip.caretX
              const caretY = tooltip.caretY

              const placement: 'top' | 'bottom' =
                caretY - estTooltipHeight - gap < 0 ? 'bottom' : 'top'

              const wrapperWidth = wrapperRect?.width ?? chartRect.width
              const halfWidth = estTooltipWidth / 2
              const minLeft = halfWidth - offsetLeft + 4
              const maxLeft = wrapperWidth - halfWidth - offsetLeft - 4
              const clampedCaretX = Math.min(Math.max(caretX, minLeft), maxLeft)

              customTooltip.value = {
                title,
                rows,
                placement,
                style: {
                  left: clampedCaretX + offsetLeft + 'px',
                  top: caretY + offsetTop + 'px',
                },
              }
            },
          }
        : {
            filter: function (tooltipItem) {
              return tooltipItem.datasetIndex !== 1
            },
            padding: 10,
            backgroundColor: colors.tooltipBg,
            boxPadding: 10,
            bodySpacing: 3,
            intersect: false,
            titleSpacing: 3,
            displayColors: false,
            titleFont: {
              size: 12,
              fontFamily: 'Roboto , sans-serif',
              weight: 'normal',
            },
            bodyFont: {
              size: 16,
              fontFamily: 'Roboto , sans-serif',
            },
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  return formatFiat(context.parsed.y).display
                }
                return label
              },
              title: function (context) {
                if (context.length === 0) {
                  return ''
                }
                const date = new Date(labels.value[context[0].dataIndex] || '')
                return date.toLocaleDateString('en-US', {
                  minute: 'numeric',
                  hour: 'numeric',
                })
              },
            },
          },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          font: {
            size: 10,
          },
          maxTicksLimit: 4,
          type: 'time',
          align: 'start',
          color: 'rgba(0, 0, 0, 0.65)',
          callback: function (value, index) {
            const date = new Date(labels.value[value as number])
            const display = date.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            })
            if (index === 0) return `  ${display}`
            return display
          },
        },
        grid: {
          display: false, // Set display to false to remove vertical grid lines
        },
      },
      y: {
        display: props.dispalayYAxis ?? false,
        ticks: {
          count: 3,
          callback: function (value) {
            return formatFiat(value).display
          },
          font: {
            size: 10,
          },
          color: 'rgba(0, 0, 0, 0.65)',
        },
        afterBuildTicks: function (axis) {
          if (!axis.ticks.some(t => t.value === 0)) {
            axis.ticks.push({ value: 0 })
            axis.ticks.sort((a, b) => a.value - b.value)
          }
        },
        suggestedMin: yBounds.value.min,
        suggestedMax: yBounds.value.max,
        grid: {
          display: true,
          color: function (context) {
            if (context.tick.value === 0) return 'rgba(0,0,0,0.1)'
            return 'transparent'
          },
        },
        position: 'right',
      },
    },
    elements: { line: { capBezierPoints: true } },
  }
})
</script>

<style scoped>
/* Crisp lines in tiny canvases */
canvas {
  image-rendering: -webkit-optimize-contrast;
}

.chart-wrapper {
  position: relative;
}

.chart-custom-tooltip {
  position: absolute;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  padding: 10px 14px;
  white-space: nowrap;
  z-index: 10;
  font-family: Roboto, sans-serif;
}

.chart-custom-tooltip--top {
  transform: translate(-50%, calc(-100% - 12px));
}

.chart-custom-tooltip--bottom {
  transform: translate(-50%, 12px);
}

.tooltip-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
}

.tooltip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.tooltip-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tooltip-label {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
}

.tooltip-value {
  color: #fff;
  font-weight: 500;
}
</style>
