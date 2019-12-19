<template>
<div class="cards">
    <div class="small-6 large-4">
    <div class="widget out">
        <h2>{{stats.totals.sells | toCurrency}}</h2>
        <i class="fi-arrow-left"> {{$t("sells")}}</i>
    </div>
    </div>

    <div class="small-6 large-4">
    <div class="widget in">
        <h2>{{stats.totals.purchases | toCurrency}}</h2>
        <i class="fi-arrow-right"> {{$t("purchases")}}</i>
    </div>
    </div>

    <div class="small-6 large-4">
    <div class="widget w1">
        <h2>{{stats.totals.stock | toNumFormat}} {{$t("pcs")}}</h2>
        <i class="fi-list-thumbnails"> {{$t("stock")}}</i>
    </div>
    </div>

    <div class="small-6 large-4">
    <div class="widget w2">
        <h2>{{stats.partners}}</h2>
        <i class="fi-torsos"> {{$t("partners")}}</i>
    </div>
    </div>

    <div class="small-6 large-4">
    <div class="widget w3">
        <h2>{{stats.invoices}}</h2>
        <i class="fi-book"> {{$t("invoices")}}</i>
    </div>
    </div>

    <div class="small-6 large-4">
    <div class="widget w4">
        <h2>{{stats.products}}</h2>
        <i class="fi-foot"> {{$t("products")}}</i>
    </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'stats',

  data(){
    return {
      stats: {
        totals: {
          sells: 0,
          purchases: 0,
          stock: 0
        },
        partners: 0,
        invoices: 0,
        products: 0
      }
    }
  },

  created() {
    axios.get(process.env.VUE_APP_API_URL + 'stats.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
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
  margin: .7rem;
  padding: 1rem;
  color: #fff;
}
i {
  font-size: 1.75rem;
}
.w1 {
  background: #5A3BB3;
}
.w2 {
  background: #0192A5;
}
.w3 {
  background: #CD4C26;
}
.w4 {
  background: #EA8906;
}
</style>