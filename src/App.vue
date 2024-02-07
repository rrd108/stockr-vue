<script setup>
  import { onUnmounted, onMounted } from 'vue'
  import StockRheader from '@/components/StockRheader.vue'
  import StockRcompany from '@/components/StockRcompany.vue'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()

  onMounted(() => window.addEventListener('keypress', shortCuts))
  onUnmounted(() => window.removeEventListener('keypress', shortCuts))

  const shortCuts = e => {
    if (e.target.nodeName != 'INPUT') {
      let cmd = String.fromCharCode(e.keyCode).toLowerCase()
      if (cmd == 'b') {
        router.push({ name: 'add-invoice' })
      }
      if (cmd == 'h') {
        router.push({ name: 'help' })
      }
    }
  }
</script>

<template>
  <div id="app">
    <StockRheader v-if="store.isLoggedIn" />
    <StockRcompany v-if="store.isLoggedIn && !store.company.id" />
    <router-view />
  </div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css?family=Quicksand:500');
  @import url('./assets/css/foundation.min.css');
  @import url('./assets/css/foundation-icons.min.css');

  #app {
    font-family: 'Quicksand', sans-serif;
    color: #2c3e50;
  }

  .in {
    background: #bc50b1;
    color: #fff;
  }

  .out {
    background: #50bc5b;
    color: #fff;
  }
  input.quantity {
    width: 6rem;
    display: inline-block;
  }
  input.price {
    width: 8rem;
    display: inline-block;
  }
  .small {
    font-size: 0.75rem;
  }
  .pointer {
    cursor: pointer;
    color: #2ba6cb;
  }
  .deleted {
    text-decoration: line-through;
    color: #aaa;
  }

  @media screen and (max-width: 40em) {
    th,
    td {
      display: block;
    }
  }

  @media print {
    a[href]:after {
      content: none !important;
    }
  }
</style>
