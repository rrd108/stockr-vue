import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'

export default new Vuex.Store({
  state: {
    company: {},
    products: {},
    search: {},
    user: {},
  },
  mutations: {
    setCompany: (state, company) => state.company = company,
    unsetCompany: (state) => {
      state.company = {}
      localStorage.removeItem('company')
    },
    setProducts: (state, products) => state.products = products,
    setSearch: (state, search) => {
      // this will not work as we would add new property to the object, so we would loose reactivity
      // state.search[search.field] = search.val
      let tmp = {}
      tmp[search.field] = search.val
      state.search = { ...state.search, ...tmp }
    },
    saveUser: (state, user) => state.user = user,
    removeUser: (state) => state.user = {},
  },
  actions: {
    getProducts: ({ commit, state }) => {
      let products = {}
      axios.get(process.env.VUE_APP_API_URL + 'products/stock.json?company=' + state.company.id + '&ApiKey=' + state.user.api_token)
        .then(resp => {
          products = resp.data.products
          products.forEach((product) => {
            product.hidden = false
          })
          return products
        })
        .then(products => commit('setProducts', products))
        .catch(err => console.error(err))
    }
  },
  modules: {
  }
})
