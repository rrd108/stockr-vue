import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    company: {},
    search: {},
  },
  mutations: {
    saveUser(state, user) {
      state.user = user
    },
    removeUser(state) {
      state.user = {}
    },
    setCompany(state, company) {
      state.company = company
    },
    unsetCompany(state) {
      state.company = {}
      localStorage.removeItem('company')
    },
    setSearch(state, search) {
      // this will not work as we would add new property to the object, so we would loose reactivity
      // state.search[search.field] = search.val
      let tmp = {}
      tmp[search.field] = search.val
      state.search = { ...state.search, ...tmp }
    },
  },
  actions: {
  },
  modules: {
  }
})
