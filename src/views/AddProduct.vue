<template>
<div class="small-12 large-6 columns content">
    <h3>{{$t("add product")}}</h3>
    <div class="callout success" v-show="isSaved">
        <h5>{{name}} {{$t("saved")}}</h5>
        <p><a @click.prevent="initializeForm"><i class="fi-plus"> {{$t("add product")}}</i></a></p>
    </div>
    <form @submit.prevent="addProduct" v-show="!isSaved">
        <fieldset>
            <label for="name">{{$t("product")}}</label>
            <input type="text" v-model="name" required="required" id="name">

            <label for="code">{{$t("code")}}</label>
            <input type="text" v-model="code" id="code">

            <label for="size">{{$t("size")}}</label>
            <input type="text" v-model="size" id="size">

            <label for="vat">{{$t("vat")}} %</label>
            <select v-model="vat" required="required" id="vat">
                <option :value="undefined">---</option>
                <option v-for="vat in vats" :key="vat">{{vat}}</option>
            </select>

        </fieldset>
        <button class="button" type="submit">
            <i class="fi-check"> {{$t("save")}}</i>
        </button>
    </form>
</div>
</template>

<script>
import axios from 'axios'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'AddProduct',

    data() {
        return {
            name: '',
            code: '',
            size: '',
            vats: [],
            vat: undefined,
            isSaved: false,
        }
    },

    validations: {
        name: {required},
        vat: {required}
    },

    created() {
        this.vats = process.env.VUE_APP_VAT_PERCENTAGES.split(',')
    },

    methods: {
        addProduct() {
            const qs = require('qs');
            let data = {
                company_id: this.$store.state.company.id,
                name: this.name,
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

            axios.post(process.env.VUE_APP_API_URL + 'products.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token, qs.stringify(data))
                .then(response => {
                    if (response.data.product.id) {
                        this.isSaved = true
                        this.$store.commit('addProduct', {...response.data.product, ...data4vue})
                    }
                })
                .catch(error => console.log(error))
        },
        initializeForm() {
            // TODO
            this.name = ''
            this.code = ''
            this.size = ''
            this.vat = undefined
            this.isSaved = false
            this.vats = process.env.VUE_APP_VAT_PERCENTAGES.split(',')
        },
    },
}
</script>

<style>

</style>