import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    company: {},
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
  },
  actions: {
  },
  modules: {
  }
})
