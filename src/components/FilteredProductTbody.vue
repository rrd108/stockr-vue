<template>
  <tbody>
    <tr v-for="product in filteredItems" :key="product.id">
      <td>
        <router-link :to="'products/' + product.id">
            <i class="fi-foot"> {{product.name}}</i>
        </router-link>
      </td>
      <td v-show="columns.find(column => column.name == 'code').show">{{product.code}}</td>
      <td v-show="columns.find(column => column.name == 'size').show">{{product.size}}</td>
      <td v-show="columns.find(column => column.name == 'stock').show" class="text-right">{{product.stock | toNum(1)}}</td>
      <td v-show="columns.find(column => column.name == 'sells').show" class="text-right">{{product.sells | toNum(1)}}</td>
      <td v-show="columns.find(column => column.name == 'avarage purchase price').show" class="text-right">{{product.avaragePurchasePrice | toCurrency}}</td>
      <td v-show="columns.find(column => column.name == 'last purchase price').show" class="text-right">{{product.lastPurchasePrice | toCurrency}}</td>
      <td v-show="columns.find(column => column.name == 'avarage purchase price').show"  class="text-right">{{product.stock * product.avaragePurchasePrice | toCurrency}}</td>
      <td v-show="columns.find(column => column.name == 'last purchase price').show"  class="text-right">{{product.stock * product.lastPurchasePrice | toCurrency}}</td>

      <td v-for="column in groups" :key="column.name" v-show="column.show" class="text-center">{{(1 + (column.percentage / 100)) * product.lastPurchasePrice | toCurrency}}</td>
    </tr>
  </tbody>
</template>

<script>
import RowFilterMixin from '@/mixins/RowFilterMixin'

export default {
  name: 'FilteredTbody',

  props: {
    products: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      model: 'products'
    }
  },

  mixins: [
    RowFilterMixin
  ],
}
</script>

<style scoped>
</style>