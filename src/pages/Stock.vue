<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import FilterInput from '@/components/FilterInput.vue'
  import FilteredTbody from '@/components/FilteredProductTbody.vue'
  import toCurrency from '@/composables/useToCurrency'
  import toNum from '@/composables/useToNum'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()
  const { products: storeProducts, search: storeSearch } = storeToRefs(store)

  const columns = ref([
    { name: 'code', show: true },
    { name: 'size', show: true },
    { name: 'stock', show: true },
    { name: 'sells', show: true },
    { name: 'avarage purchase price', show: true, rowspan: 2 },
    { name: 'last purchase price', show: true, rowspan: 2 },
  ])
  const searchResultsCount = ref(0)
  const showFilter = ref(false)

  const groups = computed(() => store.groups || [])
  const products = computed(() => storeProducts.value || [])

  const sells = computed(() => {
    if (!products.value || !Array.isArray(products.value)) return 0
    return products.value.reduce((sum, product) => sum + (product.hidden || !product.sells ? 0 : parseInt(product.sells)), 0)
  })

  const stock = computed(() => {
    if (!products.value || !Array.isArray(products.value)) return 0
    return products.value.reduce((sum, product) => sum + (product.hidden || !product.stock ? 0 : parseInt(product.stock)), 0)
  })

  // Computed properties for search terms that sync with store.search
  const searchName = computed({
    get: () => storeSearch.value['products.name'] || '',
    set: value => {
      if (value) {
        storeSearch.value['products.name'] = value
      } else {
        delete storeSearch.value['products.name']
      }
    },
  })

  const searchCode = computed({
    get: () => storeSearch.value['products.code'] || '',
    set: value => {
      if (value) {
        storeSearch.value['products.code'] = value
      } else {
        delete storeSearch.value['products.code']
      }
    },
  })

  const searchSize = computed({
    get: () => storeSearch.value['products.size'] || '',
    set: value => {
      if (value) {
        storeSearch.value['products.size'] = value
      } else {
        delete storeSearch.value['products.size']
      }
    },
  })

  const setCount = count => {
    searchResultsCount.value = count
  }

  onMounted(() => {
    if (!storeProducts.value || storeProducts.value.length === 0) {
      store.getProducts()
    }
    if (!store.groups || store.groups.length === 0) {
      store.getGroups()
    }
  })
</script>

<template>
  <div class="small-12 columns content">
    <h3>
      Termék
      <i class="fi-filter" @click="showFilter = !showFilter"></i>
    </h3>
    <div v-show="showFilter">
      <ul>
        <li v-for="column in columns" :key="column.name" @click="column.show = !column.show" :class="{ inactive: !column.show }">
          <i class="fi-eye"></i> {{ column.name }}
        </li>

        <li v-for="column in groups" :key="column.name" @click="column.show = !column.show" :class="{ inactive: !column.show }">
          <i class="fi-eye"></i> {{ column.name }}
        </li>
      </ul>
    </div>
    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">Termék {{ searchResultsCount }}</th>

          <th scope="col" v-for="column in columns" :key="column.name" v-show="column.show" :rowspan="column.rowspan">
            {{ column.name }}
          </th>

          <th v-show="columns.find(column => column.name == 'avarage purchase price').show" scope="col">Összeg</th>
          <th v-show="columns.find(column => column.name == 'last purchase price').show" scope="col">Összeg</th>

          <th scope="col" v-for="column in groups" :key="column.name" v-show="column.show" :rowspan="column.rowspan">
            {{ column.name }}
          </th>
        </tr>
        <tr>
          <td>
            <FilterInput v-model="searchName" placeholder="product" />
          </td>
          <td v-show="columns.find(column => column.name == 'code').show">
            <FilterInput v-model="searchCode" placeholder="code" />
          </td>
          <td v-show="columns.find(column => column.name == 'size').show">
            <FilterInput v-model="searchSize" placeholder="size" />
          </td>
          <td v-show="columns.find(column => column.name == 'stock').show" class="text-right">{{ toNum(stock) }} db</td>
          <td v-show="columns.find(column => column.name == 'sells').show" class="text-right">{{ toNum(sells) }} db</td>
          <td v-show="columns.find(column => column.name == 'avarage purchase price').show" class="text-right">
            {{ toCurrency(products.reduce((sum, product) => sum + (product.hidden ? 0 : parseInt(product.stock * product.avaragePurchasePrice)), 0)) }}
          </td>
          <td v-show="columns.find(column => column.name == 'last purchase price').show" class="text-right">
            {{ toCurrency(products.reduce((sum, product) => sum + (product.hidden ? 0 : parseInt(product.stock * product.lastPurchasePrice)), 0)) }}
          </td>

          <td v-for="column in groups" :key="column.name" v-show="column.show" class="text-center">
            {{ column.percentage }}
          </td>
        </tr>
      </thead>
      <FilteredTbody :products="products" :columns="columns" :groups="groups" @setCount="setCount($event)" />
    </table>
  </div>
</template>

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
