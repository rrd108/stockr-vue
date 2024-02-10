<script setup>
  import axios from 'axios'
  import { ref } from 'vue'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()

  const companies = ref([])
  const selectedCompany = ref(0)

  const company = JSON.parse(localStorage.getItem('company'))
  if (company) {
    store.company = company
    store.getBaseData()
  }

  axios
    .get(import.meta.env.VITE_API_URL + 'companies/accessible.json?company=999', store.tokenHeader)
    .then(response => (companies.value = response.data))
    .catch(err => console.error(err))

  const setAppCompany = () => {
    let appCompany = companies.value.filter(company => {
      return company.id === selectedCompany.value
    })
    // TODO remove all stored data what belongs to other company
    store.company = appCompany[0]
    localStorage.setItem('company', JSON.stringify(appCompany[0]))

    store.getBaseData()
  }
</script>

<template>
  <div class="companies small-12">
    <fieldset>
      <legend>Cég</legend>
      <select v-model="selectedCompany" @change="setAppCompany">
        <option v-for="company in companies" :key="company.id" :value="company.id">
          {{ company.name }}
        </option>
      </select>
    </fieldset>
  </div>
</template>

<style scoped>
  .companies {
    margin: 5em auto;
    width: 25em;
    border: thin solid #aaa;
    padding: 2em;
    box-shadow: 5px 10px 8px #aaa;
  }
</style>
