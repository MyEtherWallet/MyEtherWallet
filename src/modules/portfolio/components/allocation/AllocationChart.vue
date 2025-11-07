<template>
  <div class="max-w-[145px] mx-auto max-h-[145px] overflow-visible">
    <doughnut v-if="!isLoading" :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart,
  ArcElement,
  Tooltip,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { type PropType } from 'vue'
import {
  type TokenAllocation,
  ALLOCATION_COLORS,
} from '@/modules/portfolio/types'
import { formatPercentageValue } from '@/utils/numberFormatHelper'

const props = defineProps({
  /**
   * @title The title of the dialog, not required
   * @type string | undefined
   */
  tokens: {
    default: () => [],
    type: Array as PropType<TokenAllocation[]>,
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
})
Chart.register(ArcElement, Tooltip)

const otherPercentage = computed(() => {
  const data = props.tokens.map(t => t.percentageNumber)
  return 100 - data.reduce((a, b) => a + b, 0)
})

const labels = computed(() => {
  const labels = props.tokens.map(t => t.symbol)
  if (otherPercentage.value <= 0) {
    return labels
  }
  labels.push('Other')
  return labels
})
const dataSet = computed(() => {
  const data = props.tokens.map(t => t.percentageNumber)
  if (otherPercentage.value <= 0) {
    return data
  }
  data.push(otherPercentage.value)
  return data
})
const chartData = computed<ChartData<'doughnut'>>(() => {
  return {
    labels: labels.value,
    datasets: [
      {
        data: dataSet.value,
        backgroundColor: ALLOCATION_COLORS,
      },
    ],
  }
})
const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  plugins: {
    tooltip: {
      filter: function (tooltipItem) {
        // Disable tooltip for Dataset 2 (which has index 1)
        return tooltipItem.datasetIndex !== 1
      },
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      boxPadding: 10,
      bodySpacing: 3,
      intersect: false,
      titleSpacing: 3,
      displayColors: false,
      titleFont: {
        size: 14,
        fontFamily: 'Roboto , sans-serif',
        weight: 'normal',
      },
      bodyFont: {
        size: 12,
        fontFamily: 'Roboto , sans-serif',
      },
      callbacks: {
        label: function (context) {
          return formatPercentageValue(context.parsed).value
        },
      },
    },
  },
  maintainAspectRatio: false,
  borderWidth: 0,
  hoverOffset: 5,
  cutout: '70%',
  layout: {
    padding: {
      left: 8,
      right: 8,
      top: 8,
      bottom: 8,
    },
  },
}))
</script>
