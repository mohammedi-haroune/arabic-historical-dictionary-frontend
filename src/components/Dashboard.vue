<i18n>
  ar:
    message:
      error: "حدث خطأ"
      no_data: "غير متوفر"
</i18n>

<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex text-xs-center>
        <v-alert v-if="error" :value="error" type="error" outline>{{ $t('message.error') }}</v-alert>
        <v-alert
          :value="!loading && !error && this.stats === undefined"
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
    <v-layout row wrap align-center justify-space-around>
      <template v-if="!error && !loading">
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.words"
            :color="'green'"
            :icon="'fa-file-contract'"
            :stats="stats['words']"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.wordsAvg"
            :color="'orange'"
            :icon="'fa-chart-bar'"
            :stats="stats['wordsAvg']"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.wordsInDico"
            :color="'purple'"
            :icon="'fa-book'"
            :stats="stats['wordsInDico']"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.types"
            :color="'cyan'"
            :icon="'fa-file-word'"
            :stats="stats['types']"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <!-- <v-flex 5 d-flex xs1 mt-4>
        <StatCard
          :title="message.types"
          :color="'cyan'"
          :icon="'fa-file-word'"
          :stats="stats['wordsAvg']"
        ></StatCard>
        <v-spacer></v-spacer>
        </v-flex>-->
      </template>
    </v-layout>
  </v-container>
</template>




<script>
// Vue.use(require('vue-chartist'))
import StatCard from "../components/StatCard";
import $backend from "../backend";

export default {
  components: { StatCard },
  props: {
    doc: Object,
    name: "Dashboard"
  },
  data() {
    return {
      loading: false,
      error: false,
      message: {
        words: "عدد الكلمات",
        wordsAvg: "متوسط طول الكلمات",
        types: "عدد الكلمات المختلفة",
        wordsInDico: "عدد الكلمات في القاموس"
      },
      stats: {
        words: 0,
        wordsAvg: 0,
        types: 0,
        wordsInDico: 0
      },
      labels: ["A", "B", "C"],
      series: [[1, 3, 2], [4, 6, 5]],
      lorem: "yes",
      labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
      value: [200, 675, 410, 390, 310, 460, 250, 240]
    };
  },
  mounted() {
    this.getStats();
    console.log("this is fileid ", this.doc);
  },
  methods: {
    async getStats() {
      this.loading = true;
      try {
        // let fid = "Jahiliy/شعر/أحار بن عمرو كأني خمر.xml";
        const res = await $backend.$getStatisticsByFileId(this.doc.id);
        // const res = {
        //   num_words: 356666,
        //   num_chars: 1456,
        //   num_words_dico: 166,
        //   num_types: 307,
        //   doc_size: 12727
        // };
        console.log("this is res ", res);
        const max = 2e12;
        this.stats.words =
          res["num_words"] < max
            ? res["num_words"]
            : res["num_words"].toExponential();

        const tmp = Number(res["num_chars"] / res["num_words"]).toFixed(5);

        this.stats.wordsAvg = tmp < 2e7 ? tmp : tmp.toExponential();

        this.stats.types =
          res["num_types"] < max
            ? res["num_types"]
            : res["num_types"].toExponential();
        this.stats.wordsInDico =
          res["num_words_dico"] < max
            ? res["num_words_dico"]
            : res["num_words_dico"].toExponential();
      } catch (err) {
        console.error(err);
        this.error = true;
      }
      this.loading = false;
    }
  }
};
</script>

