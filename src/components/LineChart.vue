<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["options"],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0
            }
          }
        ]
      }
    };
    this.renderChart(this.chartData, options);
  }
};
</script>
