<i18n>
  en:
    message:
      title: "Mouii: Historical Dictionary"
      hello: "Hello World"
  ar:
    message:
      title: "المعين: القاموس التاريخي"
      hello: "السلام عليكم"
      welcome: "السلام عليكم"
      corpus: "أضف الملفات"
      browser: "تصفح الملفات"
      add_entry: "أضف مصلح"
      dict: "القاموس"
      graphs: "الإحصائيات"
      hist_dict: "القاموس التاريخي"
      check: "مراجعة الأمثلة"
      about: "من نحن ؟"
</i18n>

<template>
  <v-app :dark="isDark">
    <v-navigation-drawer :mini-variant="miniVariant" v-model="drawer" :right="rtl" fixed app>
      <v-list>
        <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
          <v-list-tile-action>
            <v-icon :color="colors[i]" v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.native.stop="miniVariant = !miniVariant">
        <v-icon v-html="chevron"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="$t('message.title')"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-navigation-drawer temporary :right="!rtl" v-model="rightDrawer" fixed>
      <v-list subheader>
        <v-subheader>Appearance</v-subheader>
        <v-list-tile @click="isDark = !isDark">
          <v-list-tile-action>
            <v-btn icon>
              <v-icon :color="isDark ? 'white' : 'black'">invert_colors</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Invert Colors</v-list-tile-title>
            <v-list-tile-sub-title>Use {{isDark ? 'Light': 'Dark'}} Theme</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        "cyan lighten-1",
        "purple lighten-2",
        "amber lighten-1",
        "cyan lighten-1",
        "red lighten-1",
        "green lighten-1",
        "blue lighten-1",
        "amber lighten-1"
      ],
      items: [
        { icon: "apps", title: this.$t("message.welcome"), to: "/welcome" },
        { icon: "create", title: this.$t("message.corpus"), to: "/corpus" },
        { icon: "explore", title: this.$t("message.browser"), to: "/browser" },
        { icon: "edit", title: this.$t("message.add_entry"), to: "/entry" },
        {
          icon: "fa fa-book",
          title: this.$t("message.dict"),
          to: "/dictionary"
        },
        {
          icon: "fa fa-book-open",
          title: this.$t("message.hist_dict"),
          to: "/dictionary2"
        },
        {
          icon: "fa fa-bookmark",
          title: this.$t("message.check"),
          to: "/check"
        },
        {
          icon: "fa fa-chart-bar",
          title: this.$t("message.graphs"),
          to: "/dashboard"
        },
        {
          icon: "fa fa-info-circle",
          title: this.$t("message.about"),
          to: "/about"
        }
      ],
      drawer: true,
      fixed: false,
      miniVariant: false,
      rightDrawer: false,
      isDark: false,
      locale: this.$i18n.locale
    };
  },
  watch: {
    "$i18n.locale"(val) {
      this.$vuetify.rtl = val === "ar";
      this.$vuetify.lang = val;
    },
    "$veutify.lang"(val) {
      this.$i18n.locale = val;
      this.$vuetify.rtl = val === "ar";
    }
  },
  computed: {
    chevron() {
      if (this.miniVariant) {
        if (this.rtl) return "chevron_left";
        else return "chevron_right";
      } else {
        if (this.rtl) return "chevron_right";
        else return "chevron_left";
      }
    },
    rtl() {
      return this.$vuetify.rtl;
    }
  },
  mounted() {
    this.$store.dispatch("getPeriods");
    this.$store.dispatch("getCategories");
    this.$store.dispatch("getPostags");
    this.$store.dispatch("getDicts");
  }
};
</script>
