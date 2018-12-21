<i18n>
  en:
    message:
      title: "Mouii: Historical Dictionary"
      hello: "Hello World"
  ar:
    message:
      title: "المعين: القاموس التاريخي"
      hello: "السلام عليكم"
</i18n>

<template>
  <v-app :dark="isDark">
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      :right="rtl"
      fixed
      app
    >
      <v-list>
        <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
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
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.native.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.native.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.native.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
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
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
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
      items: [
        { icon: "apps", title: "Welcome", to: "/welcome" },
        { icon: "create", title: "Corpus", to: "/corpus" },
        { icon: "bubble_chart", title: "Inspire", to: "/inspire" },
        { icon: "explore", title: "Corpus Browser", to: "/browser" },
        { icon: "edit", title: "Add Entry", to: "/entry" },
        { icon: "check", title: "Corpus Selection", to: "/select" },
        { icon: "fa fa-book", title: "Dictionaries", to: "/dictionary" },
        { icon: "fa fa-book-open", title: "Dictionaries2", to: "/dictionary2" },
        { icon: "fa fa-chart-bar", title: "Graphs", to: "/graphs" },
        { icon: "fa fa-info-circle", title: "About", to: "/about" },
        { icon: "fa fa-info-circle", title: "Dashboard", to: "/dashboard" }
      ],
      clipped: false,
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
    rtl() {
      return this.$vuetify.rtl;
    }
  },
  mounted() {
    this.$store.dispatch("getPeriods");
    this.$store.dispatch("getCategories");
    this.$store.dispatch("getPostags");
    this.$store.dispatch("getDicts");
    Vue.use(Vuetify, {
      theme: {
        primary: "#3f51b5",
        secondary: "#b0bec5",
        accent: "#8c9eff",
        error: "#b71c1c"
      }
    });
  }
};
</script>
