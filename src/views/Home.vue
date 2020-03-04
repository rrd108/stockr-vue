<template>
  <div class="home">
    <StockRlogin v-if="!isLoggedIn" />
    <StockRstats v-if="isLoggedIn && this.$store.state.company.id" />
  </div>
</template>

<script>
// @ is an alias to /src
import StockRlogin from '@/components/StockRlogin.vue'
import StockRstats from '@/components/StockRstats'
import {mapGetters} from 'vuex'

export default {
  name: 'home',

  components: {
    StockRlogin,
    StockRstats
  },

  computed : mapGetters(['isLoggedIn']),
}
</script>
