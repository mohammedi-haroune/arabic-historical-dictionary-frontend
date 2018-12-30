<i18n>
  ar:
    message:
      error: "حدث خطأ"
      no_data: "غير متوفر"
</i18n>
<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
    <v-flex text-xs-center>
      <v-alert v-if="error" :value="error" type="error" outline>{{ $t('message.error') }}</v-alert>
      <v-alert :value="!loading && !error && datacollections.length === 0" type="warning" outline>{{ $t('message.no_data') }}</v-alert>
      <v-progress-circular class="text-xs-center" v-if="loading" :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
    </v-flex>
     <template v-if="!error && !loading && datacollections.length > 0">
      <v-flex v-for="(d, i) in datacollections" :key="i" xs4>
        <v-hover>
          <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 10 : 0}`">
            <template>
              <v-spacer></v-spacer>
              <line-chart :chart-data="d"></line-chart>
              <v-spacer></v-spacer>
            </template>
          </v-card>
        </v-hover>
      </v-flex>
     </template>
    </v-layout>
  </v-container>
</template>

<script>
import LineChart from "../components/LineChart";
import $backend from "../backend";
import _ from 'lodash'

export default {
  name: 'Graphs',
  components: {
    LineChart
  },
  props: {
    id: Number
  },
  data() {
    return {
      datacollections: [],
      labels: [],
      stats: {},
      show: false,
      dict: {},
      meaning: "None",
      show: false,
      loading: false,
      error: false
    };
  },
  mounted() {
    this.getDataFromQuery();
  },

  methods: {
    async getDataFromQuery() {
      this.loading = true
      try {
        this.stats = await $backend.$getStatisticsById(this.id);
        if (!_.isEmpty(this.stats)) {

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
          this.meaning = this.id;
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
      } catch (err) {
        console.error(err)
        this.error = true
      }
      this.loading = false
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
