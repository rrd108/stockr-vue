<script setup>
  import { computed, ref, watch } from 'vue'
  import axios from 'axios'
  import FilterInput from '@/components/FilterInput.vue'
  import FilteredTbody from '@/components/FilteredInvoiceTbody.vue'
  import toCurrency from '@/composables/useToCurrency'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()

  const months = [...Array(new Date().getMonth() + 1).keys()].reverse()
  const past = new Date().getMonth() + 1
  const searchResultsCount = 0
  const searchTerms = ref({})
  const selectedMonth = new Date().getMonth()
  const year = new Date().getFullYear()

  const getSelectedMonth = computed(() => {
    const leadingZero = selectedMonth < 9 ? '0' : ''
    return `-${leadingZero}${selectedMonth + 1}-`
  })

  const invoices = store.invoices.map(invoice => ({
    ...invoice,
    amount: (invoice.amount = invoice.items.reduce((total, item) => total + item.price * item.quantity, 0)),
  }))

  const filteredInvoices = ref(invoices)

  watch(
    () => searchTerms.value,
    () => {
      if (!Object.keys(searchTerms.value).length) {
        return
      }

      filteredInvoices.value = invoices.filter(invoice => {
        for (const key in searchTerms.value) {
          if (!searchTerms.value[key]) {
            continue
          }

          let invoiceKey = key.split('_')
          let invoiceProp
          if (invoiceKey.length == 1) {
            invoiceProp = invoice[invoiceKey]
          } else {
            invoiceProp = invoice[invoiceKey[0]][invoiceKey[1]]
          }

          if (typeof invoiceProp === 'number') {
            invoiceProp = invoiceProp.toString()
          }

          if (key == 'sale') {
            if ((invoiceProp && searchTerms.value.sale == 'b') || (!invoiceProp && searchTerms.value.sale == 'k')) {
              return true
            }
            return false
          }

          if (!invoiceProp.toLowerCase().includes(searchTerms.value[key])) {
            return false
          }
        }

        return true
      })
    },
    { deep: true }
  )

  const loadInvoices = () => {
    if (invoices.length > 10) {
      selectMonth(selectedMonth - 1)
    }
  }

  const monthName = month => {
    let firstDay = new Date(year, month, 1)
    return firstDay.toLocaleString('default', { month: 'long' })
  }

  const setCount = count => {
    searchResultsCount = count
  }

  const selectMonth = month => {
    selectedMonth = month
    if (store.invoiceMonths.findIndex(invoiceMonth => invoiceMonth == `${year}${getSelectedMonth}`.slice(0, -1)) == -1) {
      // the selected month is not yet in the store, get it from the API
      getInvoices(month + 1)
    }
  }

  const getInvoices = month => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}invoices.json?company=${store.company.id}&ApiKey=${
          store.user.api_token
        }&year=${year}&month=${month}`
      )
      .then(response => store.addInvoices(response.data.invoices))
      .catch(err => console.error(err))
  }

  const getPast = () => {
    store.invoices = []
    getInvoices(past)
  }
</script>

<template>
  <div class="small-12 columns content">
    <div class="pagerHeader">
      <h3>Bizonylat</h3>
      <ul>
        <li v-for="month in months" :key="month" @click="selectMonth(month)" :class="{ active: selectedMonth == month }">
          {{ monthName(month) }}
        </li>
        <li>
          <select v-model="year" @change="getPast">
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </li>
        <li>
          <select v-model="past" @change="getPast">
            <option value="12">december</option>
            <option value="11">november</option>
            <option value="10">október</option>
            <option value="9">szeptember</option>
            <option value="8">augusztus</option>
            <option value="7">július</option>
            <option value="6">június</option>
            <option value="5">május</option>
            <option value="4">április</option>
            <option value="3">március</option>
            <option value="2">február</option>
            <option value="1">január</option>
          </select>
        </li>
      </ul>
    </div>

    <div class="callout success" v-show="$route.params.newInvoice">
      <h5>{{ $route.params.newInvoice }} elmentve</h5>
    </div>

    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">Eladás</th>
          <th scope="col">Szám</th>
          <th scope="col">Dátum</th>
          <th scope="col">Partner</th>
          <th scope="col">Raktár</th>
          <th scope="col">Bizonylat típus</th>
          <th scope="col" class="row">
            <span class="small-6"> Összeg </span>
            <span class="small-6 text-right">
              {{
                toCurrency(
                  invoices.reduce(
                    (sum, invoice) => sum + (invoice.hidden || invoice.status == 'd' ? 0 : parseInt(invoice.amount)),
                    0
                  )
                )
              }}
            </span>
          </th>
        </tr>
        <tr>
          <td class="thin"><FilterInput v-model="searchTerms.sale" placeholder="b/k" /></td>
          <td>
            <FilterInput v-model="searchTerms.number" placeholder="szám" />
          </td>
          <td>
            <FilterInput v-model="searchTerms.date" :searchValue="getSelectedMonth" placeholder="dátum" />
          </td>
          <td>
            <FilterInput v-model="searchTerms.partner_name" placeholder="partner" />
          </td>
          <td>
            <FilterInput v-model="searchTerms.storage_name" placeholder="raktár" />
          </td>
          <td>
            <FilterInput v-model="searchTerms.invoicetype_name" placeholder="típus" />
          </td>
          <td class="text-right">
            <FilterInput v-model="searchTerms.amount" placeholder="összeg" />
          </td>
        </tr>
      </thead>
      <FilteredTbody :invoices="filteredInvoices" @setCount="setCount($event)" />
      <!-- TODO infinite-loading @infinite="loadInvoices" /-->
    </table>
  </div>
</template>

<style scoped>
  thead th {
    position: sticky;
    top: 0;
    background-color: #ddd;
  }
  .pagerHeader {
    display: flex;
    justify-content: space-between;
  }

  .pagerHeader ul {
    display: flex;
    list-style: none;
    font-size: 0.85rem;
  }

  select {
    margin: auto;
    padding: auto;
    line-height: normal;
  }

  .pagerHeader li {
    margin: 0 0.5em;
    cursor: pointer;
    padding: 0.5em 1em;
  }

  .pagerHeader li.active {
    color: #fff;
    background-color: #2c83b6;
    border-radius: 1em;
  }
</style>
