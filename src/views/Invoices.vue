<template>
  <div class="small-12 columns content">
    <div class="pagerHeader">
      <h3>{{ $t("invoices") }}</h3>
      <ul>
        <li v-for="month in months" :key="month" @click="selectedMonth = month">{{ month + 1 }}</li>
      </ul>
    </div>

    <div class="callout success" v-show="$route.params.newInvoice">
      <h5>{{ $route.params.newInvoice }} {{ $t("saved") }}</h5>
    </div>

    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">{{ $t("sale") }}</th>
          <th scope="col">{{ $t("number") }}</th>
          <th scope="col">{{ $t("date") }}</th>
          <th scope="col">{{ $t("partner") }}</th>
          <th scope="col">{{ $t("storage") }}</th>
          <th scope="col">{{ $t("invoice type") }}</th>
          <th scope="col" class="row">
            <span class="small-6">{{ $t("amount") }}</span>
            <span class="small-6 text-right">{{
              invoices.reduce(
                (sum, invoice) =>
                  sum + (invoice.hidden ? 0 : parseInt(invoice.amount)),
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
          <td><filter-input :search="'invoices.date'" :searchValue="getSelectedMonth" placeholder="date" /></td>
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
    </table>
  </div>
</template>

<script>
import FilterInput from "@/components/FilterInput.vue"
import FilteredTbody from "@/components/FilteredInvoiceTbody.vue"

export default {
  name: "Invoices",

  components: {
    FilterInput,
    FilteredTbody,
  },

  data() {
    return {
      months: [...Array(new Date().getMonth() + 1).keys()].reverse(),
      searchResultsCount: 0,
      selectedMonth: new Date().getMonth()
    }
  },

  computed: {
    getSelectedMonth() {
      const leadingZero = this.selectedMonth < 10 ? '0' : ''
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
    setCount(count) {
      this.searchResultsCount = count
    },
  },
}
</script>

<style scoped>
.pagerHeader {
  display: flex;
  justify-content: space-between;
}

.pagerHeader ul {
  display: flex;
  list-style: none;
}

.pagerHeader li {
  margin: 0 .5em;
  cursor: pointer;
  padding: 0 1em;
}
</style>