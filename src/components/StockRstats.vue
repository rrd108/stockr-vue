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

<script>
  import axios from 'axios'
  import toCurrency from '@/composables/useToCurrency'
  import toNumFormat from '@/composables/useToNumFormat'
  import { useStockrStore } from '@/stores'

  export default {
    name: 'stats',

    data() {
      return {
        store: useStockrStore(),
        currency: useStockrStore().company.currency,
        stats: {
          totals: {
            sells: 0,
            purchases: 0,
            stock: 0,
          },
          partners: 0,
          invoices: 0,
          products: 0,
        },
      }
    },

    methods: {
      toCurrency,
      toNumFormat,
    },

    created() {
      axios
        .get(
          import.meta.env.VITE_API_URL +
            'stats.json?company=' +
            this.store.company.id +
            '&ApiKey=' +
            this.store.user.api_token
        )
        .then(response => {
          this.stats = response.data
        })
        .catch(err => console.error(err))
    },
  }
</script>

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
