<template>
  <div class="small-12 large-6 columns content">
    <h3>Új termék</h3>
    <div class="callout success" v-show="isSaved">
      <h5>{{ name }} elmentve</h5>
      <p>
        <a @click.prevent="initializeForm"><i class="fi-plus"> Új termék </i></a>
      </p>
    </div>
    <form @submit.prevent="addProduct" v-show="!isSaved">
      <fieldset>
        <label for="name"> Termék </label>
        <input type="text" v-model="name" required="required" id="name" />

        <label for="name"> Termék EN</label>
        <input type="text" v-model="en_name" required="required" id="en_name" />

        <label for="code"> Kód </label>
        <input type="text" v-model="code" id="code" />

        <label for="size"> Méret </label>
        <input type="text" v-model="size" id="size" />

        <label for="vat">ÁFA %</label>
        <select v-model="vat" required="required" id="vat">
          <option :value="undefined">---</option>
          <option v-for="vat in vats" :key="vat">{{ vat }}</option>
        </select>
      </fieldset>
      <button class="button" type="submit">
        <i class="fi-check"> Ment </i>
      </button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'AddProduct',

    data() {
      return {
        name: '',
        en_name: '',
        code: '',
        size: '',
        vats: [],
        vat: undefined,
        isSaved: false,
      }
    },

    // validations: {
    //   name: { required },
    //   vat: { required },
    // },

    created() {
      this.vats = import.meta.env.VITE_VAT_PERCENTAGES.split(',')
    },

    methods: {
      addProduct() {
        let data = {
          company_id: this.$store.company.id,
          name: this.name.replace(/ +(?= )/g, ''),
          en_name: this.en_name.replace(/ +(?= )/g, ''),
          code: this.code,
          size: this.size,
          vat: this.vat,
        }
        let data4vue = {
          avaragePurchasePrice: 0,
          lastPurchasePrice: 0,
          stock: 0,
          hidden: false,
        }

        axios
          .post(
            import.meta.env.VITE_API_URL +
              'products.json?company=' +
              this.$store.company.id +
              '&currency=' +
              this.$store.company.currency +
              '&ApiKey=' +
              this.$store.user.api_token,
            data
          )
          .then(response => {
            if (response.data.product.id) {
              this.isSaved = true
              this.$store.commit('addProduct', {
                ...response.data.product,
                ...data4vue,
              })
            }
          })
          .catch(error => console.log(error))
      },
      initializeForm() {
        // TODO
        this.name = ''
        this.en_name = ''
        this.code = ''
        this.size = ''
        this.vat = undefined
        this.isSaved = false
        this.vats = import.meta.env.VITE_VAT_PERCENTAGES.split(',')
      },
    },
  }
</script>

<style></style>
