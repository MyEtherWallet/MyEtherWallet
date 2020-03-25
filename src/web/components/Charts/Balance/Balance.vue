<template>
  <chart
    :options="theme == 'light' ? chartOptionsLight : chartOptionsDark"
  ></chart>
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
      chartOptionsLight: {
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
        xAxis: {
          tickColor: '#d4d4d4',
          lineColor: '#d4d4d4',
          type: 'datetime'
        },
        yAxis: {
          gridLineColor: '#efefef',
          title: {
            text: 'USD $'
          },
          labels: {
            formatter: function() {
              return '$ ' + this.value;
            }
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
            color: '#05c0a5',
            animation: {
              duration: 400
            }
          }
        ]
      },
      chartOptionsDark: {
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
        xAxis: {
          lineColor: '#828282',
          tickColor: '#828282',
          type: 'datetime'
        },
        yAxis: {
          gridLineColor: '#383838',
          title: {
            text: 'USD $'
          },
          labels: {
            formatter: function() {
              return '$ ' + this.value;
            }
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
            color: '#05c0a5',
            animation: {
              duration: 400
            }
          }
        ]
      }
    };
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    }
  }
};
</script>
