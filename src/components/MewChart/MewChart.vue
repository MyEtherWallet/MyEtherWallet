    <!--
  =====================================================================================
    Mew Chart
  =====================================================================================
  -->
<script>
import { Line } from 'vue-chartjs';

export default {
name: 'MewChart',
extends: Line,
  props: {
    /**
     * Chart Data - takes a x and y attribute, i.e, { x: [], y: []}
     */
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * Chart color. Takes a hex number.
     */
    color: {
      type: String,
      default: '#05c0a5'
    }
  },
  watch: {
    color() {
      this.getChart();
    }
  },
  mounted() {
    this.getChart();
  },
  methods: {
    getChart() {
      this.renderChart(
        {
          labels: this.data.x,
          datasets: [
            {
              align: 'center',
              borderColor: this.color,
              fill: false,
              data: this.data.y
            }
          ]
        },
        {
          elements: {
              point:{
                  radius: 0
              }
          },
          scales: {
            xAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                  display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                  display: false
                }   
            }]
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false
        }
      );
    }
  }
};
</script>
<style scoped lang="scss">
canvas {
  max-height: 30px !important;
  max-width: 30px !important;
}
</style>