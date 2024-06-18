<template>
  <chart :options="chartOptions"></chart>
</template>

<script setup>
import { Chart } from 'highcharts-vue';

// props
const props = defineProps({
  data: {
    default: () => {
      return [];
    },
    type: Array
  },
  linecolor: {
    default: '#05c0a5',
    type: String
  }
});

const chartOptions = {
  tooltip: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  chart: {
    height: '60',
    width: '80',
    backgroundColor: 'transparent'
  },
  title: {
    text: ''
  },
  xAxis: {
    visible: false,
    width: '80'
  },
  yAxis: {
    visible: false,
    height: '80'
  },
  legend: {
    enabled: false
  },
  series: [
    {
      lineWidth: 1,
      data: props.data,
      color: props.linecolor,
      animation: {
        duration: 400
      },
      marker: { enabled: false },
      states: {
        hover: {
          enabled: false
        }
      }
    }
  ]
};
</script>
