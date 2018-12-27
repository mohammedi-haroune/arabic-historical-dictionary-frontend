<i18n>
  ar:
    message:
      error: "حدث خطأ عند إنشاء المصطلح"
</i18n>
<template>
  <div>
    <v-alert v-if="error" :value="error" type="error" outline>{{ $t('message.error') }}</v-alert>
    <v-progress-circular class="text-xs-center" v-if="loading" :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
    <v-timeline v-else>
      <template v-for="(period, i) in sorted_periods">
        <v-timeline-item
          :key="i"
          :color="colors[i]"
          fill-dot
          :right="i % 2 !== 0"
          :left="i % 2 === 0"
          :small="i % 2 !== 0"
          v-if="appears_for(period.id).length > 0"
        >
          <v-hover>
            <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 8 : 1}`">
              <v-card-title :class="colors[i]">
                <!-- <v-icon dark size="42">mdi-magnify</v-icon> -->
                <v-icon dark size="42">mdi-calendar-text</v-icon>
                <h2 class="display-1 white--text font-weight-light">{{ period.name }}</h2>
              </v-card-title>
              <v-container>
                <v-layout>
                  <v-flex xs10>
                    <ul>
                      <li :key="j" v-for="(sentence, j) in appears_for(period.id)">{{ sentence }}</li>
                    </ul>
                  </v-flex>
                  <v-flex xs2>
                    <!-- <v-icon size="64">mdi-calendar-text</v-icon> -->
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-hover>
        </v-timeline-item>
      </template>
    </v-timeline>
  </div>
</template>

<script>
import $bakcend from "../backend";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  name: "History",
  props: {
    meaning_id: {
      require: true
    }
  },
  data() {
    return {
      appears_set: [],
      loading: false,
      error: false,
      colors: [
        "cyan lighten-1",
        "purple lighten-2",
        "amber lighten-1",
        "cyan lighten-1",
        "red lighten-1",
        "green lighten-1",
        "blue lighten-1"
      ]
    };
  },
  computed: {
    sorted_periods: function() {
      return _.orderBy(
        this.periods.filter(({ id }) => this.appears_for(id).length > 0),
        "start"
      );
    },
    ...mapState(["periods"])
  },
  methods: {
    async fetchAppears () {
      this.loading = true
      console.log("fetch for ", this.meaning_id);
      $bakcend.$fetchAppears(this.meaning_id).then(results => {
        console.log(results);
        this.appears_set = results.appears_set;
        this.loading = false
        this.error = false
        /* results.appears_set.forEach(appear => {
            if (typeof this.appears_set[appear.period_id] === 'undefined') {
              this.appears_set[appear.period_id] = [appear.sentence]
            } else {
              this.appears_set[appear.period_id].push(appear.sentence)
            }
          }) */
      }).catch(function (err) {
        console.log('err from history', err)
        // this.error = true
      })
    },
    appears_for(id) {
      return this.appears_set
        .filter(a => a.period_id === id)
        .map(a => a.sentence);
    }
  },
  created() {
    this.fetchAppears();
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
</style>
