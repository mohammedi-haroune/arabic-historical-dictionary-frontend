<template>
  <v-timeline>
    <template v-for="(period, i) in sorted_periods">
      <v-timeline-item
        :key="i"
        :color="colors[i]"
        fill-dot
        :right="i % 2 === 0"
        :left="i % 2 !== 0"
        v-if="appears_for(period.id).length > 0"
      >
        <v-card>
          <v-card-title :class="colors[i]">
            <v-icon
              dark
              size="42"
              class="mr-3"
            >
              mdi-magnify
            </v-icon>
            <h2 class="display-1 white--text font-weight-light"> {{ period.name }}</h2>
          </v-card-title>
          <v-container>
            <v-layout>
              <v-flex xs10>
                <ul>
                  <li :key="j" v-for="(sentence, j) in appears_for(period.id)">
                    {{ sentence }}
                  </li>
                </ul>
              </v-flex>
              <v-flex xs2>
                <v-icon size="64">mdi-calendar-text</v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-timeline-item>
    </template>
<!--
    <v-timeline-item
      color="amber lighten-1"
      fill-dot
      left
      small
    >
      <v-card>
        <v-card-title class="amber lighten-1 justify-end">
          <h2 class="display-1 mr-3 white&#45;&#45;text font-weight-light">Title 2</h2>
          <v-icon
            dark
            size="42"
          >mdi-home-outline</v-icon>
        </v-card-title>
        <v-container>
          <v-layout>
            <v-flex xs8>
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit.
            </v-flex>
            <v-flex xs4>
              Lorem ipsum dolor sit amet, no nam oblique veritus.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-timeline-item>

    <v-timeline-item
      color="cyan lighten-1"
      fill-dot
      right
    >
      <v-card>
        <v-card-title class="cyan lighten-1">
          <v-icon
            class="mr-3"
            dark
            size="42"
          >
            mdi-email-outline
          </v-icon>
          <h2 class="display-1 white&#45;&#45;text font-weight-light">Title 3</h2>
        </v-card-title>
        <v-container>
          <v-layout>
            <v-flex
              v-for="n in 3"
              :key="n"
              xs4
            >
              Lorem ipsum dolor sit amet, no nam oblique veritus no nam oblique.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-timeline-item>

    <v-timeline-item
      color="red lighten-1"
      fill-dot
      left
      small
    >
      <v-card>
        <v-card-title class="red lighten-1 justify-end">
          <h2 class="display-1 mr-3 white&#45;&#45;text font-weight-light">Title 4</h2>
          <v-icon
            dark
            size="42"
          >
            mdi-account-multiple-outline
          </v-icon>
        </v-card-title>
        <v-container>
          <v-layout>
            <v-flex xs2>
              <v-icon size="64">mdi-server-network</v-icon>
            </v-flex>
            <v-flex xs10>
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-timeline-item>

    <v-timeline-item
      color="green lighten-1"
      fill-dot
      right
    >
      <v-card>
        <v-card-title class="green lighten-1">
          <v-icon
            class="mr-3"
            dark
            size="42"
          >
            mdi-phone-in-talk
          </v-icon>
          <h2 class="display-1 white&#45;&#45;text font-weight-light">Title 5</h2>
        </v-card-title>
        <v-container>
          <v-layout>
            <v-flex>
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-timeline-item>-->
  </v-timeline>
</template>

<script>
import $bakcend from '../backend'
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'History',
  props: {
    meaning_id: {
      require: true
    }
  },
  data () {
    return {
      appears_set: [],
      colors: ['cyan lighten-1', 'purple lighten-2', 'amber lighten-1', 'cyan lighten-1', 'red lighten-1', 'green lighten-1', 'blue lighten-1']
    }
  },
  computed: {
    sorted_periods: function () {
      return _.orderBy(this.periods, 'start')
    },
    ...mapState(['periods'])
  },
  methods: {
    async fetchAppears () {
      console.log('fetch for ', this.meaning_id)
      $bakcend.$fetchAppears(this.meaning_id)
        .then(results => {
          console.log(results)
          this.appears_set = results.appears_set
          /* results.appears_set.forEach(appear => {
            if (typeof this.appears_set[appear.period_id] === 'undefined') {
              this.appears_set[appear.period_id] = [appear.sentence]
            } else {
              this.appears_set[appear.period_id].push(appear.sentence)
            }
          }) */
        })
    },
    appears_for (id) {
      return this.appears_set.filter(a => a.period_id === id).map(a => a.sentence)
    }
  },
  created () {
    this.fetchAppears()
  }
}
</script>

<style scoped>

</style>
