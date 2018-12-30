<i18n>
  en:
    message:
      periods: "Periods"
      categories: "Categories"
      search: "Search"
  ar:
    message:
      periods: "الفترات الزمنية"
      categories: "الاقسام"
      search: "البحث"
      not_found: "لم يتم العثور على نتائج"

</i18n>

<template>
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
        @change="getDocuments"
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
        @change="getDocuments"
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
        @input="getDocuments"
        prepend-icon="search"
      ></v-text-field>
    </v-flex>
    <v-flex xs10 text-xs-center>
      <v-pagination
        v-if="num_pages !== 0"
        total-visible="15"
        @input="getDocuments"
        v-model="page"
        :length="num_pages"
        circle
      ></v-pagination>
    </v-flex>
    <v-flex pa-5 ma-5 xs10 text-xs-center v-if="loading">
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
    </v-flex>

    <template v-else-if="documents.length > 0" v-for="doc in documents">
      <v-flex :key="doc.fileid" pa-2 md4>
        <document-sample :key="doc.fileid" :doc="doc"></document-sample>
      </v-flex>
    </template>

    <v-flex v-else ma-4 xs12>
      <v-alert :value="true" type="error" outline>{{ $t('message.not_found') }}</v-alert>
    </v-flex>
    <v-flex xs10 text-xs-center>
      <v-pagination
        v-if="num_pages !== 0"
        total-visible="15"
        @input="getDocuments"
        v-model="page"
        :length="num_pages"
        circle
      ></v-pagination>
    </v-flex>
  </v-layout>
</template>

<script>
import DocumentSample from "../components/DocumentSample";
import $backend from "../backend";
import { mapState } from "vuex";

export default {
  components: { DocumentSample },
  data() {
    return {
      documents: [],
      selectedPeriods: [],
      selectedCategories: [],
      query: "",
      page: 1,
      loading: false,
      num_pages: 0
    };
  },
  mounted() {
    this.getDocuments();
  },
  methods: {
    async getDocuments() {
      this.loading = true;
      const docs = await $backend.$fetchDocuments(
        this.selectedPeriods,
        this.selectedCategories,
        this.query,
        this.page
      );
      this.documents = docs.results;
      this.num_pages = Math.round(docs.count / 12);
      this.loading = false;
    },
    togglePeriods() {
      this.$nextTick(() => {
        if (this.likesAllPeriods) {
          this.selectedPeriods = [];
        } else {
          this.selectedPeriods = this.periods.map(p => p.id).slice();
        }
        this.getDocuments();
      });
    },
    toggleCategories() {
      this.$nextTick(() => {
        if (this.likesAllCategories) {
          this.selectedCategories = [];
        } else {
          this.selectedCategories = this.categories.slice();
        }
        this.getDocuments();
      });
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
    query (val) {
      this.page = 1;
    },
    selectedPeriods (val) {
      this.page = 1
    },
    selectedCategories (val) {
      this.page = 1
    }
  }
};
</script>

<style>
.v-card {
  border-radius: 8px;
}

.v-input .v-input__slot {
  border-radius: 50px;
}
</style>
