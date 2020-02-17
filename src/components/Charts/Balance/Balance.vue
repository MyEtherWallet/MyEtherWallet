<template>
  <chart :options="chartOptions"></chart>
</template>

<script>
//import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';

export default {
  components: { Chart },
  props: {
    data: {
      default: function() {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {
      chartOptions: {
        credits: {
          enabled: false
        },
        chart: {
          zoomType: 'x',
          height: '200px'
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'USD $'
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, '#056ac034'],
                [1, '#056ac000']
              ]
            },
            marker: {
              radius: 0
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },

        series: [
          {
            type: 'area',
            name: 'Balance',
            data: this.data,
            color: '#05c0a5'
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
