<template>
  <div class="inline-block">
    <Line :data="chartData" :options="chartOptions" :plugins="plugins" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
import { formatFiatValue } from '@/utils/numberFormatHelper'
import type { WebTokenPriceChartInterval } from '@/mew_api/types'

const props = withDefaults(
  defineProps<{
    /** 7 days * 24 hours = 168 values (oldest -> newest) */
    labels: number[]
    points: number[]
    /** Canvas size (keep small) */
    width?: number
    height?: number
    /** Visuals */
    upColor?: string
    downColor?: string
    fill?: boolean
    yMin?: number | null
    yMax?: number | null
    /** Downsample large inputs to keep lines readable at small widths */
    maxPoints?: number // e.g., 80–140 works well for 120–150px width
    timeFrame: WebTokenPriceChartInterval
  }>(),
  {
    width: 150,
    height: 40,
    upColor: '#22c55e',
    downColor: '#ef4444',
    fill: false,
    yMin: null,
    yMax: null,
    maxPoints: 300,
    timeFrame: '1D',
  },
)

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

/** Simple bucket-average downsampling (fast + good enough for display-only) */
function downsample(values: number[], target: number): number[] {
  const n = values.length
  if (n <= target) return values.slice()
  const bucketSize = n / target
  const out: number[] = []
  for (let i = 0; i < target; i++) {
    const start = Math.floor(i * bucketSize)
    const end = Math.floor((i + 1) * bucketSize)
    const slice = values.slice(start, end)
    if (slice.length > 0) {
      const avg = slice.reduce((s, v) => s + v, 0) / slice.length
      out.push(avg)
    }
  }
  return out
}

/** Sample labels by taking the middle or first timestamp in each bucket */
function downsampleLabels(values: number[], target: number): number[] {
  const n = values.length
  if (n <= target) return values.slice()
  const bucketSize = n / target
  const out: number[] = []
  for (let i = 0; i < target; i++) {
    const start = Math.floor(i * bucketSize)
    const index = Math.min(Math.floor(start + bucketSize / 2), n - 1)
    out.push(values[index])
  }
  return out
}

const displayPoints = computed(() =>
  downsample(props.points, Math.max(8, props.maxPoints)),
)

const displayLabels = computed(() =>
  downsampleLabels(props.labels, Math.max(8, props.maxPoints)),
)

const isRising = computed(() => {
  const first = props.points?.[0] ?? 0
  const last = props.points?.[props.points.length - 1] ?? 0
  return last >= first
})

const lineColor = computed(() => {
  return isRising.value ? colors.upColor : colors.downColor
})

const backgroundColor = computed(() => {
  return isRising.value ? colors.bgUp : colors.bgDown
})

const chartData = computed<ChartData<'line'>>(() => {
  return {
    labels: displayLabels.value,
    datasets: [
      {
        data: displayPoints.value,
        borderColor: lineColor.value,
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.5, // low smoothing to keep detail
      },
      {
        data: Array(displayPoints.value.length).fill(displayPoints.value[0]),
        borderWidth: 0,
        pointRadius: 0,
        hoverRadius: 0,
        borderColor: 'transparent',
        fill: {
          target: 'stack',
          above: isRising.value ? colors.bgGrey : backgroundColor.value, // And blue below the origin
          below: isRising.value ? backgroundColor.value : colors.bgGrey,
        },
      },
    ],
  }
})
const yBounds = computed(() => {
  const arr = displayPoints.value
  if (arr.length === 0) {
    return { min: 0, max: 1 }
  }
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const span = Math.max(max - min, 1e-9)
  return {
    min: props.yMin ?? min - span * 0.05,
    max: props.yMax ?? max + span * 0.05,
  }
})

const getFormat = (): Intl.DateTimeFormatOptions => {
  switch (props.timeFrame) {
    case '1D':
      return {
        minute: 'numeric',
        hour: 'numeric',
      }
    case '7D':
    case '1M':
    case '3M':
      return {
        day: 'numeric',
        month: 'short',
      }
    default:
      return {
        month: 'short',
        year: 'numeric',
      }
  }
}
const plugins = [
  {
    id: 'verticalLine',
    afterDraw: (chart: any) => {
      if (chart.tooltip?.opacity > 0) {
        const x = chart.tooltip.caretX
        const ctx = chart.ctx
        const topY = chart.chartArea.top
        const bottomY = chart.chartArea.bottom

        ctx.save()
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgb(0,90,229,0.65)'
        ctx.stroke()
        ctx.restore()
      }
    },
  },
]
const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    tooltip: {
      filter: function (tooltipItem) {
        // Disable tooltip for Dataset 2 (which has index 1)
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
            return '$' + formatFiatValue(context.parsed.y).value
          }
          return label
        },
        title: function (context) {
          if (context.length === 0) {
            return ''
          }
          const date = new Date(displayLabels.value[context[0].dataIndex] || '')
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
        callback: function (value) {
          const date = new Date(displayLabels.value[value as number])
          const format = getFormat()
          return props.timeFrame === '1D'
            ? date.toLocaleTimeString('en-US', format)
            : date.toLocaleDateString('en-US', format)
        },
      },
      border: {
        display: false, // This removes the main x-axis line
      },
      grid: {
        display: false, // Set display to false to remove vertical grid lines
      },
    },
    y: {
      display: false,
      ticks: {
        count: 3,
        callback: function (value) {
          return '$' + formatFiatValue(value).value
        },
        font: {
          size: 10,
        },
        color: 'rgba(0, 0, 0, 0.65)',
      },
      suggestedMin: yBounds.value.min,
      suggestedMax: yBounds.value.max,
      grid: {
        display: false, // Set display to false to remove vertical grid lines
      },
    },
  },
  elements: { line: { capBezierPoints: true } },
}))
</script>

<style scoped>
/* Crisp lines in tiny canvases */
canvas {
  image-rendering: -webkit-optimize-contrast;
}
</style>
