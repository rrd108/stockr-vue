<script setup>
  import axios from 'axios'
  import toCurrency from '@/composables/useToCurrency'
  import toNumFormat from '@/composables/useToNumFormat'
  import { useStockrStore } from '@/stores'
  import { ref } from 'vue'

  const store = useStockrStore()
  const currency = store.company.currency
  const stats = ref({
    totals: {
      sells: 0,
      purchases: 0,
      stock: 0,
    },
    partners: 0,
    invoices: 0,
    products: 0,
  })

  axios
    .get(`${import.meta.env.VITE_API_URL}stats.json?company=${store.company.id}`, store.tokenHeader)
    .then(response => {
      stats.value = response.data
    })
    .catch(err => console.error(err))
</script>

<template>
  <div class="cards">
    <div class="small-6 large-4">
      <div class="widget out">
        <h2>{{ toCurrency(stats.totals.sells, currency) }}</h2>
        <i class="fi-arrow-left"> Eladás</i>
      </div>
    </div>

    <div class="small-6 large-4">
      <div class="widget in">
        <h2>{{ toCurrency(stats.totals.purchases, currency) }}</h2>
        <i class="fi-arrow-right"> Beszerzés</i>
      </div>
    </div>

    <div class="small-6 large-4">
      <div class="widget w1">
        <h2>{{ toNumFormat(stats.totals.stock) }} db</h2>
        <i class="fi-list-thumbnails"> Készlet</i>
      </div>
    </div>

    <div class="small-6 large-4">
      <div class="widget w2">
        <h2>{{ stats.partners }}</h2>
        <i class="fi-torsos"> Partner</i>
      </div>
    </div>

    <div class="small-6 large-4">
      <div class="widget w3">
        <h2>{{ stats.invoices }}</h2>
        <i class="fi-book"> Bizonylat </i>
      </div>
    </div>

    <div class="small-6 large-4">
      <div class="widget w4">
        <h2>{{ stats.products }}</h2>
        <i class="fi-foot"> Termék </i>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .cards {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .widget {
    margin: 0.7rem;
    padding: 1rem;
    color: #fff;
  }
  i {
    font-size: 1.6rem;
  }
  .w1 {
    background: #5a3bb3;
  }
  .w2 {
    background: #0192a5;
  }
  .w3 {
    background: #cd4c26;
  }
  .w4 {
    background: #ea8906;
  }
</style>
