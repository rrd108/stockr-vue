<template>
  <div class="small-12 columns content">
    <div class="pagerHeader">
      <h3>{{ $t('invoices') }}</h3>
      <ul>
        <li
          v-for="month in months"
          :key="month"
          @click="selectMonth(month)"
          :class="{ active: selectedMonth == month }"
        >
          {{ monthName(month) }}
        </li>
        <li>
          <select v-model="past" @change="getPast">
            <option value="2021">2021</option>
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
      <h5>{{ $route.params.newInvoice }} {{ $t('saved') }}</h5>
    </div>

    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">{{ $t('sale') }}</th>
          <th scope="col">{{ $t('number') }}</th>
          <th scope="col">{{ $t('date') }}</th>
          <th scope="col">{{ $t('partner') }}</th>
          <th scope="col">{{ $t('storage') }}</th>
          <th scope="col">{{ $t('invoice type') }}</th>
          <th scope="col" class="row">
            <span class="small-6">{{ $t('amount') }}</span>
            <span class="small-6 text-right">{{
              invoices.reduce(
                (sum, invoice) =>
                  sum +
                  (invoice.hidden || invoice.status == 'd'
                    ? 0
                    : parseInt(invoice.amount)),
                0
              ) | toCurrency
            }}</span>
          </th>
        </tr>
        <tr>
          <td>{{ searchResultsCount }}</td>
          <td>
            <filter-input :search="'invoices.number'" placeholder="number" />
          </td>
          <td>
            <filter-input
              :search="'invoices.date'"
              :searchValue="getSelectedMonth"
              placeholder="date"
            />
          </td>
          <td>
            <filter-input
              :search="'invoices.partner.name'"
              placeholder="partner"
            />
          </td>
          <td>
            <filter-input
              :search="'invoices.storage.name'"
              placeholder="storage"
            />
          </td>
          <td>
            <filter-input
              :search="'invoices.invoicetype.name'"
              placeholder="invoice type"
            />
          </td>
          <td class="text-right">
            <filter-input :search="'invoices.amount'" placeholder="amount" />
          </td>
        </tr>
      </thead>
      <tbody
        is="filtered-tbody"
        :invoices="invoices"
        @setCount="setCount($event)"
      ></tbody>
      <infinite-loading @infinite="loadInvoices" />
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'
import FilterInput from '@/components/FilterInput.vue'
import FilteredTbody from '@/components/FilteredInvoiceTbody.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Invoices',

  components: {
    FilterInput,
    FilteredTbody,
    InfiniteLoading,
  },

  data() {
    return {
      months: [...Array(new Date().getMonth() + 1).keys()].reverse(),
      past: '',
      searchResultsCount: 0,
      selectedMonth: new Date().getMonth(),
    }
  },

  computed: {
    ...mapGetters(['invoiceMonths']),
    getSelectedMonth() {
      const leadingZero = this.selectedMonth < 9 ? '0' : ''
      return `-${leadingZero}${this.selectedMonth + 1}-`
    },
    invoices() {
      return this.$store.state.invoices.map((invoice) => ({
        ...invoice,
        amount: (invoice.amount = invoice.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )),
      }))
    },
  },

  methods: {
    loadInvoices() {
      if (this.invoices.length > 10) {
        this.selectMonth(this.selectedMonth - 1)
      }
    },
    monthName(month) {
      let date = new Date()
      let firstDay = new Date(date.getFullYear(), month, 1)
      return firstDay.toLocaleString('default', { month: 'long' })
    },
    setCount(count) {
      this.searchResultsCount = count
    },
    selectMonth(month) {
      this.selectedMonth = month
      // TODO go back to other years
      const year = new Date().getFullYear()
      if (
        this.invoiceMonths.findIndex(
          (invoiceMonth) =>
            invoiceMonth == `${year}${this.getSelectedMonth}`.slice(0, -1)
        ) == -1
      ) {
        // the selected month is not yet in the store, get it from the API
        this.getInvoices(year, month + 1)
      }
    },
    getInvoices(year, month) {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}invoices.json?company=${this.$store.state.company.id}&ApiKey=${this.$store.state.user.api_token}&year=${year}&month=${month}`
        )
        .then((response) =>
          this.$store.commit('addInvoices', response.data.invoices)
        )
        .catch((err) => console.error(err))
    },
    getPast() {
      this.$store.commit('setInvoices', [])
      this.getInvoices(2021, this.past)
    },
  },
}
</script>

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
