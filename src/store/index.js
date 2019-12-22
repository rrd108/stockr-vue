import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'

export default new Vuex.Store({
  state: {
    company: {},
    invoices: [],
    products: {},
    search: {},
    user: {},
  },
  mutations: {
    addInvoice: (state, invoice) => state.invoices.unshift(invoice),
    saveUser: (state, user) => state.user = user,
    setCompany: (state, company) => state.company = company,
    setInvoices: (state, invoices) => state.invoices = invoices,
    setProducts: (state, products) => state.products = products,
    setSearch: (state, search) => {
      // this will not work as we would add new property to the object, so we would loose reactivity
      // state.search[search.field] = search.val
      let tmp = {}
      tmp[search.field] = search.val
      state.search = { ...state.search, ...tmp }
    },
    removeUser: (state) => state.user = {},
    unsetCompany: (state) => {
      state.company = {}
      localStorage.removeItem('company')
    },
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
    },
    getInvoices: ({ commit, state }) => {
      axios.get(process.env.VUE_APP_API_URL + 'invoices.json?company=' + state.company.id + '&ApiKey=' + state.user.api_token)
        .then(response => commit('setInvoices', response.data.invoices))
        .catch(err => console.error(err))
    }
  },
  modules: {
  }
})
