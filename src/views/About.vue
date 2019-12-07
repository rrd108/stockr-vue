<template>
  <div>
    <h1 @click=check>This is an about page</h1>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    check() {
      console.log('check');
      /*axios.get(process.env.VUE_APP_API_URL + 'products/stock.json?company=1', {
        headers: {
          'ApiKey': this.$store.state.user.api_token
        },
      })
      .then(resp => {
          console.log(resp);
      })
      .catch(err => console.error(err));*/

      //we use query string ApiKey as axios not sending out the ApiKey header
      axios.get(process.env.VUE_APP_API_URL + 'products/stock.json?company=1&ApiKey=' + this.$store.state.user.api_token)
      .then(resp => {
          console.log(resp);
      })
      .catch(err => console.error(err));
    }
  }
}
</script>

<style>

</style>