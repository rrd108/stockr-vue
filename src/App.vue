<template>
  <div id="app">
    <stockRheader v-if="isLoggedIn" />
    <router-view/>
  </div>
</template>

<script>

import StockRheader from '@/components/StockRheader.vue'

export default {
  name: 'app',

  components: {
    StockRheader
  },

  computed : {
      isLoggedIn() {
        let now = (new Date).getTime()
        let expired = 7 * 24 * 60 * 60 * 1000
        if ((now - this.$store.state.user.lastLogin) > expired) {
          return false
        }
        return this.$store.state.user.email ? true : false
      }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Quicksand');
@import url('./assets/css/foundation.min.css');
@import url('./assets/css/foundation-icons.min.css');

#app {
  font-family: 'Quicksand', sans-serif;
  color: #2c3e50;
}
</style>
