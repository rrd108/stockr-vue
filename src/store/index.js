import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'

export default new Vuex.Store({
  state: {
    company: {},
    groups: [],
    invoices: [],
    invoicetypes: [],
    partners: [],
    products: [],
    storages: [],
    storageId: 0,
    search: {},
    user: {},
  },
  mutations: {
    addInvoice: (state, invoice) => state.invoices.unshift(invoice),
    addPartner: (state, partner) => state.partners.unshift(partner),
    addProduct: (state, product) => state.products.unshift(product),
    saveUser: (state, user) => state.user = user,
    setCompany: (state, company) => state.company = company,
    setGroups: (state, groups) => state.groups = groups,
    setInvoices: (state, invoices) => state.invoices = invoices,
    setInvoicetypes: (state, invoicetypes) => state.invoicetypes = invoicetypes,
    setPartners: (state, partners) => state.partners = partners,
    setProducts: (state, products) => state.products = products,
    setStorages: (state, storages) => state.storages = storages,
    setStorageId: (state, storageId) => state.storageId = storageId,
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
    updateProduct: (state, update) => {
      state.products.find(p => p.id == update.product.id)[update.property] = update.product[update.property]
    },
  },
  getters: {
    isLoggedIn: state => {
      let now = (new Date).getTime()
      let expired = 7 * 24 * 60 * 60 * 1000
      if ((now - state.user.lastLogin) > expired) {
        return false
      }
      return state.user.email ? true : false
    }
  },
  actions: {
    getGroups: ({ commit, state }) => {
      axios.get(process.env.VUE_APP_API_URL + 'groups.json?company=' + state.company.id + '&ApiKey=' + state.user.api_token)
        .then(response => commit('setGroups', response.data.groups))
        .catch(err => console.error(err))
    },
    getInvoices: ({ commit, state }) => {
      axios.get(process.env.VUE_APP_API_URL + 'invoices.json?company=' + state.company.id + '&ApiKey=' + state.user.api_token)
        .then(response => commit('setInvoices', response.data.invoices))
        .catch(err => console.error(err))
    },
    getInvoicetypes: ({ commit, state }) => {
      axios.get(process.env.VUE_APP_API_URL + 'invoicetypes.json?company=' + state.company.id + '&ApiKey=' + state.user.api_token)
        .then(response => commit('setInvoicetypes', response.data.invoicetypes))
        .catch(err => console.error(err))
    },
    getPartners: ({ commit, state }) => {
      axios.get(process.env.VUE_APP_API_URL + 'partners.json?company=' + state.company.id + '&ApiKey=' + state.user.api_token)
        .then(response => commit('setPartners', response.data.partners))
        .catch(err => console.error(err))
    },
    getProducts: ({ commit, state }) => {
      let products = {}
      axios.get(process.env.VUE_APP_API_URL + 'products/stock.json?company=' + state.company.id
        + '&currency=' + state.company.currency
        + '&ApiKey=' + state.user.api_token)
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
    getStorages: ({ commit, state }) => {
      axios.get(process.env.VUE_APP_API_URL + 'storages.json?company=' + state.company.id + '&ApiKey=' + state.user.api_token)
        .then(response => commit('setStorages', response.data.storages))
        .catch(err => console.error(err))
    },

  },
  modules: {
  }
})
