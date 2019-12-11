<template>
    <div>
        <h3><i class="fi-plus"></i> {{$t("new invoice")}}</h3>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="storage-id">{{$t("storage")}}</label>
                <select v-model="storage_id" id="storage-id">
                    <option v-for="storage in storages" :key="storage.id" :value="storage.id">{{ storage.name }}</option>
                </select>
            </div>
            <div class="column small-12 large-6">
                <label for="invoicetype-id">{{$t("invoice type")}}</label>
                <select v-model="invoicetype_id" id="invoicetype-id">
                    <option v-for="invoicetype in invoicetypes" :key="invoicetype.id" :value="invoicetype.id">{{ invoicetype.name }}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="partner-id">{{$t("partner")}}</label>
                <input type="text" v-model.lazy="partner_id" list="partners" id="partner-id" name="partner_id" autocomplete="off">
                <datalist id="partners">
                    <option v-for="partner in partners" :key="partner.id" :data-value="partner.id">{{ partner.name }}</option>
                </datalist>
            </div>
            <div class="column small-12 large-6">
                <label for="date">{{$t("date")}}</label>
                <input type="date" v-model="date">
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AddInvoice',

    data() {
        return {
            storages: {},
            storage_id: 0,
            invoicetypes: {},
            invoicetype_id: 0,
            partners: {},
            partner_id: '',
            date: (new Date()).toISOString().split('T')[0],
        }
    },

    created() {
        // TODO get these from storage
        axios.get(process.env.VUE_APP_API_URL + 'storages.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.storages = response.data
            })
            .catch(err => console.error(err))

        axios.get(process.env.VUE_APP_API_URL + 'invoicetypes.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.invoicetypes = response.data
            })
            .catch(err => console.error(err))

        axios.get(process.env.VUE_APP_API_URL + 'partners.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.partners = response.data
            })
            .catch(err => console.error(err))
    },
}
</script>

<style scoped>

</style>