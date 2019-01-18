<i18n>
  ar:
    message:
      error: "حدث خطأ"
      no_data: "غير متوفر"
</i18n>

<template>
  <!-- <v-containter>
    <PieChartCard :data="chartData"></PieChartCard>
    <StatCard title color="orange" icon="fa-chart-bar" stats="stats['wordsAvg']"></StatCard>
  </v-containter>-->
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
      <template v-if="!error && !loading && !empty && charsData.length>0">
        <v-flex xs5>
          <PieChartCard :data="charsData[0]" :text="message.num_docs_per_era"></PieChartCard>
        </v-flex>
        <v-flex xs5>
          <PieChartCard :data="charsData[1]" :text="message.size_docs_per_era"></PieChartCard>
        </v-flex>

        <v-flex xs4 pa-2>
          <StatCard
            :title="message.num_docs"
            :color="'green'"
            :icon="'fa-file-alt'"
            :stats="stats['num_docs']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>

        <v-flex xs4 pa-2>
          <StatCard
            :title="message.docs_size"
            :color="'green'"
            :icon="'fa-file-alt'"
            :stats="stats['docs_size']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>

        <v-flex xs4 pa-2>
          <StatCard
            :title="message.avg_size"
            :color="'orange'"
            :icon="'fa-chart-bar'"
            :stats="stats['avg_size']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs4 pa-2>
          <StatCard
            :title="message.periods_count"
            :color="'purple'"
            :icon="'fa-stopwatch'"
            :stats="stats['periods_count']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs4 pa-2>
          <StatCard
            :title="message.num_categ"
            :color="'cyan'"
            :icon="'fa-list-ul'"
            :stats="stats['num_categ']+''"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>

        <!--<v-flex xs3 pa-2>
          <StatCard
            :title="message.types"
            :color="'cyan'"
            :icon="'fa-file-word'"
            :stats="stats['types']"
          ></StatCard>
          <v-spacer></v-spacer>
        </v-flex>-->
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
import distinctColors from "distinct-colors";

import _ from "lodash";
import PieChartCard from "../components/PieChartCard";
import StatCard from "../components/StatCard";
import $backend from "../backend";

export default {
  name: "Dashboard",
  components: {
    PieChartCard,
    StatCard
  },
  data() {
    return {
      stats: {
        num_docs: 0,
        avg_size: 0,
        periods_count: 0,
        num_categ: 0,
        docs_size: 0
      },
      loading: false,
      error: false,
      message: {
        num_docs: "عدد الملفات ",
        docs_size: "حجم كل الملفات",
        avg_size: "متوسط حجم الملفات",
        periods_count: "عدد الفترات الزمنية",
        num_categ: "عدد الأقسام",
        num_docs_per_era: "عدد الملفات لكل عصر",
        size_docs_per_era: "حجم الملفات لكل عصر بالميغابايت"
      },
      charsData: []
    };
  },
  computed: {
    empty: function() {
      return !this.stats || _.isEmpty(this.stats);
    }
  },
  mounted() {
    this.getStats();
    // console.log("this is the stats ", this.res);
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

    selectColor(colorNum, colors) {
      if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
      return "hsl(" + ((colorNum * (360 / colors)) % 360) + ",100%,50%)";
    },
    async getStats() {
      try {
        const res = await $backend.$getStats();
        this.stats["num_docs"] = res["num_docs"];

        this.stats["avg_size"] = this.convertSize(
          Number(res["size_docs"] / res["num_docs"])
        );

        this.stats["periods_count"] = Object.keys(res).length - 2;

        this.stats["num_categ"] = Object.keys(res[Object.keys(res)[0]]).length;

        this.stats["docs_size"] = this.convertSize(res["size_docs"]);

        // First piechart (each era with number of docs )
        var labels = Object.getOwnPropertyNames(res).slice(
          0,
          Object.keys(res).length - 2
        );
        var backgroundColors = [];

        var data = [];
        for (let i = 0; i < labels.length; i++) {
          backgroundColors.push(
            "#" + Math.floor(Math.random() * 16777215).toString(16)
          );
          var sum = res[labels[i]]["num_docs"];
          data.push(sum);
        }
        var obj = {
          labels: labels,
          datasets: [
            {
              label: "label",
              backgroundColor: backgroundColors,
              data: data
            }
          ]
        };
        this.charsData.push(obj);

        // Second piechart (each era with size of docs )
        backgroundColors = [];
        var data = [];

        for (let i = 0; i < labels.length; i++) {
          backgroundColors.push(
            "#" + Math.floor(Math.random() * 16777215).toString(16)
          );
          var sum = Number(res[labels[i]]["size_docs"] / 1024 / 1024).toFixed(
            2
          );
          data.push(sum);
        }
        obj = {
          labels: labels,
          datasets: [
            {
              label: "Kb",
              backgroundColor: backgroundColors,
              data: data
            }
          ]
        };
        this.charsData.push(obj);
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
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
