<template>
  <div class="small-12 columns content">
    <h3>Forgalom az elmúlt 365 napban</h3>
    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">Termék {{ searchResultsCount }}</th>

          <th scope="col" v-for="column in columns" :key="column.name" v-show="column.show" :rowspan="column.rowspan">
            {{ column.name }}
          </th>
        </tr>
        <tr>
          <td>
            <filter-input :search="'products.name'" placeholder="product" />
          </td>
          <td v-show="columns.find(column => column.name == 'code').show">
            <filter-input :search="'products.code'" placeholder="code" />
          </td>
          <td v-show="columns.find(column => column.name == 'size').show">
            <filter-input :search="'products.size'" placeholder="size" />
          </td>
          <td v-show="columns.find(column => column.name == 'stock').show" class="text-right">
            {{ toNum(sum('stock')) }} db
          </td>
          <td v-show="columns.find(column => column.name == 'purchases').show" class="text-right">
            {{ toNum(sum('purchases')) }} db
          </td>
          <td v-show="columns.find(column => column.name == 'sells').show" class="text-right">
            {{ toNum(sum('sells')) }} db
          </td>
          <td v-show="columns.find(column => column.name == 'profit').show" class="text-right">
            {{ toNum(sum('profit')) }}
          </td>
          <td v-show="columns.find(column => column.name == 'runout').show" class="text-right">
            <input type="number" v-model="days" />
            <i class="fi-filter" @click="showOnlyRunout = !showOnlyRunout"></i>
            nap
          </td>
          <td v-show="columns.find(column => column.name == 'runout').show" class="text-right">minimális rendelés</td>
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
  import toNum from '@/composables/useToNum'

  export default {
    name: 'StockRotation',

    components: {
      FilterInput,
      FilteredTbody,
    },

    data() {
      return {
        columns: [
          { name: 'code', show: true },
          { name: 'size', show: true },
          { name: 'stock', show: true },
          { name: 'purchases', show: true },
          { name: 'sells', show: true },
          { name: 'profit', show: true },
          { name: 'runout', show: true },
          { name: 'order', show: true },
        ],
        days: 365,
        products: [],
        searchResultsCount: 0,
        showFilter: false,
        showOnlyRunout: false,
      }
    },

    created() {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}products/stock-rotation.json?company=${this.$store.company.id}`,
          store.tokenHeader
        )
        .then(response => (this.products = response.data.rotation))
        .catch(err => console.error(err))
    },

    methods: {
      setCount(count) {
        this.searchResultsCount = count
      },
      sum(property) {
        return this.products.reduce(
          (sum, product) => sum + (product.hidden || !product[property] ? 0 : parseInt(product[property])),
          0
        )
      },
    },
  }
</script>

<style scoped></style>
