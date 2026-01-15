<template>
  <div class="flex mx-auto">
    <Line ref="historyChart" :data="chartData" :options="chartOptions" />
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
import { formatFiatValue } from '@/utils/numberFormatHelper'

interface DataPoint {
  timestamp: number
  price: number
}
const props = defineProps<{
  /** 7 days * 24 hours = 168 values (oldest -> newest) */
  data: DataPoint[]
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
/** Simple bucket-average downsampling (fast + good enough for display-only) */
const downsample = (values: DataPoint[], target: number): DataPoint[] => {
  const n = values.length
  if (n <= target) return values.slice()
  const bucketSize = Math.ceil(n / target)
  const out: DataPoint[] = []
  for (let i = 0; i < n; i += bucketSize) {
    const slice = values.slice(i, i + bucketSize)
    const avg = slice.reduce((s, v) => s + v.price, 0) / slice.length
    out.push({ timestamp: slice[0].timestamp, price: avg })
  }
  return out
}

const displayPoints = computed(() => downsample(props.data, Math.max(8, 80)))
const points = computed(() => displayPoints.value.map(d => d.price))
const labels = computed(() => displayPoints.value.map(d => d.timestamp))

const chartWidth = ref<number>(0)
const chartHeight = ref<number>(0)
const gradient = ref<CanvasGradient | null>(null)
const chartData = computed<ChartData<'line'>>(() => {
  return {
    labels: labels.value,
    datasets: [
      {
        data: points.value,
        borderColor: 'rgb(0,90,229,1)',
        fill: true,
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
            gradient.value.addColorStop(0, 'rgba(0,90,229,0.25)')
            gradient.value.addColorStop(0.5, 'rgba(0,90,229,0.10)')
            gradient.value.addColorStop(1, 'rgba(0,90,229,0)')
          }
          return gradient.value
        },
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.5, // low smoothing to keep detail
      },
    ],
  }
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

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
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
      display: false,
      grid: {
        display: false, // Set display to false to remove vertical grid lines
      },
    },
    y: {
      display: false,

      min: yBounds.value.min,
      max: yBounds.value.max,
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
