<i18n>
  ar:
    message:
      term:
        add: "إضافة مصطلح تاريخي"
</i18n>
<template>
  <v-layout>
    <v-dialog lazy v-model="dialog">
      <v-card>
        <v-toolbar fixed>
          <v-icon>mdi-cursor-text</v-icon>
          <v-toolbar-title>{{ $t('message.term.add') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon color="red">close</v-icon>
          </v-btn>
        </v-toolbar>
        <new-entry :page="page" :term_to_insert="selected_term"></new-entry>
      </v-card>
    </v-dialog>
    <v-flex xs12>
      <ol>
        <li
          v-for="item in items"
          :key="item.id"
        >
          {{ item.term }}
          <v-btn icon @click="add(item.term)">
            <v-icon>add</v-icon>
          </v-btn>
          <v-flex v-if="item.meaning_set.length" pr-4 pa-2>
            <ul>
              <li
                v-for="meaning in item.meaning_set"
                :key="meaning.id"
              >
                {{ meaning.posTag ? meaning.posTag + ' : ' : '' }} {{ meaning.text }}
              </li>
            </ul>
          </v-flex>
        </li>
      </ol>
    </v-flex>
    <v-flex text-xs-center>
      <v-pagination
        @input="fetchEntries"
        v-model="page"
        :length="num_pages"
      ></v-pagination>
    </v-flex>
  </v-layout>
</template>

<script>
import $backend from '../backend'
import NewEntry from '../components/NewEntry'
export default {
  name: 'Dictionary2',
  components: { NewEntry },
  data () {
    return {
      id: 2,
      page: 2,
      num_pages: 0,
      title: 'كل الكلمات المتوفرة',
      items: [],
      dialog: false,
      selected_term: '',
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
      this.dialog = true
    }
  }
}
</script>
