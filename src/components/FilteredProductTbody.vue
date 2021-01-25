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
      <td v-show="columns.find(column => column.name == 'purchases').show" class="text-right">{{product.purchases | toNum(1)}}</td>
      <td v-show="columns.find(column => column.name == 'sells').show" class="text-right">{{product.sells | toNum(1)}}</td>
      <td v-show="columns.find(column => column.name == 'runout').show" class="text-right" :class="{runout : (daysToRunout(product) < days)}">
        {{runout(product) | toLocaleDateString('hu-HU')}}
      </td>
      <td v-show="columns.find(column => column.name == 'avarage purchase price') && columns.find(column => column.name == 'avarage purchase price').show" class="text-right">{{product.avaragePurchasePrice | toCurrency}}</td>
      <td v-show="columns.find(column => column.name == 'last purchase price') && columns.find(column => column.name == 'last purchase price').show" class="text-right">{{product.lastPurchasePrice | toCurrency}}</td>
      <td v-show="columns.find(column => column.name == 'avarage purchase price') && columns.find(column => column.name == 'avarage purchase price').show"  class="text-right">{{product.stock * product.avaragePurchasePrice | toCurrency}}</td>
      <td v-show="columns.find(column => column.name == 'last purchase price') && columns.find(column => column.name == 'last purchase price').show"  class="text-right">{{product.stock * product.lastPurchasePrice | toCurrency}}</td>

      <td  v-for="column in groups" :key="column.name" v-show="column.show" class="text-center">{{(1 + (column.percentage / 100)) * product.lastPurchasePrice | toCurrency}}</td>
    </tr>
  </tbody>
</template>

<script>
import RowFilterMixin from '@/mixins/RowFilterMixin'

export default {
  name: 'FilteredTbody',

  props: {
    columns: {
      type: Array,
      required: true
    },
    days: {
      type: Number,
      required: false
    },
    groups: {
      type: Array,
      required: true
    },
    products: {
      type: Array,
      required: true
    },
  },

  mixins: [
    RowFilterMixin
  ],

  data() {
    return {
      model: 'products',
      sellDaysFromApi: 365
    }
  },

  methods: {
    daysToRunout(product) {
      let days = (this.runout(product) - new Date) / (1000*60*60*24)
      if (days <= 0) return 10 * this.days // where no sells we give back 10 * days
      return (this.runout(product) - new Date) / (1000*60*60*24)
    },
    runout(product) {
      if(product.sells == 0) {
        return ''
      }
      let runoutDate = new Date()
      let runoutDays = parseInt(product.stock / (-product.sells / this.sellDaysFromApi))
      runoutDate.setDate(runoutDate.getDate() + runoutDays)
      return runoutDate
    }
  }

}
</script>

<style scoped>
.runout {
  background: orange;
}
</style>