<template>
  <div>
    <h1>{{partner.name}}</h1>
    <h2>{{partner.group.name}} {{partner.group.percentage}}%</h2>
    <h3>{{partner.zip}} {{partner.city}} {{partner.address}}</h3>
    <h4>{{partner.taxnumber}}</h4>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ViewPartner',
  data() {
    return {
      partner: {}
    }
  },

  created() {
    axios.get(process.env.VUE_APP_API_URL + 'partners/' + this.$route.params.id + '.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
      .then(response => this.partner = response.data.partner)
      .catch(err => console.error(err))
  }
}
</script>

<style>

</style>