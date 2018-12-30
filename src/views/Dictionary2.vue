<i18n>
  ar:
    message:
      periods: "الفترات الزمنية"
      categories: "الاقسام"
      search: "البحث"
      not_found: "لم يتم العثور على نتائج"
      term:
        add: "إضافة مصطلح تاريخي"
        history: "تاريخ المعنى"
</i18n>
<template>
  <v-container>
    <v-layout>
      <!-- lazy here is required because otherwise selected_meaning and selected_term will be empty -->
      <v-dialog scrollable v-if="dialog_add" lazy v-model="dialog_add">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.term.add') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_add = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
          <new-entry
            :term_to_insert="selected_term"
            :id_to_insert="selected_id"
            :meaning_to_insert="selected_meaning"
          ></new-entry>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog scrollable v-if="dialog_history" lazy v-model="dialog_history">
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
            <v-layout align-center justify-center row fill-height>
              <v-flex text-xs-center>
                <history :meaning_id="selected_meaning_id"></history>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog scrollable v-if="dialog_check_history" lazy v-model="dialog_check_history">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.term.history') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_check_history = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-layout align-center justify-center row fill-height>
              <v-flex text-xs-center>
                <check-history :meaning_id="selected_meaning_id"></check-history>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog scrollable v-if="dialog_stats" lazy v-model="dialog_stats">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.term.stats') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_stats = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <graphs :id="selected_id"></graphs>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout justify-center row wrap>
      <v-flex text-xs-center mx-4 xs12>
        <v-select
          v-model="selectedPeriods"
          :items="periods"
          item-value="id"
          item-text="name"
          prepend-icon="fa fa-clock"
          chips
          cache-items
          clearable
          dense
          solo
          :label="$t('message.periods')"
          @change="fetchEntries()"
          multiple
        >
          <v-list-tile v-if="periods.length > 0" slot="prepend-item" ripple @click="togglePeriods">
            <v-list-tile-action>
              <v-icon :color="selectedPeriods.length > 0 ? 'indigo darken-4' : ''">{{ iconPeriods }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Select All</v-list-tile-title>
          </v-list-tile>
        </v-select>
      </v-flex>

      <v-flex text-xs-center mx-4 xs12>
        <v-select
          v-model="selectedCategories"
          :items="categories"
          chips
          cache-items
          clearable
          dense
          solo
          prepend-icon="fa fa-cubes"
          :label="$t('message.categories')"
          @change="fetchEntries()"
          multiple
        >
          <v-list-tile
            v-if="categories.length > 0"
            slot="prepend-item"
            ripple
            @click="toggleCategories"
          >
            <v-list-tile-action>
              <v-icon
                :color="selectedCategories.length > 0 ? 'indigo darken-4' : ''"
              >{{ iconCategories }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Select All</v-list-tile-title>
          </v-list-tile>
        </v-select>
      </v-flex>
      <v-flex mx-4 xs12>
        <v-text-field
          v-model="query"
          solo
          :label="$t('message.search')"
          @input="fetchEntries()"
          prepend-icon="search"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex text-xs-center>
        <v-pagination
          v-if="num_pages > 0"
          @input="fetchEntries"
          total-visible="15"
          v-model="page"
          :length="num_pages"
          circle
        ></v-pagination>
      </v-flex>
    </v-layout>
    <v-layout v-if="loading">
      <v-flex pa-5 ma-5 xs10 text-xs-center>
        <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
    <!-- <v-layout v-else-if="items.length > 0">
      <v-flex xs12>
        <ol>
          <li v-for="item in items" :key="item.id">
            {{ item.term }}
            <v-flex v-if="item.meaning_set.length" pr-4 pa-2>
              <ul>
                <li v-for="meaning in item.meaning_set" :key="meaning.id">
                  {{ meaning.posTag ? meaning.posTag + ' : ' : '' }} {{ meaning.text }}
                  <v-btn icon @click="add(item.term, meaning)">
                    <v-icon>add</v-icon>
                  </v-btn>
                  <v-btn v-if="meaning.is_appears" icon @click="history(meaning.id)">
                    <v-icon>fa fa-info</v-icon>
                  </v-btn>
                </li>
              </ul>
            </v-flex>
          </li>
        </ol>
      </v-flex>
    </v-layout> -->
    <v-layout v-else-if="items.length > 0">
      <v-flex pa-4 xs12>
        <v-treeview
          :items="items"
          item-children="meaning_set"
          item-key="id"
          item-text="term"
          open-on-click
          open-all
          on-icon="fa fa-cubes"
          off-icon="fa fa-cubes"
          indeterminate-icon="fa fa-cubes"
        >
          <template slot="prepend" slot-scope="{ item, open, leaf }">
            <v-btn small color="success lighten-1" v-if="leaf" icon @click="add(term_id_from_meaning(item.id), term_from_meaning(item.id), item)">
              <v-icon>add</v-icon>
            </v-btn>

            <v-btn small color="secondary lighten-1" v-if="leaf" icon @click="stats(term_id_from_meaning(item.id))">
              <v-icon>fa fa-chart-bar</v-icon>
            </v-btn>
          </template>
          <template slot="append" slot-scope="{ item, open, leaf }">
            <v-btn small color="info darken-2" v-if="leaf && item.is_appears" icon @click="history(item.id)">
              <v-icon>fa fa-info</v-icon>
            </v-btn>
            <v-btn small dark color="amber darken-3" v-if="leaf && item.is_appears" icon @click="checkHistory(item.id)">
              <v-icon>edit</v-icon>
            </v-btn>
          </template>
        </v-treeview>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12 text-xs-center>
        <v-alert :value="true" type="error" outline>{{ $t('message.not_found') }}</v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import $backend from "../backend";
import NewEntry from "../components/NewEntry";
import History from "../components/History";
import { mapState } from "vuex";
import CheckHistory from '../components/CheckHistory'
import Graphs from '../components/Graphs'

export default {
  name: "Dictionary2",
  components: { CheckHistory, History, NewEntry, Graphs },
  data() {
    return {
      id: 2,
      page: 1,
      query: "",
      num_pages: 0,
      title: "كل الكلمات المتوفرة",
      items: [],
      dialog_add: false,
      selected_term: "",
      selected_id: "",
      selected_meaning: "",
      selected_meaning_id: "",
      dialog_history: false,
      dialog_check_history: false,
      dialog_stats: false,
      selectedPeriods: [],
      selectedCategories: [],
      clicked: false,
      loading: false
    };
  },
  mounted() {
    this.fetchEntries();
  },
  methods: {
    async fetchEntries() {
      this.loading = true;
      return $backend
        .$getEntrySet(this.query, this.page)
        .then(response => {
          const set = response.results.map(o => {
            o.meaning_set = o.meaning_set.map(meaning => {
              meaning.term = (meaning.posTag ? meaning.posTag + ' : ' : '') + meaning.text
              return meaning
            })
            return o
          })
          this.items.length = 0;
          this.items.push(...set);
          this.num_pages = Math.round(response.count / 12);
          this.loading = false;
        })
        .catch(err => console.warn(err));
    },
    async getMeaning(id) {
      const meaning = await $backend.$getMeaning(id);
      return meaning;
    },
    add(id, term, meaning) {
      console.log("term", term);
      this.selected_term = term;
      this.selected_id = id
      this.selected_meaning = meaning;
      console.log("selected_term", this.selected_term);
      console.log("selected_meaning", this.selected_meaning);
      this.dialog_add = true;
    },
    stats (id) {
      console.log('id', id)
      this.selected_id = id
      this.dialog_stats = true
    },
    history(id) {
      console.log("meaning_id", id);
      this.selected_meaning_id = id;
      this.dialog_history = true;
    },
    checkHistory(id) {
      console.log("meaning_id", id);
      this.selected_meaning_id = id;
      this.dialog_check_history = true;
    },
    togglePeriods() {
      this.$nextTick(() => {
        if (this.likesAllPeriods) {
          this.selectedPeriods = [];
        } else {
          this.selectedPeriods = this.periods.map(p => p.id).slice();
        }
        this.fetchEntries();
      });
    },
    toggleCategories() {
      this.$nextTick(() => {
        if (this.likesAllCategories) {
          this.selectedCategories = [];
        } else {
          this.selectedCategories = this.categories.slice();
        }
        this.fetchEntries();
      });
    },
    term_from_meaning (id) {
      return this.items.filter(item => item.meaning_set.map(m => m.id).includes(id))[0].term
    },
    term_id_from_meaning (id) {
      return this.items.filter(item => item.meaning_set.map(m => m.id).includes(id))[0].id
    }
  },
  computed: {
    likesAllPeriods() {
      return this.selectedPeriods.length === this.periods.length;
    },
    likesSomePeriods() {
      return this.selectedPeriods.length > 0 && !this.likesAllPeriods;
    },
    iconPeriods() {
      if (this.likesAllPeriods) return "mdi-close-box";
      if (this.likesSomePeriods) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    likesAllCategories() {
      return this.selectedCategories.length === this.categories.length;
    },
    likesSomeCategories() {
      return this.selectedCategories.length > 0 && !this.likesAllCategories;
    },
    iconCategories() {
      if (this.likesAllCategories) return "mdi-close-box";
      if (this.likesSomeCategories) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    ...mapState(["periods", "categories"])
  },
  watch: {
    query(val) {
      this.page = 1;
    }
  }
};
</script>
