import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'

export const useStockrStore = defineStore('stockrStore', () => {
  const company = ref({})
  const groups = []
  const invoices = ref([])
  const invoicetypes = []
  const partners = []
  const products = ref([])
  const storages = []
  const storageId = 0
  const search = ref({})
  const user = ref({})

  const isLoggedIn = computed(() => {
    if (!user.value.id) return false

    let now = new Date().getTime()
    let expired = 7 * 24 * 60 * 60 * 1000
    if (now - user.value.lastLogin > expired) {
      user.value = {}
      return false
    }
    return true
  })

  const isBaseDataLoaded = ref(false)

  const invoiceMonths = () => [...new Set(invoices.value.map(invoice => invoice.date.substr(0, 7)))]

  const getBaseData = () => {
    if (!user.value.api_token) console.error('No API token')
    getGroups()
    getInvoices()
    getInvoicetypes()
    getPartners()
    getProducts()
    getStorages()
    isBaseDataLoaded.value = true
  }

  const tokenHeader = computed(() => ({ headers: { Token: user.value.token } }))

  const getGroups = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'groups.json?company=' + company.value.id, tokenHeader.value)
      .then(response => groups.push(...response.data.groups))
      .catch(err => console.error(err))

  const getInvoices = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'invoices.json?company=' + company.value.id, tokenHeader.value)
      .then(response => (invoices.value = response.data.invoices))
      .catch(err => console.error(err))

  const getInvoicetypes = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'invoicetypes.json?company=' + company.value.id, tokenHeader.value)
      .then(response => invoicetypes.push(...response.data.invoicetypes))
      .catch(err => console.error(err))

  const getPartners = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'partners.json?company=' + company.value.id, tokenHeader.value)
      .then(response => partners.push(...response.data.partners))
      .catch(err => console.error(err))

  const getProducts = () =>
    axios
      .get(
        import.meta.env.VITE_API_URL +
          'products/stock.json?company=' +
          company.value.id +
          '&currency=' +
          company.value.currency,
        tokenHeader.value
      )
      .then(
        resp =>
          (products.value = resp.data.products.map(product => ({
            ...product,
            hidden: false,
          })))
      )
      .catch(err => console.error(err))

  const getStorages = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'storages.json?company=' + company.value.id, tokenHeader.value)
      .then(response => storages.push(...response.data.storages))
      .catch(err => console.error(err))

  return {
    company,
    groups,
    invoices,
    invoicetypes,
    partners,
    products,
    storages,
    storageId,
    search,
    user,
    isLoggedIn,
    isBaseDataLoaded,
    tokenHeader,
    invoiceMonths,
    getBaseData,
  }
})
