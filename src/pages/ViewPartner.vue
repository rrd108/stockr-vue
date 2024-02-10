<template>
  <div class="small-12 large-6 columns content">
    <h1>
      <i class="fi-torsos"></i>
      <quick-edit v-model="partner.name" buttonCancelText="X" @input="edit('name')" />
    </h1>
    <h2>{{ partner.group.name }} {{ partner.group.percentage }}%</h2>
    <h3>
      <i class="fi-marker" :title="Cím"></i>
      <quick-edit v-model="partner.zip" :emptyText="Irsz" buttonCancelText="X" @input="edit('zip')" />
      <quick-edit v-model="partner.city" :emptyText="Város" buttonCancelText="X" @input="edit('city')" />
      <quick-edit v-model="partner.address" :emptyText="Cím" buttonCancelText="X" @input="edit('address')" />
    </h3>
    <h4>
      <i class="fi-key" title="adószám"></i>
      <quick-edit v-model="partner.taxnumber" buttonCancelText="X" @input="edit('taxnumber')" />
    </h4>
  </div>
</template>

<script>
  import axios from 'axios'
  import QuickEdit from 'vue-quick-edit'

  export default {
    name: 'ViewPartner',
    components: { QuickEdit },
    data() {
      return {
        partner: this.$store.partners.find(partner => partner.id == this.$route.params.id),
      }
    },
    methods: {
      edit(property) {
        let partner = {}
        partner[property] = this.partner[property]
        axios
          .put(
            `${import.meta.env.VITE_API_URL}partners/${this.partner.id}.json?company=${this.$store.company.id}`,
            store.tokenHeader,
            partner
          )
          .then(response =>
            this.$store.commit('updatePartner', {
              property: property,
              partner: response.data.partner,
            })
          )
          .catch(error => console.log(error))
      },
    },
  }
</script>

<style>
  h1 div,
  h2 div,
  h3 div,
  h4 div {
    display: inline-block;
    margin: 0 1rem;
  }
</style>
