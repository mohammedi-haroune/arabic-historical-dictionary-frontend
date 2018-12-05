import Vue from 'vue'
import Vuex from 'vuex'
import $bakcend from './backend'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    periods: Array,
    categories: Array,
    postags: Array,
    dictionaries: Array
  },
  mutations: {
    setPeriods (state, periods) {
      state.periods = periods.results
    },
    setCategories (state, categories) {
      state.categories = categories
    },
    setPostags (state, postags) {
      state.postags = postags
    },
    setDicts (state, dictionaries) {
      state.dictionaries = dictionaries.results
    }
  },
  actions: {
    getPeriods (context) {
      $bakcend.$getPeriods()
        .then(periods => context.commit('setPeriods', periods))
    },
    getCategories (context) {
      $bakcend.$getCategories()
        .then(categories => context.commit('setCategories', categories))
    },
    getDicts (context) {
      $bakcend.$getDicts()
        .then(dicts => context.commit('setDicts', dicts))
    },
    getPostags (context) {
      $bakcend.$getPostags()
        .then(postags => {
          context.commit('setPostags', postags)
        })
    }
  }
})
