<template>
  <div class="small-12 columns content">
    <h3>
      {{ $t('products') }}
      <i class="fi-filter" @click="showFilter = !showFilter"></i>
    </h3>
    <div v-show="showFilter">
      <ul>
        <li
          v-for="column in columns"
          :key="column.name"
          @click="column.show = !column.show"
          :class="{ inactive: !column.show }"
        >
          <i class="fi-eye"></i> {{ $t(column.name) }}
        </li>

        <li
          v-for="column in groups"
          :key="column.name"
          @click="column.show = !column.show"
          :class="{ inactive: !column.show }"
        >
          <i class="fi-eye"></i> {{ $t(column.name) }}
        </li>
      </ul>
    </div>
    <h4><input type="date" v-model.lazy="stockDate" @blur="getStock" /></h4>
    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">{{ $t('products') }} {{ searchResultsCount }}</th>

          <th
            scope="col"
            v-for="column in columns"
            :key="column.name"
            v-show="column.show"
            :rowspan="column.rowspan"
          >
            {{ $t(column.name) }}
          </th>

          <th
            v-show="
              columns.find((column) => column.name == 'avarage purchase price')
                .show
            "
            scope="col"
          >
            {{ $t('amount') }}
          </th>
          <th
            v-show="
              columns.find((column) => column.name == 'last purchase price')
                .show
            "
            scope="col"
          >
            {{ $t('amount') }}
          </th>

          <th
            scope="col"
            v-for="column in groups"
            :key="column.name"
            v-show="column.show"
            :rowspan="column.rowspan"
          >
            {{ $t(column.name) }}
          </th>
        </tr>
        <tr>
          <td>
            <filter-input :search="'products.name'" placeholder="product" />
          </td>
          <td v-show="columns.find((column) => column.name == 'code').show">
            <filter-input :search="'products.code'" placeholder="code" />
          </td>
          <td v-show="columns.find((column) => column.name == 'size').show">
            <filter-input :search="'products.size'" placeholder="size" />
          </td>
          <td
            v-show="columns.find((column) => column.name == 'stock').show"
            class="text-right"
          >
            {{ toNum(stock) }} {{ $t('pcs') }}
          </td>
          <td
            v-show="columns.find((column) => column.name == 'sells').show"
            class="text-right"
          >
            {{ toNum(sells) }} {{ $t('pcs') }}
          </td>
          <td
            v-show="
              columns.find((column) => column.name == 'avarage purchase price')
                .show
            "
            class="text-right"
          >
            {{
              toCurrency(
                products.reduce(
                  (sum, product) =>
                    sum +
                    (product.hidden
                      ? 0
                      : parseInt(product.stock * product.avaragePurchasePrice)),
                  0
                )
              )
            }}
          </td>
          <td
            v-show="
              columns.find((column) => column.name == 'last purchase price')
                .show
            "
            class="text-right"
          >
            {{
              toCurrency(
                products.reduce(
                  (sum, product) =>
                    sum +
                    (product.hidden
                      ? 0
                      : parseInt(product.stock * product.lastPurchasePrice)),
                  0
                )
              )
            }}
          </td>

          <td
            v-for="column in groups"
            :key="column.name"
            v-show="column.show"
            class="text-center"
          >
            {{ column.percentage }}
          </td>
        </tr>
      </thead>
      <tbody
        is="filtered-tbody"
        :products="products"
        :columns="columns"
        :groups="groups"
        @setCount="setCount($event)"
      ></tbody>
    </table>
  </div>
</template>

<script>
import FilterInput from '@/components/FilterInput.vue'
import FilteredTbody from '@/components/FilteredProductTbody.vue'
import axios from 'axios'
import toCurrency from '@/composables/useToCurrency'
import toNum from '@/composables/useToNum'

export default {
  name: 'Stock',

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
        { name: 'sells', show: true },
        { name: 'avarage purchase price', show: true, rowspan: 2 },
        { name: 'last purchase price', show: true, rowspan: 2 },
      ],
      products: [],
      searchResultsCount: 0,
      showFilter: false,
      stockDate: new Date().toISOString().split('T')[0],
    }
  },

  computed: {
    groups() {
      return this.$store.state.groups
    },
    sells() {
      return this.products.reduce(
        (sum, product) =>
          sum +
          (product.hidden || !product.sells ? 0 : parseInt(product.sells)),
        0
      )
    },
    stock() {
      return this.products.reduce(
        (sum, product) =>
          sum +
          (product.hidden || !product.stock ? 0 : parseInt(product.stock)),
        0
      )
    },
  },

  methods: {
    getStock() {
      let products = []
      axios
        .get(
          import.meta.env.VITE_API_URL +
            'products/stock.json' +
            '?company=' +
            this.$store.state.company.id +
            '&currency=' +
            this.$store.state.company.currency +
            '&ApiKey=' +
            this.$store.state.user.api_token +
            '&stockDate=' +
            this.stockDate
        )
        .then((resp) => {
          products = resp.data.products
          products.forEach((product) => {
            product.hidden = false
          })
          this.products = products
        })
        .catch((err) => console.error(err))
    },
    setCount(count) {
      this.searchResultsCount = count
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
ul {
  list-style-type: none;
  display: flex;
}
li {
  margin: 1em;
}
i,
li {
  cursor: pointer;
}
.inactive {
  color: #cacaca;
}
</style>
