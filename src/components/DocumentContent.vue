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
      more: "اقرأ المزيد"
      example:
        add: "إضافة مثال تاريخي"
</i18n>
<template>
  <v-container fluid>
    <v-layout>
      <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
      <transition
        name="custom-classes-transition"
        mode="out-in"
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <v-speed-dial
          v-show="this.selected.sentence && !dialog"
          v-model="fab"
          left
          bottom
          fixed
          disabled
          direction="top"
          transition="slide-y-reverse-transition"
        >
          <v-btn slot="activator" color="primary" fab>
            <v-icon v-if="fab">close</v-icon>
            <v-icon v-else>apps</v-icon>
          </v-btn>
          <v-btn fab dark small color="green">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn fab dark small @click="log" color="indigo">
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn fab dark small @click="stats" color="red">
            <v-icon>search</v-icon>
          </v-btn>
        </v-speed-dial>
      </transition>
    </v-layout>
    <v-layout>
      <v-dialog scrollable lazy v-model="dialog" v-if="dialog">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.example.add') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <new-entry :example_to_insert="selected_example"></new-entry>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog scrollable lazy v-model="statdialog" v-if="statdialog">
        <v-card>
          <v-toolbar>
            <v-icon>mdi-cursor-text</v-icon>
            <v-toolbar-title>{{ $t('message.example.add') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="statdialog = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <graphs :sents="selected_example"></graphs>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout align-center justify-space-between row fill-height>
      <v-flex v-if="loading" pa-5 ma-5 xs10 text-xs-center>
        <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
      </v-flex>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 15 : 1}`" width="100%">
          <v-card-title primary-title class="primary white--text">
            <v-flex v-for="item in items" :key="item.title">
              <p class="title" :key="item.title">
                <v-icon dark size="40px">{{ item.icon }}</v-icon>
                {{ item.value }}
              </p>
            </v-flex>
          </v-card-title>

          <v-divider></v-divider>
          <v-card-text>
            <p
              :key="sent.position"
              :id="sent.position"
              v-for="sent in sents"
            >{{ sent.sentence.join(' ') }}</p>
            <v-flex v-if="loading_sents" ma-5 xs10 text-xs-center>
              <v-progress-circular :size="50" :width="5" color="primary" indeterminate></v-progress-circular>
            </v-flex>
            <v-flex v-else-if="more_pages" xs-text-center xs10>
              <v-btn @click="fetchSentences">{{ $t('message.more') }}</v-btn>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-layout>
  </v-container>
</template>

<script>
import $backend from "../backend";
import NewEntry from "../components/NewEntry";
import Graphs from "../components/Graphs";
export default {
  name: "DocumentContent",
  components: { NewEntry, Graphs },
  props: ["id"],
  data() {
    return {
      doc: null,
      sents: [],
      fab: false,
      selected: {
        position: -1,
        sentence: "",
        document: -1
      },
      dialog: false,
      statdialog: false,
      loading: false,
      loading_sents: false,
      pages: 0,
      loaded_pages: 0,
      limit_initial_pages: 5
    };
  },
  computed: {
    items: function() {
      return [
        {
          title: "message.name",
          icon: "mdi-file-document-box",
          value: this.doc.name
        },
        {
          title: "message.period",
          icon: "fa fa-clock",
          value: this.doc.period.name
        },
        {
          title: "message.category",
          icon: "fa fa-cubes",
          value: this.doc.category
        },
        { title: "message.author", icon: "edit", value: this.doc.author }
      ];
    },
    selected_example: function() {
      return {
        documents: [this.doc],
        document: this.doc.id,
        sents: [this.selected],
        sentences: [0],
        sentence: "",
        periods: [this.doc.period],
        period: this.doc.period.id,
        categories: [this.doc.category],
        category: this.doc.category,
        confirmed: true
      };
    },
    more_pages() {
      return this.pages > this.loaded_pages;
    }
  },
  created() {
    this.getDocument();
  },
  methods: {
    async getDocument() {
      this.loading = true;
      this.doc = await $backend.$getDocument(this.id);
      this.loading = false;
      while (this.loaded_pages <= this.limit_initial_pages) {
        this.fetchSentences();
      }
    },
    async fetchSentences() {
      this.loading_sents = true;
      this.loaded_pages = this.loaded_pages + 1;
      const res = await $backend.$getDocumentSentences(
        this.id,
        this.loaded_pages
      );
      this.pages = Math.floor(res.count / 12);
      this.sents = this.sents.concat(res.results);
      this.loading_sents = false;
    },
    log() {
      console.log("adding example", this.selected_example);
      this.dialog = !this.dialog;
    },
    stats() {
      this.statdialog = !this.statdialog;
    },
    scrolling(e) {
      console.log(e.target.scrollTop);
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.fetchSentences();
      }
    }
  },
  mounted() {
    const self = this;
    document.onmouseup = document.onkeyup = document.onselectionchange = function() {
      let text = "";
      let id = -1;
      if (window.getSelection) {
        text = window.getSelection().toString();
        id = window.getSelection().baseNode.parentNode.id;
        console.log("id", id);
      } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
      }
      if (text.trim() === "") {
        this.fab = false;
      }
      self.selected = {
        position: id,
        document: self.doc.id,
        sentence: text.trim()
      };
      console.log("selected", self.selected);
    };
  },
  watch: {
    selected(val) {
      if (val.sentence === "") {
        console.log("fab closing");
        this.fab = false;
      }
    }
  }
};
</script>

<style>
.v-card {
  border-radius: 10px;
}
</style>
