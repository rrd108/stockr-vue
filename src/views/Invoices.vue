<template>
  <div class="small-12 columns content">
    <h3>{{$t("invoices")}}</h3>

    <div class="callout success" v-show="$route.params.newInvoice">
        <h5>{{$route.params.newInvoice}} {{$t("saved")}}</h5>
    </div>


    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th scope="col">{{$t("sale")}}</th>
                <th scope="col">{{$t("number")}}</th>
                <th scope="col">{{$t("date")}}</th>
                <th scope="col">{{$t("partner")}}</th>
                <th scope="col">{{$t("storage")}}</th>
                <th scope="col">{{$t("invoice type")}}</th>
                <th scope="col">{{$t("amount")}}</th>
            </tr>
            <tr>
                <td>{{searchResultsCount}}</td>
                <td><filter-input :search="'invoices.number'" /></td>
                <td><filter-input :search="'invoices.date'" /></td>
                <td><filter-input :search="'invoices.partner.name'" /></td>
                <td><filter-input :search="'invoices.storage.name'" /></td>
                <td><filter-input :search="'invoices.invoicetype.name'" /></td>
                <td class="text-right"><filter-input :search="'invoice.amount'" /></td>
            </tr>
        </thead>
        <tbody is="filtered-tbody" :invoices="invoices" @setCount="setCount($event)"></tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import FilterInput from '@/components/FilterInput.vue'
import FilteredTbody from '@/components/FilteredInvoiceTbody.vue'

export default {
    name: 'Invoices',

    components : {
        FilterInput,
        FilteredTbody
    },

    data(){
        return {
            invoices: [],
            searchResultsCount: 0,
        }
    },

    created() {
        //we use query string ApiKey as axios not sending out the ApiKey header
        // TODO get only once and save into the store
        axios.get(process.env.VUE_APP_API_URL + 'invoices.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
        .then(resp => {
            let invoices = resp.data
            invoices.forEach((invoices) => {
                invoices.hidden = false
            })
            this.invoices = invoices
            this.searchResultsCount = invoices.length
        })
        .catch(err => console.error(err))
    },

    methods : {
        setCount(count) {
            this.searchResultsCount = count
        },
    }
}
</script>
