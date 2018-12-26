<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-toolbar color="blue" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title v-text="meaning"></v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-spacer></v-spacer>
      <v-flex v-for="d in datacollections" :key="d.datasets" xs4>
        <v-hover>
          <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 10 : 0}`">
            <template>
              <v-spacer></v-spacer>
              <line-chart :chart-data="d"></line-chart>
              <v-spacer></v-spacer>
            </template>
            <v-card-actions>
              <v-btn flat>Share</v-btn>
              <v-btn flat color="purple">Explore</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="show = !show">
                <v-icon>{{ show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-slide-y-transition>
              <v-card-text
                v-show="show"
              >I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.</v-card-text>
            </v-slide-y-transition>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LineChart from "@/components/LineChart";
import $backend from "../backend";

export default {
  components: {
    LineChart
  },

  data() {
    return {
      datacollections: [],
      labels: [],
      stats: {},
      show: false,
      dict: {},
      meaning: "None",
      show: false
    };
  },
  mounted() {
    this.getDataFromQuery();
  },

  methods: {
    async getStatistics(id) {
      return $backend
        .$getStatistics(id)
        .then(response => {
          this.stats = response;
        })
        .catch(err => console.warn(err));
      // console.table(meaning);
    },
    async getDataFromQuery() {
      var term = "ذكر";
      this.stats = await $backend.$getStatisticsByTerm(term);
      var target = { ...this.stats };
      var keys = Object.keys(this.stats);
      var del = keys.shift();
      for (key in keys) {
        var keysStats = Object.keys(this.stats[keys[key]]["stats"]);
        for (var keystat in keysStats) {
          var keyCategs = Object.keys(
            this.stats[keys[key]]["stats"][keysStats[keystat]]
          );
          for (var keyCateg in keyCategs) {
            target[del]["stats"][keysStats[keystat]][
              keyCategs[keyCateg]
            ] += this.stats[keys[key]]["stats"][keysStats[keystat]][
              keyCategs[keyCateg]
            ];
          }
        }
      }
      this.stats = target;
      delete target[0];
      const k = Object.keys(this.stats);
      this.meaning = term;
      const eras = this.stats[k[0]]["stats"];
      this.labels = Object.keys(eras);
      const categories = Object.keys(eras[this.labels[0]]);

      // const categsCount ;
      for (var key in categories) {
        this.dict[categories[key]] = [];
        for (var key2 in eras) {
          // console.log(categories[key]); // Category
          // console.log(key2); // Era
          // console.log(eras[key2][categories[key]]); Category in that era
          this.dict[categories[key]].push(eras[key2][categories[key]]);
        }
        // console.log(this.dict);
      }

      for (var cat in this.dict) {
        var col = "#" + Math.floor(Math.random() * 16777215).toString(16);

        this.datacollections.push({
          labels: this.labels,
          datasets: [
            {
              label: cat,
              borderColor: col,
              fill: false,
              lineTension: 0.1,
              borderWidth: 5,
              data: this.dict[cat]
            }
          ]
        });
      }
    }

    // getDummyData() {
    //   var dummy_data = [];
    //   var colors = [];
    //   for (let i = 0; i < 2; i++) {
    //     var random = [];
    //     random[0] = Math.random() * (100 - 0) + 20;
    //     for (let j = 1; j < this.labels.length; j++) {
    //       random.push(Math.random() * (100 - random[j - 1]) + 20);
    //     }

    //     var col = "#" + Math.floor(Math.random() * 16777215).toString(16);

    //     dummy_data.push({
    //       label: "Meaning " + i,
    //       borderColor: col,
    //       fill: false,
    //       lineTension: 0.1,
    //       borderWidth: 1.5,
    //       data: random
    //     });
    //   }
    //   return dummy_data;
    // }
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
