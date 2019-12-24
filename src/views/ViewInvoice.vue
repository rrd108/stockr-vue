<template>
  <div v-if="isLoaded" class="small-12 columns content">
    <h3>{{invoice.storage.company.name}}</h3>
    <table class="vertical-table">
        <tbody>
            <tr>
                <th scope="row">{{$t("partner")}}</th>
                <td>{{invoice.partner.name}}</td>
                <th scope="row">{{$t("storage")}}</th>
                <td>{{invoice.storage.name}}</td>
            </tr>
            <tr>
                <th scope="row">{{$t("invoice type")}}</th>
                <td>{{invoice.invoicetype.name}}</td>
                <th scope="row">{{$t("date")}}</th>
                <td>{{invoice.date | toLocaleDateString}}</td>
            </tr>
        <tr>
            <th scope="row">{{$t("number")}}</th>
            <td>{{invoice.number}}</td>
            <th scope="row">{{$t("type")}}</th>
            <td>{{invoice.sale ?  $t("sale") : $t("purchase")}}</td>
        </tr>
        <tr>
            <th scope="row">{{$t("currency")}}</th>
            <td>{{invoice.currency}}</td>
            <th scope="row">PDF</th>
            <td><a :href="api + 'invoices/' + invoice.id + '.pdf'"><i class="fi-page-export-pdf"> PDF</i></a></td>
        </tr>
        </tbody>
    </table>

    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr :class="invoice.sale ? 'out' : 'in'">
                <th class="text-center" scope="col">{{$t("product")}}</th>
                <th class="text-center" scope="col">{{$t("quantity")}}</th>
                <th class="text-center" scope="col">{{$t("price")}}</th>
                <th class="text-center" scope="col">{{$t("amount")}}</th>
                <th class="text-center" scope="col">{{$t("vat")}}</th>
                <th class="text-center" scope="col">{{$t("vat")}}</th>
                <th class="text-center" scope="col">{{$t("gross amount")}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in invoice.items" :key="item.id">
                <td>{{item.product.name}}</td>
                <td class="text-right">{{item.quantity}}</td>
                <td class="text-right">{{item.price | toCurrency}}</td>
                <td class="text-right">{{item.price * item.quantity | toCurrency}}</td>
                <td class="text-right">{{item.product.vat}} %</td>
                <td class="text-right">{{item.product.vat * item.price * item.quantity / 100 | toCurrency}}</td>
                <td class="text-right">{{item.price * item.quantity * (1 + item.product.vat / 100) | toCurrency}}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>{{$t("total")}}</td>
                <td class="text-right">{{invoice.items.reduce((total, item) => total + parseInt(item.quantity), 0) | toNum}}</td>
                <td></td>
                <td class="text-right">{{invoice.items.reduce((total, item) => total + item.price * item.quantity, 0) | toCurrency}}</td>
                <td></td>
                <td class="text-right">{{invoice.items.reduce((total, item) => total + item.price * item.quantity * item.product.vat / 100, 0) | toCurrency}}</td>
                <td class="text-right">{{invoice.items.reduce((total, item) => total + item.price * item.quantity * (1 + item.product.vat / 100), 0) | toCurrency}}</td>
            </tr>
        </tfoot>
    </table>
</div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ViewInvoce',

    data() {
        return {
            isLoaded: false,
            invoice: {},
            api: ''
        }
    },

    created() {
        this.api = process.env.VUE_APP_API_URL

        axios.get(process.env.VUE_APP_API_URL + 'invoices/' + this.$route.params.id + '.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.invoice = response.data.invoice
                this.isLoaded = true
            })
            .catch(err => console.error(err))
    },
}
</script>

<style>

</style>