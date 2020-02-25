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
    },
    linecolor: {
      default: '#05c0a5',
      type: String
    }
  },
  data() {
    return {
      chartOptions: {
        tooltip: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        chart: {
          height: '60',
          width: '80'
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
          height: '60'
        },
        legend: {
          enabled: false
        },
        series: [
          {
            lineWidth: 1,
            data: this.data,
            //color: '#05c0a5',
            color: this.linecolor,
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
      }
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
