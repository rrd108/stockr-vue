<template>
<div class="small-12 large-6 columns content">
    <h3>{{$t("add partner")}}</h3>
    <div class="callout success" v-show="isSaved">
        <h5>{{name}} {{$t("saved")}}</h5>
        <p><a @click.prevent="initializeForm"><i class="fi-plus"> {{$t("add partner")}}</i></a></p>
    </div>
    <form @submit.prevent="addPartner" v-show="!isSaved">
        <fieldset>
            <label for="name">{{$t("partner")}}</label>
            <input type="text" v-model="name" required="required">

            <label for="group">{{$t("group")}}</label>
            <select v-model="group" required="required">
                <option v-for="group in groups" :key="group.id">{{group.name}}</option>
            </select>

            <label for="size">{{$t("zip")}}</label>
            <input type="text" v-model="zip">

            <label for="size">{{$t("city")}}</label>
            <input type="text" v-model="city">

            <label for="size">{{$t("address")}}</label>
            <input type="text" v-model="address">

            <label for="taxnumber">{{$t("tax number")}}</label>
            <input type="text" v-model="taxnumber">

            <label for="size">{{$t("phone")}}</label>
            <input type="text" v-model="phone">

            <label for="size">{{$t("email")}}</label>
            <input type="email" v-model="email">

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
    name: 'AddPartner',

    data() {
        return {
            address: '',
            city: '',
            email: '',
            group: '',
            isSaved: false,
            name: '',
            phone: '',
            taxnumber: '',
            zip: '',
        }
    },

    validations: {
        name: {required},
        group: {required}
    },

    computed: {
        groups() {
            return this.$store.state.groups
        }
    },

    created() {
        if(Object.keys(this.$store.state.groups).length === 0) {
            this.$store.dispatch('getGroups')
        }
    },

    methods: {
        addPartner() {
            const qs = require('qs');
            let data = {
                company_id: this.$store.state.company.id,
                address: this.address,
                city: this.city,
                email: this.email,
                group_id: this.groups.find(group => group.name == this.group).id,
                name: this.name,
                phone: this.phone,
                taxnumber: this.taxnumber,
                zip: this.zip,
            }
            let data4vue = {
                group: this.groups.find(group => group.name == this.group)
            }

            axios.post(process.env.VUE_APP_API_URL + 'partners.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token, qs.stringify(data))
                .then(response => {
                    if (response.data.partner.id) {
                        this.isSaved = true
                        this.$store.commit('addPartner', {...response.data.partner, ...data4vue})
                    }
                })
                .catch(error => console.log(error))
        },
        initializeForm() {
            // TODO
            this.address = this.city = this.email = this.group = this.name = this.phone = this.zip = ''
            this.isSaved = false
        },
    },
}
</script>

<style>

</style>