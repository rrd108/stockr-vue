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
  import QuickEdit from '@/components/QuickEdit.vue'
  import { useStockrStore } from '@/stores'

  export default {
    name: 'ViewPartner',
    components: { QuickEdit },
    data() {
      return {
        store: null,
        partner: null,
      }
    },
    created() {
      this.store = useStockrStore()
      this.partner = this.store.partners && Array.isArray(this.store.partners) ? this.store.partners.find(partner => partner.id == this.$route.params.id) : null
      if (!this.partner) {
        // If partner not in store, fetch it
        if (this.store.company && this.store.company.id) {
          axios
            .get(`${import.meta.env.VITE_API_URL}partners/${this.$route.params.id}.json?company=${this.store.company.id}`, this.store.tokenHeader)
            .then(response => {
              this.partner = response.data.partner
            })
            .catch(error => console.log(error))
        }
      }
    },
    methods: {
      edit(property) {
        if (!this.partner || !this.store.company || !this.store.company.id) {
          return
        }
        let partner = {}
        partner[property] = this.partner[property]
        axios
          .put(
            `${import.meta.env.VITE_API_URL}partners/${this.partner.id}.json?company=${this.store.company.id}`,
            partner,
            this.store.tokenHeader
          )
          .then(response => {
            // Update partner in store
            if (this.store.partners && Array.isArray(this.store.partners)) {
              const index = this.store.partners.findIndex(p => p.id == response.data.partner.id)
              if (index !== -1) {
                this.store.partners[index] = response.data.partner
              } else {
                this.store.partners.push(response.data.partner)
              }
            }
            // Update local partner
            this.partner[property] = response.data.partner[property]
          })
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
