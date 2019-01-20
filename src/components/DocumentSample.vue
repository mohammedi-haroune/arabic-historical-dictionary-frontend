<i18n>
  en:
    message:
      title: "Mouii: Historical Dictionary"
      hello: "Hello World"
      period: "Period"
      category: "Category"
      author: "Author"
      content: "Content"
      stats: "Statistics"
  ar:
    message:
      title: "المعين: القاموس التاريخي"
      hello: "السلام عليكم"
      period: "الفترة الزمنية"
      category: "النوع"
      author: "الكاتب"
      content: "المحتوى"
      stats: "إحصائيات"
</i18n>

<template>
  <v-hover>
    <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 15 : 1}`">
      <v-card-title primary-title class="primary white--text">
        <v-avatar>
          <v-icon dark>mdi-file-document-box</v-icon>
        </v-avatar>
        <h3>{{ doc.name }}</h3>
      </v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile v-for="item in items" :key="item.title" avatar>
          <v-list-tile-avatar>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.value(doc) }}</v-list-tile-title>
            <!--v-list-tile-sub-title>{{ item.value(doc) }}</v-list-tile-sub-title-->
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <!--    <v-divider></v-divider>
    <v-card-text>
      {{ doc.sample }}
      </v-card-text>-->
      <v-card-actions>
        <v-layout>
          <v-flex xs6 ma-2>
            <v-btn router :to="'document/' + doc.id" block>{{ $t('message.content') }}</v-btn>
          </v-flex>
          <v-flex xs6 ma-2>
            <!-- <v-btn router :to="'dashboard'" block>{{ $t('message.stats' ) }}</v-btn> -->
            <v-btn @click="stats" block>{{ $t('message.stats' ) }}</v-btn>

            <v-dialog light scrollable lazy v-model="statsShow" v-if="statsShow">
              <v-card color="#FAFAFA">
                <v-toolbar>
                  <v-icon>mdi-cursor-text</v-icon>
                  <v-toolbar-title>{{ $t('message.stats') }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="statsShow = false">
                    <v-icon color="red">close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <DocumentStatistics :doc="doc"></DocumentStatistics>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import DocumentStatistics from "../components/DocumentStatistics";
export default {
  name: "DocumentSample",
  components: { DocumentStatistics },
  props: {
    doc: Object
  },
  data() {
    return {
      statsShow: false,
      items: [
        {
          title: "message.period",
          icon: "fa fa-clock",
          value(doc) {
            return doc["period"]["name"];
          }
        },
        {
          title: "message.category",
          icon: "fa fa-cubes",
          value(doc) {
            return doc["category"];
          }
        },
        {
          title: "message.author",
          icon: "edit",
          value(doc) {
            return doc["author"];
          }
        }
      ]
    };
  },
  methods: {
    stats() {
      this.statsShow = !this.statsShow;
    }
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
.v-dialog-custom {
  background-color: black;
}
</style>
