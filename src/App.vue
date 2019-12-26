<template>
  <div id="app">
    <stockRheader v-if="isLoggedIn" />
    <stockRcompany v-if="isLoggedIn && !this.$store.state.company.id" />
    <router-view/>
  </div>
</template>

<script>

import StockRheader from '@/components/StockRheader.vue'
import StockRcompany from '@/components/StockRcompany.vue'

export default {
  name: 'app',

  components: {
    StockRheader,
    StockRcompany
  },

  computed : {
      isLoggedIn() {
        let now = (new Date).getTime()
        let expired = 7 * 24 * 60 * 60 * 1000
        if ((now - this.$store.state.user.lastLogin) > expired) {
          return false
        }
        return this.$store.state.user.email ? true : false
      },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Quicksand:500');
@import url('./assets/css/foundation.min.css');
@import url('./assets/css/foundation-icons.min.css');

#app {
  font-family: 'Quicksand', sans-serif;
  color: #2c3e50;
}

.in{
  background: #bc50b1;
  color: #fff;
}

.out{
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
  font-size: .75rem;
}
.changeAble {
    cursor: pointer;
}
</style>
