<template>
  <div
    class="inline-block"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <Line :data="chartData" :options="chartOptions" />
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
} from 'chart.js'

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
)

const props = withDefaults(
  defineProps<{
    /** 7 days * 24 hours = 168 values (oldest -> newest) */
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
  },
)

/** Simple bucket-average downsampling (fast + good enough for display-only) */
function downsample(values: number[], target: number): number[] {
  const n = values.length
  if (n <= target) return values.slice()
  const bucketSize = Math.ceil(n / target)
  const out: number[] = []
  for (let i = 0; i < n; i += bucketSize) {
    const slice = values.slice(i, i + bucketSize)
    const avg = slice.reduce((s, v) => s + v, 0) / slice.length
    out.push(avg)
  }
  return out
}

const displayPoints = computed(() =>
  downsample(props.points, Math.max(8, props.maxPoints)),
)

const lineColor = computed(() => {
  const first = props.points?.[0] ?? 0
  const last = props.points?.[props.points.length - 1] ?? 0
  return last >= first ? props.upColor : props.downColor
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

const chartData = computed(() => ({
  labels: Array(displayPoints.value.length).fill(''),
  datasets: [
    {
      data: displayPoints.value,
      borderColor: lineColor.value,
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.5, // low smoothing to keep detail
      fill: props.fill ? 'start' : false,
      backgroundColor: props.fill ? lineColor.value + '22' : 'transparent',
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: { display: false },
    y: {
      display: false,
      suggestedMin: yBounds.value.min,
      suggestedMax: yBounds.value.max,
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
