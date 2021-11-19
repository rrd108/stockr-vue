<template>
  <tbody>
    <tr
      v-for="product in filteredItems"
      :key="product.id"
      v-show="(showOnlyRunout && isRunout(product)) || !showOnlyRunout"
    >
      <td>
        <router-link :to="'products/' + product.id">
          <i class="fi-foot"> {{ product.name }}</i> {{ product.en_name }}
        </router-link>
      </td>

      <td v-show="columns.find(column => column.name == 'code').show">
        {{ product.code }}
      </td>

      <td v-show="columns.find(column => column.name == 'size').show">
        {{ product.size }}
      </td>

      <td
        v-show="columns.find(column => column.name == 'stock').show"
        class="text-right"
      >
        {{ product.stock | toNum(1) }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'purchases') &&
            columns.find(column => column.name == 'purchases').show
        "
        class="text-right"
      >
        {{ product.purchases | toNum(1) }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'sells') &&
            columns.find(column => column.name == 'sells').show
        "
        class="text-right"
      >
        {{ product.sells | toNum(1) }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'profit') &&
            columns.find(column => column.name == 'profit').show
        "
        class="text-right"
      >
        {{ profit(product) | toCurrency }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'runout') &&
            columns.find(column => column.name == 'runout').show
        "
        class="text-right"
        :class="{ runout: isRunout(product) }"
      >
        {{ runout(product) | toLocaleDateString('hu-HU') }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'runout') &&
            columns.find(column => column.name == 'runout').show
        "
        class="text-right"
        :class="{ runout: isRunout(product) }"
      >
        {{ -parseInt((product.sells / product.sellDays) * days) }}
        {{ products.lastPurchaseDate }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'avarage purchase price') &&
            columns.find(column => column.name == 'avarage purchase price').show
        "
        class="text-right"
      >
        {{ product.avaragePurchasePrice | toCurrency }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'last purchase price') &&
            columns.find(column => column.name == 'last purchase price').show
        "
        class="text-right"
      >
        {{ product.lastPurchasePrice | toCurrency }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'avarage purchase price') &&
            columns.find(column => column.name == 'avarage purchase price').show
        "
        class="text-right"
      >
        {{ (product.stock * product.avaragePurchasePrice) | toCurrency }}
      </td>

      <td
        v-show="
          columns.find(column => column.name == 'last purchase price') &&
            columns.find(column => column.name == 'last purchase price').show
        "
        class="text-right"
      >
        {{ (product.stock * product.lastPurchasePrice) | toCurrency }}
      </td>

      <td
        v-for="column in groups"
        :key="column.name"
        v-show="column.show"
        class="text-center"
      >
        {{
          ((1 + column.percentage / 100) * product.lastPurchasePrice)
            | toCurrency
        }}
      </td>
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
    showOnlyRunout: {
      type: Boolean,
      required: false
    }
  },

  mixins: [RowFilterMixin],

  data() {
    return {
      model: 'products'
    }
  },

  methods: {
    isRunout(product) {
      if (product.sells >= 0) {
        // sells can be positive number if we get back products
        return false
      }
      return (this.runout(product) - new Date()) / (1000 * 60 * 60 * 24) <=
        this.days
        ? true
        : false
    },
    profit(product) {
      let productFromStore = this.$store.state.products.find(
        p => p.id == product.id
      )
      return (
        product.sellsIncome -
        productFromStore.lastPurchasePrice * -1 * product.sells
      )
    },
    runout(product) {
      if (product.stock <= 0) {
        return new Date()
      }
      if (product.sells < 0) {
        let runoutDate = new Date()
        let runoutDays = parseInt(
          product.stock / (-product.sells / product.sellDays)
        )
        runoutDate.setDate(runoutDate.getDate() + runoutDays)
        return runoutDate
      }
      return ''
    }
  }
}
</script>

<style scoped>
.runout {
  background: orange;
}
</style>
