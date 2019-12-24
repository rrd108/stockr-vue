<template>
    <tbody>
        <tr v-for="invoice in filteredItems" :key="invoice.id" v-show="!invoice.hidden">
            <td>
                <router-link :to="'invoices/' + invoice.id">
                    <i v-if= "invoice.sale" class="fi-arrow-left out"></i>
                    <i v-if="!invoice.sale" class="fi-arrow-right in"></i>
                </router-link>
            </td>
            <td v-html="$options.filters.invoiceNumber(invoice.number)"></td>
            <td>{{invoice.date | toLocaleDateString}}</td>
            <td>
                <a :href="'../partners/view/' + invoice.partner.id">
                    <i class="fi-torsos"> {{invoice.partner.name}}</i>
                </a></td>
            <td><i class="fi-contrast"> {{invoice.storage.name}}</i></td>
            <td><i class="fi-book"> {{invoice.invoicetype.name}}</i></td>
            <td class="text-right">{{invoice.items.reduce((total, item) => total + item.price * item.quantity, 0) | toCurrency}}</td>
        </tr>
        </tbody>
</template>

<script>
import RowFilterMixin from '@/mixins/RowFilterMixin'

export default {
    name: 'FilteredTbody',

    props: {
        invoices: {
            type: Array,
            required: true
        },
    },

    data() {
        return {
            model: 'invoices'
        }
    },

    mixins: [
        RowFilterMixin
    ],

    filters : {
        invoiceNumber(value) {
            if (value.indexOf('|') != -1) {
                value = value.split('|');
                value = '<a href="' + value[2] + '">\
                    <i class="fi-page-pdf"></i>\
                    </a> ' + value[1];
            }
            return value;
        }
    }
}
</script>

<style scoped>
.in, .out {
  background: none;
  font-size: 2rem;
}
.in::before {
  color: #bc50b1;
}

.out::before {
  color: #50bc5b;
}
</style>