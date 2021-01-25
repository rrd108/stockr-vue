<template>
  <div class="small-12 columns content">
    <h3>{{ $t("stock rotation in the last 365 days") }}</h3>
    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">{{ $t("products") }} {{ searchResultsCount }}</th>

          <th scope="col" v-for="column in columns" :key="column.name" v-show="column.show" :rowspan="column.rowspan">{{ $t(column.name) }}</th>
        </tr>
        <tr>
          <td>
            <filter-input :search="'products.name'" placeholder="product" />
          </td>
          <td v-show="columns.find(column => column.name == 'code').show"><filter-input :search="'products.code'" placeholder="code" /></td>
          <td v-show="columns.find(column => column.name == 'size').show"><filter-input :search="'products.size'" placeholder="size" /></td>
          <td v-show="columns.find(column => column.name == 'stock').show" class="text-right">{{ sum('stock') | toNum }} {{ $t("pcs") }}</td>
          <td v-show="columns.find(column => column.name == 'purchases').show" class="text-right">{{ sum('purchases') | toNum }} {{ $t("pcs") }}</td>
          <td v-show="columns.find(column => column.name == 'sells').show" class="text-right">{{ sum('sells') | toNum }} {{ $t("pcs") }}</td>
          <td v-show="columns.find(column => column.name == 'runout').show" class="text-right">
            <input type="number" v-model="days">
            <i class="fi-filter" @click="showOnlyRunout = !showOnlyRunout"></i> {{$t('days')}}
          </td>
        </tr>
      </thead>
      <tbody
        is="filtered-tbody"
        :columns="columns"
        :days="days"
        :groups="[]"
        :products="products"
        :showOnlyRunout="showOnlyRunout"
        @setCount="setCount($event)"
      ></tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import FilterInput from '@/components/FilterInput'
import FilteredTbody from '@/components/FilteredProductTbody'

export default {
  name: "StockRotation",

  components: {
    FilterInput,
    FilteredTbody,
  },

  data() {
    return {
      columns: [
        {name: 'code', show: true},
        {name: 'size', show: true},
        {name: 'stock', show: true},
        {name: 'purchases', show: true},
        {name: 'sells', show: true},
        {name: 'runout', show: true},
      ],
      days: 365,
      products: [],
      searchResultsCount: 0,
      showFilter: false,
      showOnlyRunout: false,
    }
  },

  created() {
    axios.get(process.env.VUE_APP_API_URL + 'products/stock-rotation.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
      .then(response => this.products = response.data.rotation)
      .catch(err => console.error(err))
  },

  methods: {
    setCount(count) {
      this.searchResultsCount = count
    },
    sum(property) {
      return this.products.reduce(
        (sum, product) =>
          sum +
          (product.hidden || !product[property] ? 0 : parseInt(product[property])),
        0
      )
    },
  },
}
</script>

<style scoped>
</style>