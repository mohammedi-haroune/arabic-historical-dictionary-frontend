<i18n>
  ar:
    message:
      search: "البحث"
      not_found: "لم يتم العثور على نتائج"
</i18n>
<template>
  <v-layout row wrap>
    <v-flex xs12 mx-4>
      <v-text-field
        v-model="query"
        solo
        :label="$t('message.search')"
        @input="fetchEntries"
        append-icon="search"
        class="my-input"
      ></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-card class="elevation-5">
        <v-card-title class="primary white--text headline">{{ title }}</v-card-title>
        <v-layout justify-space-between pa-3>
          <v-flex pa-5 ma-5 xs10 text-xs-center v-if="loading">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
          </v-flex>

          <v-flex v-else-if="items.length > 0" xs12>
            <v-treeview
              :items="items"
              item-children="meaning_set"
              item-key="id"
              item-text="term"
              open-on-click
              on-icon="fa fa-cubes"
              off-icon="fa fa-cubes"
              indeterminate-icon="fa fa-cubes"
            >
            </v-treeview>
            <!--<v-list expand>
              <v-list-group v-for="item in items" v-model="item.active" :key="item.id" no-action>
                <v-list-tile slot="activator">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <b>{{ item.term }}</b>
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile v-for="meaning in item.meaning_set" :key="meaning.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ meaning.text }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
            </v-list>-->
            <!--<v-treeview
            :active.sync="active"
            :items="items"
            :load-children="fetchEntries"
            :open.sync="open"
            item-key="term"
            item-text="term"
            activatable
            active-class="primary&#45;&#45;text"
            class="grey lighten-5"
            open-on-click
            transition
          >
            <v-icon
              v-if="!item.children"
              slot="prepend"
              slot-scope="{ item, active }"
              :color="active ? 'primary' : ''"
            >mdi-account
            </v-icon>
            </v-treeview>-->
          </v-flex>
          <v-flex v-else xs12>
            <v-alert :value="true" type="warning">{{ $t('message.not_found') }}</v-alert>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-flex text-xs-center>
            <v-pagination
              v-if="num_pages > 0"
              total-visible="15"
              @input="fetchEntries"
              v-model="page"
              :length="num_pages"
              circle
            ></v-pagination>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import $backend from "../backend";

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  name: "Dictionary",
  data() {
    return {
      id: 2,
      page: 1,
      query: "",
      num_pages: 0,
      title: "كل الكلمات المتوفرة",
      items: [],
      loading: false
    };
  },
  mounted() {
    this.fetchEntries();
  },
  methods: {
    async fetchEntries() {
      // Remove in 6 months and say
      // you've made optimizations! :)
      // await pause(1500)
      this.loading = true;
      return $backend
        .$getEntrySet(this.query, this.page)
        .then(response => {
          const set = response.results.map(o => {
            o.meaning_set = o.meaning_set.map(meaning => {
              return {
                term: (meaning.posTag ? meaning.posTag + ' : ' : '') + meaning.text
              }
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
    }
  },
  watch: {
    query(val) {
      this.page = 1;
    }
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.my-input.v-input .v-input__slot {
  border-radius: 50px;
}
</style>
