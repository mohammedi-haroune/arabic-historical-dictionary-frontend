import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import i18n from './vuei18n'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify, {
  /* theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }, */
  iconfont: 'mdi',
  lang: {
    locales: { },
    current: 'ar',
    t: (key, ...params) => i18n.t(key, params)
  },
  rtl: i18n.locale === 'ar',
  customProperties: true
})
