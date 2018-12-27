<i18n>
  ar:
    message:
      submit: "التأكيد"
      deleted: "الأمثلة الملغات"
      title: "تعديل الأمثلة"
</i18n>
<template>
  <v-card>
    <v-layout>
      <v-btn
        v-show="this.deleted.length > 0"
        @click.stop="dialog = !dialog"
        left
        bottom
        dark
        fixed
        fab
        color="red"
      >
        <v-icon>delete</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" scrollable max-width="600px">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.deleted') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text style="height: 400px;">
            <template v-for="(sentence, j) in deleted">
              <p :key="j" class="body-2" >
                <v-btn icon @click="deleted.splice(j, 1)">
                  <v-icon color="success">undo</v-icon>
                </v-btn>
                {{ periods.filter(({id}) => id === sentence.period_id)[0].name }} :
                {{ sentence.sentence }}
              </p>
            </template>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-toolbar>
      <v-icon>mdi-cursor-text</v-icon>
      <v-toolbar-title>{{ $t('message.title') }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-timeline>
        <template v-for="(period, i) in sorted_periods">
          <v-timeline-item
            :key="i"
            :color="colors[i]"
            fill-dot
            :right="i % 2 !== 0"
            :left="i % 2 === 0"
            :small="i % 2 !== 0"
            v-if="appears_by_period[period.id].filter(sentence => !deleted.includes(sentence)).length > 0"
            >
            <v-hover>
              <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 8 : 1}`">
                <v-card-title :class="colors[i]">
                  <!-- <v-icon dark size="42">mdi-magnify</v-icon> -->
                  <v-icon dark size="42">mdi-calendar-text</v-icon>
                  <h2 class="display-1 white--text font-weight-light">{{ period.name }}</h2>
                </v-card-title>
                <v-card-text>
                  <template v-for="(sentence, i) in appears_by_period[period.id]">
                        <v-layout :key="i" row align-center justify-space-between v-show="!deleted.includes(sentence)">
                          <v-checkbox v-model="sentence.confirmed"></v-checkbox>
                          <v-flex xs8 px-1>
                            {{ sentence.sentence }}
                          </v-flex>
                          <v-flex xs2 px-1>
                            <v-btn icon @click.stop="deleted.push(sentence)">
                              <v-icon color="red">delete</v-icon>
                            </v-btn>
                          </v-flex>
                          <v-flex xs2 px-1>
                            <v-dialog lazy v-if="sentence.dialog" v-model="sentence.dialog" width="600px">
                              <v-btn slot="activator" icon>
                                <v-icon color="success">fa fa-file</v-icon>
                              </v-btn>
                              <v-card>
                                <v-card-text>
                                  <document-content :id="sentence.document"></document-content>
                                </v-card-text>
                              </v-card>
                            </v-dialog>
                          </v-flex>
                        </v-layout>
                  </template>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-timeline-item>
        </template>
      </v-timeline>
    </v-card-text>
    <v-card-actions>
      <v-btn>
        {{ $t('message.submit') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import $bakcend from '../backend'
import { mapState } from 'vuex'
import _ from 'lodash'
import DocumentContent from './DocumentContent'

export default {
  name: 'CheckHistory',
  components: { DocumentContent },
  props: {
    meaning_id: {
      require: true
    }
  },
  data () {
    return {
      appears_set: [],
      appears_by_period: [],
      deleted: [],
      dialog: false,
      colors: [
        'cyan lighten-1',
        'purple lighten-2',
        'amber lighten-1',
        'cyan lighten-1',
        'red lighten-1',
        'green lighten-1',
        'blue lighten-1'
      ]
    }
  },
  computed: {
    sorted_periods: function () {
      return _.orderBy(
        this.periods
          .filter(({ id }) => this.appears_for(id)
            .filter(sentence => !this.deleted.includes(sentence))
            .length > 0),
        'start'
      )
    }, /*,    appears_by_period: function () {
      return this.periods.map(period => period.id).flatMap(id =>
        this.appears_set
          .filter(a => a.period_id === id)
          .filter(a => !a.confirmed)
          .filter(a => !this.deleted.includes(a))
      )
    } */
    ...mapState(['periods'])
  },
  methods: {
    async fetchAppears () {
      console.log('fetch for ', this.meaning_id)
      $bakcend.$fetchAppears(this.meaning_id).then(results => {
        console.log(results)
        this.appears_set = results.appears_set
        this.appears_set.forEach(appear => {
          if (typeof this.appears_by_period[appear.period_id] === 'undefined') {
            this.appears_by_period[appear.period_id] = []
          }
          this.appears_by_period[appear.period_id].push(appear)
        })
        /* results.appears_set.forEach(appear => {
              if (typeof this.appears_set[appear.period_id] === 'undefined') {
                this.appears_set[appear.period_id] = [appear.sentence]
              } else {
                this.appears_set[appear.period_id].push(appear.sentence)
              }
            }) */
      }).catch(err => this.error = true)
    },
    appears_for (id) {
      return this.appears_set
        .filter(a => a.period_id === id)
    }
  },
  created () {
    this.fetchAppears()
  }
}
</script>

<style scoped>
  .v-card {
    border-radius: 10px;
  }
</style>
