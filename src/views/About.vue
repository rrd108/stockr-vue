<template>
  <div class="about">
    <h1 @click=check>This is an about page</h1>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    check() {
      console.log('check');
      axios.get('http://localhost/~rrd/stockrvue/api/products/stock.json', {
          headers: {
            //Accept: 'application/json',
            'ApiKey': this.$store.state.user.api_token
          },
          withCredentials: true
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(err => console.error(err));
      /* fetch('http://localhost/~rrd/stockrvue/api/products/stock.json', {
        method: 'get',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': this.$store.state.user.api_token
          },
      }).then(response => response.json())
      .then(stock => console.log(stock))
      .catch(err => console.error(err)); */
    }
  }
}
</script>

<style>

</style>