<template>
  <div class="home">
    <StockRlogin v-if="!isLoggedIn" />
    <StockRstats v-if="isLoggedIn && this.$store.state.company.id" />
  </div>
</template>

<script>
import StockRlogin from '@/components/StockRlogin.vue'
import StockRstats from '@/components/StockRstats.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'home',

  components: {
    StockRlogin,
    StockRstats,
  },

  computed: mapGetters(['isLoggedIn']),
}
</script>
