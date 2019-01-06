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
        <v-alert
          :value="!loading && !error && datacollections.length === 0"
          type="warning"
          outline
        >{{ $t('message.no_data') }}</v-alert>
        <v-progress-circular
          class="text-xs-center"
          v-if="loading"
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <template v-if="!error && !loading && datacollections.length > 0">
        <v-flex v-for="(d, i) in datacollections" :key="i" xs4>
          <v-hover>
            <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 10 : 0}`">
              <v-card-title class="primary white--text headline">
                <v-flex class="text-xs-center">{{ d.categ }}</v-flex>
              </v-card-title>

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
import _ from "lodash";

export default {
  name: "Graphs",
  components: {
    LineChart
  },
  props: {
    word_id: Number,
    meaning_id: Number,
    sents: Object
  },
  data() {
    return {
      datacollections: [],
      labels: [],
      stats: {},
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
      this.loading = true;
      const dict = {};
      try {
        if (this.sents) {
          this.sents = this.sents.sents[0].sentence.split(" ");

          this.stats = await $backend.$getStatisticsSentsByWords(this.sents);
          if (!_.isEmpty(this.stats)) {
            const eras = this.stats["stats"];
            this.labels = this.stats["ordered_eras"];
            const tmpLabels = [];

            const categories = [];
            for (var k in eras) {
              var tmp = eras[k];
              if (!tmpLabels.includes(k)) tmpLabels.push(k);
              for (var k2 in tmp) {
                if (!categories.includes(k2)) categories.push(k2);
              }
            }
            this.labels = this.labels.filter(x => tmpLabels.includes(x));
            for (var key in categories) {
              dict[categories[key]] = [...Array(this.labels.length).fill(0)];
              for (var key2 in eras) {
                // console.log(categories[key]); // Category
                // console.log(key2); // Era
                // console.log(eras[key2][categories[key]]); Category in that era
                if (categories[key] in eras[key2])
                  dict[categories[key]].splice(
                    this.labels.indexOf(key2),
                    1,
                    eras[key2][categories[key]]
                  );
                else dict[categories[key]].push(0);
              }
            }
            for (var cat in dict) {
              var col = "#" + Math.floor(Math.random() * 16777215).toString(16);

              this.datacollections.push({
                categ: cat,
                labels: this.labels,
                datasets: [
                  {
                    label: cat,
                    borderColor: col,
                    fill: false,
                    lineTension: 0.2,
                    borderWidth: 5,
                    data: dict[cat]
                  }
                ]
              });
            }
          }
        } else {
          this.stats = await $backend.$getStatisticsById(this.word_id);

          if (!_.isEmpty(this.stats)) {
            const k = Object.keys(this.stats);
            this.meaning = this.id;
            this.labels = this.stats["ordered_eras"];

            if (!this.meaning_id) {
              const inner_dict = [...Array(k.length - 1)];
              for (let i = 0; i < k.length - 1; i++) {
                inner_dict[i] = {};
                const eras = this.stats[k[i]]["stats"];
                const categories = Object.keys(eras[this.labels[0]]);

                for (var key in categories) {
                  inner_dict[i][categories[key]] = [
                    ...Array(this.labels.length).fill(0)
                  ];

                  for (var key2 in eras) {
                    // console.log(categories[key]); // Category
                    // console.log(key2); // Era
                    // console.log(eras[key2][categories[key]]); Category in that era
                    inner_dict[i][categories[key]].splice(
                      this.labels.indexOf(key2),
                      1,
                      eras[key2][categories[key]]
                    );
                  }
                }
              }

              for (var cat in inner_dict[0]) {
                var datas = [];
                for (let i = 0; i < k.length - 1; i++) {
                  var col =
                    "#" + Math.floor(Math.random() * 16777215).toString(16);
                  datas.push({
                    label: this.stats[k[i]]["meaning"],
                    borderColor: col,
                    fill: false,
                    lineTension: 0.1,
                    borderWidth: 5,
                    data: inner_dict[i][cat]
                  });
                }
                this.datacollections.push({
                  categ: cat,
                  labels: this.labels,
                  datasets: datas
                });
              }
            } else {
              var index = 0;
              for (let i = 0; i < k.length; i++) {
                if (k[i] == this.meaning_id) {
                  index = i;
                }
              }
              const eras = this.stats[k[index]]["stats"];
              this.labels = this.stats["ordered_eras"];
              const categories = Object.keys(eras[this.labels[0]]);

              for (var key in categories) {
                dict[categories[key]] = [...Array(this.labels.length).fill(0)];
                for (var key2 in eras) {
                  // console.log(categories[key]); // Category
                  // console.log(key2); // Era
                  // console.log(eras[key2][categories[key]]); Category in that era
                  dict[categories[key]].splice(
                    this.labels.indexOf(key2),
                    1,
                    eras[key2][categories[key]]
                  );
                }
              }
              for (var cat in dict) {
                var col =
                  "#" + Math.floor(Math.random() * 16777215).toString(16);

                this.datacollections.push({
                  categ: cat,
                  labels: this.labels,
                  datasets: [
                    {
                      label: this.stats[this.meaning_id]["meaning"],
                      borderColor: col,
                      fill: false,
                      lineTension: 0.1,
                      borderWidth: 5,
                      data: dict[cat]
                    }
                  ]
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
        this.error = true;
      }
      this.loading = false;
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
