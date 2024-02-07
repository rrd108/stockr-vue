<script setup>
  import StockRlogin from '@/components/StockRlogin.vue'
  import StockRstats from '@/components/StockRstats.vue'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()
</script>

<template>
  <div class="home">
    <StockRlogin v-if="!store.isLoggedIn" />
    <StockRstats v-if="store.isLoggedIn && store.company.id" />
  </div>
</template>
