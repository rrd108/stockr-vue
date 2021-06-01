<template>
  <div id="app">
    <stockRheader v-if="isLoggedIn" />
    <stockRcompany v-if="isLoggedIn && !this.$store.state.company.id" />
    <router-view />
  </div>
</template>

<script>
import StockRheader from '@/components/StockRheader.vue'
import StockRcompany from '@/components/StockRcompany.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'app',

  components: {
    StockRheader,
    StockRcompany,
  },

  computed: mapGetters(['isLoggedIn']),

  created() {
    window.addEventListener('keypress', this.shortCuts)
  },
  destroyed() {
    window.removeEventListener('keypress', this.shortCuts)
  },
  methods: {
    shortCuts(e) {
      if (e.target.nodeName != 'INPUT') {
        let cmd = String.fromCharCode(e.keyCode).toLowerCase()
        if (cmd == 'b') {
          this.$router.push({ name: 'add-invoice' })
        }
        if (cmd == 'h') {
          this.$router.push({ name: 'help' })
        }
      }
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
