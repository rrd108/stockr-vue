import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'

export const useStockrStore = defineStore('stockrStore', () => {
  const company = ref({})
  const groups = []
  const invoices = ref([])
  const invoicetypes = []
  const partners = []
  const products = []
  const storages = []
  const storageId = 0
  const search = ref({})
  const user = ref({})

  const isLoggedIn = computed(() => {
    if (!user.value.id) return false

    let now = new Date().getTime()
    let expired = 7 * 24 * 60 * 60 * 1000
    if (now - user.value.lastLogin > expired) {
      return false
    }
    return user.value.email ? true : false
  })

  const invoiceMonths = () => [...new Set(invoices.value.map(invoice => invoice.date.substr(0, 7)))]

  const getGroups = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'groups.json?company=' + company.value.id + '&ApiKey=' + user.value.api_token)
      .then(response => groups.push(...response.data.groups))
      .catch(err => console.error(err))

  const getInvoices = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'invoices.json?company=' + company.value.id + '&ApiKey=' + user.value.api_token)
      .then(response => (invoices.value = response.data.invoices))
      .catch(err => console.error(err))

  const getInvoicetypes = () =>
    axios
      .get(
        import.meta.env.VITE_API_URL + 'invoicetypes.json?company=' + company.value.id + '&ApiKey=' + user.value.api_token
      )
      .then(response => invoicetypes.push(...response.data.invoicetypes))
      .catch(err => console.error(err))

  const getPartners = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'partners.json?company=' + company.value.id + '&ApiKey=' + user.value.api_token)
      .then(response => partners.push(...response.data.partners))
      .catch(err => console.error(err))

  const getProducts = () =>
    axios
      .get(
        import.meta.env.VITE_API_URL +
          'products/stock.json?company=' +
          company.value.id +
          '&currency=' +
          company.value.currency +
          '&ApiKey=' +
          user.value.api_token
      )
      .then(resp => {
        products.push(
          ...resp.data.products.forEach(product => {
            product.hidden = false
          })
        )
      })
      .catch(err => console.error(err))

  const getStorages = () =>
    axios
      .get(import.meta.env.VITE_API_URL + 'storages.json?company=' + company.value.id + '&ApiKey=' + user.value.api_token)
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
    invoiceMonths,
    getGroups,
    getInvoices,
    getInvoicetypes,
    getPartners,
    getProducts,
    getStorages,
  }
})
