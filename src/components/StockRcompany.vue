<template>
<div class="companies small-12">
    <fieldset>
        <legend>{{$t("company")}}</legend>
        <select v-model="selectedCompany" @change="setAppCompany">
            <option v-for="company in companies" :key="company.id" :value="company.id">{{ company.name }}</option>
        </select>
    </fieldset>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StockRcompany',

  data() {
    return {
        companies: [],
        selectedCompany: 0
    }
  },

  created() {
    const company = JSON.parse(localStorage.getItem('company'));
    if (company) {
      this.$store.commit('setCompany', company);
      this.$store.dispatch('getInvoices')
      return;
    }
    // TODO fake company to pass login
    axios.get(process.env.VUE_APP_API_URL + 'companies/accessible.json?company=999&ApiKey=' + this.$store.state.user.api_token)
      .then(response => this.companies = response.data)
      .catch(err => console.error(err))
  },

  methods: {
      setAppCompany(){
        let appCompany = this.companies.filter(company => {
            return company.id === this.selectedCompany
          })
        // TODO remove all stored data what belongs to other company
        this.$store.commit('setCompany', appCompany[0])
        localStorage.setItem('company', JSON.stringify(appCompany[0]))

        this.$store.dispatch('getInvoices')
      },
  }
}
</script>

<style scoped>
.companies {
    margin: 5em auto;
    width: 25em;
    border: thin solid #aaa;
    padding: 2em;
    box-shadow: 5px 10px 8px #aaa;
}
</style>
