<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex v-for="d in datacollections" :key="d.datasets" xs4>
        <template>
          <line-chart :chart-data="d"></line-chart>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LineChart from "@/components/LineChart";

export default {
  components: {
    LineChart
  },

  data() {
    return {
      datacollections: [],
      labels: []
    };
  },
  mounted() {
    // this.getDataFromQuery();
    this.getDataFromQuery();
    // console.log(this.datacollections);
    // this.datacollection = this.fillData();
  },

  methods: {
    fillData(labes, datasets) {
      return {
        // Data to be represented on x-axis
        labels: this.labels,
        datasets: this.getDummyData()
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },

    async getDataFromQuery() {
      // const docs = await $backend.$getStats(args);
      //Must convert data here and place them into this.datacollections
      /**
       * The data must be converted to this 
       * For each word in the result, the following object must be added :
       * 
       * [
       *  {
            label: "Meaning_1 of the word",
            borderColor: "some color",
            fill: false,
            data: ["era_1:meaning_appartion" , "era_2:meaning_apparition" ... "era_n:meaning_apparation"]
          },
          ...
          {
            label: "Meaning_n of the word",
            borderColor: "some color",
            fill: false,
            data: ["era_1:meaning_appartion" , "era_2:meaning_apparition" ... "era_n:meaning_apparation"]
          },
        ]
       *
       *In the end an array of these arrays must be constructed, it will be the datacollection of each 
       *word array it represents a set of graphs, each graph is attached to a word.
       *
       *
       * 
       * 
       *  
       */
      this.labels = ["Jahili", "Islamic", "Abbassi", "Modern"];
      for (var i = 0; i < 5; i++) {
        this.datacollections.push({
          labels: this.labels,
          datasets: this.getDummyData()
        });
      }
    },

    getDummyData() {
      var dummy_data = [];
      var colors = [];
      for (let i = 0; i < 2; i++) {
        var random = [];
        random[0] = Math.random() * (100 - 0) + 20;
        for (let j = 1; j < this.labels.length; j++) {
          random.push(Math.random() * (100 - random[j - 1]) + 20);
        }

        var col = "#" + Math.floor(Math.random() * 16777215).toString(16);

        dummy_data.push({
          label: "Meaning " + i,
          borderColor: col,
          fill: false,
          lineTension: 0.1,
          borderWidth: 1.5,
          data: random
        });
      }
      return dummy_data;
    }
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
