<!--
  =====================================================================================
    Mew Chart
  =====================================================================================
  -->
<script setup>
import { defineProps, onMounted, watch } from 'vue';
import { Line } from 'vue-chartjs';

// props
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    }
  },
  color: {
    type: String,
    default: '#05c0a5'
  }
});

// watch
watch(
  () => props.color,
  () => {
    getChart();
  }
);

// onMounted
onMounted(() => {
  getChart();
});

// methods
const getChart = () => {
  Line.renderChart(
    {
      labels: props.data.x,
      datasets: [
        {
          align: 'center',
          borderColor: props.color,
          fill: false,
          data: props.data.y
        }
      ]
    },
    {
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        ]
      },
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false
    }
  );
};
</script>
<style scoped lang="scss">
canvas {
  max-height: 30px !important;
  max-width: 30px !important;
}
</style>
