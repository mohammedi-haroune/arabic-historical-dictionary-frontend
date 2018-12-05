import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
// thie styl file should be imported after vuetify to made chagnes on style variables
import './stylus/vuetify.styl'
import App from './App.vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import i18n from './plugins/vuei18n'
import './plugins/element_ui'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
