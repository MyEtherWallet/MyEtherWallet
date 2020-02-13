<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: {
    rateHistory: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    this.renderChart(
      {
        labels: this.rateHistory.labels,
        datasets: [
          {
            label: 'Stable',
            align: 'center',
            borderColor: '#5a78f0',
            backgroundColor: '#5a78f0',
            fill: false,
            data: this.rateHistory.stableRates
          },
          {
            label: 'Variable',
            align: 'center',
            borderColor: '#f8a910',
            backgroundColor: '#f8a910',
            fill: false,
            data: this.rateHistory.variableRates
          }
        ]
      },
      {
        tooltips: {
          mode: 'label',
          callbacks: {
            label: item => {
              return item.value + '%';
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: { display: false }
            }
          ],
          xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 6 } }]
        },
        legend: {
          align: 'end',
          labels: {
            usePointStyle: true
          }
        }
      }
    );
  }
};
</script>

<style lang="scss" scoped>
@import 'HistoricalRatesGraph.scss';
</style>
