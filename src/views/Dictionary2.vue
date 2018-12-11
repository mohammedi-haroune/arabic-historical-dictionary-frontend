<i18n>
  ar:
    message:
      term:
        add: "إضافة مصطلح تاريخي"
        history: "تاريخ المعنى"
</i18n>
<template>
  <v-container>
    <v-layout>
      <v-dialog lazy v-model="dialog_add">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.term.add') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_add = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <new-entry :page="page" :term_to_insert="selected_term"></new-entry>
        </v-card>
      </v-dialog>
      <v-dialog lazy v-model="dialog_history">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.term.history') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_history = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-layout>
              <v-flex>
                <history></history>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout>
    <v-flex text-xs-center>
        <v-pagination
          @input="fetchEntries"
          total-visible="15"
          v-model="page"
          :length="num_pages"
        ></v-pagination>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <ol>
          <li
            v-for="item in items"
            :key="item.id"
          >
            {{ item.term }}
            <v-flex v-if="item.meaning_set.length" pr-4 pa-2>
              <ul>
                <li
                  v-for="meaning in item.meaning_set"
                  :key="meaning.id"
                >
                  {{ meaning.posTag ? meaning.posTag + ' : ' : '' }} {{ meaning.text }}
                  <v-btn icon @click="add(meaning)">
                    <v-icon>add</v-icon>
                  </v-btn>
                  <v-btn icon @click="history(meaning)">
                    <v-icon>fa fa-info</v-icon>
                  </v-btn>
                </li>
              </ul>
            </v-flex>
          </li>
        </ol>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import $backend from '../backend'
import NewEntry from '../components/NewEntry'
import History from '../components/History'

export default {
  name: 'Dictionary2',
  components: { History, NewEntry },
  data () {
    return {
      id: 2,
      page: 2,
      num_pages: 0,
      title: 'كل الكلمات المتوفرة',
      items: [],
      dialog_add: false,
      selected_term: '',
      selected_meaning: '',
      dialog_history: false,
      clicked: false
    }
  },
  mounted () {
    this.fetchEntries()
  },
  methods: {
    async fetchEntries () {
      return $backend.$getEntrySet(this.page)
        .then(response => {
          const set = response.results
          this.items.length = 0
          this.items.push(...set)
          this.num_pages = Math.round(response.count / 12)
        })
        .catch(err => console.warn(err))
    },
    async getMeaning (id) {
      const meaning = await $backend.$getMeaning(id)
      return meaning
    },
    add (term) {
      console.log('term', term)
      this.selected_term = term
      console.log('selected_term', this.selected_term)
      this.dialog_add = true
    },
    history (meaning) {
      console.log('term', meaning)
      this.selected_meaning = meaning
      console.log('selected_term', this.selected_term)
      this.dialog_history = true
    }
  }
}
</script>
