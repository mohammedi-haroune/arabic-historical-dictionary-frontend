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
          :value="!loading && !error && empty"
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
      <template v-if="!error && !loading && !empty">
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.words"
            :color="'green'"
            :icon="'fa-file-contract'"
            :stats="stats['words']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.wordsAvg"
            :color="'orange'"
            :icon="'fa-chart-bar'"
            :stats="stats['wordsAvg']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.wordsInDico"
            :color="'purple'"
            :icon="'fa-book'"
            :stats="stats['wordsInDico']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.types"
            :color="'cyan'"
            :icon="'fa-file-word'"
            :stats="stats['types']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>

        <v-flex xs3 pa-2>
          <StatCard
            :title="message.doc_size"
            :color="'amber'"
            :icon="'fa-file-alt'"
            :stats="stats['doc_size']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.size_ratio_era"
            :color="'blue'"
            :icon="'fa-percent'"
            :stats="stats['size_ratio_era']+'%'"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.size_ratio_categ"
            :color="'red'"
            :icon="'fa-percent'"
            :stats="stats['size_ratio_categ']+'%'"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs3 pa-2>
          <StatCard
            :title="message.size_ratio_era_categ"
            :color="'grey'"
            :icon="'fa-percent'"
            :stats="stats['size_ratio_era_categ']+'%'"
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
import _ from "lodash";
import StatCard from "../components/StatCard";
import $backend from "../backend";

export default {
  components: { StatCard },
  props: {
    doc: Object,
    name: "DocumentStatistics"
  },
  data() {
    return {
      loading: false,
      error: false,
      message: {
        words: "عدد الكلمات",
        wordsAvg: "متوسط طول الكلمات",
        types: "عدد الكلمات المختلفة",
        wordsInDico: "عدد الكلمات في القاموس التاريخي",
        doc_size: "حجم الملف",
        size_ratio_era: "نسبة الحجم لنفس العصر",
        size_ratio_categ: "نسبة الحجم لنفس القسم ",
        size_ratio_era_categ: "نسبة الحجم لنفس العصر و القسم"
      },
      stats: {
        words: 0,
        wordsAvg: 0,
        types: 0,
        wordsInDico: 0,
        doc_size: 0,
        size_ratio_era: 0,
        size_ratio_categ: 0,
        size_ratio_era_categ: 0
      }
    };
  },
  computed: {
    empty: function() {
      return !this.stats || _.isEmpty(this.stats);
    }
  },
  mounted() {
    this.getStats();
    console.log("this is fileid ", this.doc);
  },
  methods: {
    convertSize(size_byte) {
      var kb = 1024,
        mb = kb * 1024,
        gb = mb * 1024;
      var tmp = "";
      tmp =
        size_byte >= kb && size_byte < mb
          ? Number(size_byte / kb).toFixed(2) + " كيلوبايت"
          : size_byte >= mb && size_byte < gb
          ? Number(size_byte / 1024 / 1024).toFixed(2) + " ميغابايت"
          : size_byte >= gb
          ? Number(size_byte / 1024 / 1024 / 1024).toFixed(2) + " جيجابايت"
          : "كبير جدا";
      return tmp;
    },

    getSameCategSize(categ, global_stats) {
      var sum = 0;
      var index = 0;
      var size = Object.keys(global_stats).length - 2;
      for (var key in global_stats) {
        if (index++ >= size) break;

        console.log("the key is ", key);

        sum += global_stats[key]["size_docs"];
      }
      return sum;
    },

    async getStats() {
      this.loading = true;
      try {
        // let fid = "Jahiliy/شعر/أحار بن عمرو كأني خمر.xml";
        const res = await $backend.$getStatisticsByFileId(this.doc.id);
        const global_stats = await $backend.$getStats();

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

        this.stats["doc_size"] = this.convertSize(res["doc_size"]);

        this.stats["size_ratio_era"] = Number(
          (res["doc_size"] /
            global_stats[this.doc["period"]["name"]]["size_docs"]) *
            100
        ).toFixed(2);

        this.stats["size_ratio_categ"] = Number(
          (res["doc_size"] /
            this.getSameCategSize(this.doc.category, global_stats)) *
            100
        ).toFixed(2);

        this.stats["size_ratio_era_categ"] = Number(
          (res["doc_size"] /
            global_stats[this.doc["period"]["name"]][this.doc.category][
              "size_docs"
            ]) *
            100
        ).toFixed(2);
      } catch (err) {
        console.error(err);
        this.error = true;
      }
      this.loading = false;
    }
  }
};
</script>

