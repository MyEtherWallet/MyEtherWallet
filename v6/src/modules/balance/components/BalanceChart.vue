<template>
  <chart :options="theme == 'light' ? light : dark"></chart>
</template>

<script>
import { Chart } from 'highcharts-vue';
export default {
  name: 'BalanceChart',
  components: { Chart },
  props: {
    data: {
      default: function () {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {
      template: {
        credits: {
          enabled: false
        },
        chart: {
          zoomType: 'x',
          height: '200px',
          backgroundColor: 'transparent'
        },
        title: {
          text: ''
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
                [0, '#05C0A534'],
                [1, '#05C0A500']
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
        }
      }
    };
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
    light() {
      const obj = Object.assign({}, this.template);
      obj['xAxis'] = {
        tickColor: '#d4d4d4',
        lineColor: '#d4d4d4',
        type: 'datetime'
      };
      obj['yAxis'] = {
        gridLineColor: '#efefef',
        title: {
          text: 'ETH'
        },
        labels: {
          formatter: function () {
            return this.value + ' ETH';
          }
        }
      };
      obj['series'] = [
        {
          type: 'area',
          name: 'Balance',
          data: this.data,
          color: '#05c0a5',
          animation: {
            duration: 400
          }
        }
      ];
      return obj;
    },
    dark() {
      const obj = Object.assign({}, this.template);
      obj['xAxis'] = {
        lineColor: '#828282',
        tickColor: '#828282',
        type: 'datetime'
      };
      obj['yAxis'] = {
        gridLineColor: '#383838',
        title: {
          text: 'USD $'
        },
        labels: {
          formatter: function () {
            return '$ ' + this.value;
          }
        }
      };
      obj['series'] = [
        {
          type: 'area',
          name: 'Balance',
          data: this.data,
          color: '#05c0a5',
          animation: {
            duration: 400
          }
        }
      ];
      return obj;
    }
  }
};
</script>
