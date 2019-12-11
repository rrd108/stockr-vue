<template>
    <tbody>
        <tr v-for="invoice in filteredInvoices" :key="invoice.id" v-show="!invoice.hidden">
            <td>
                <a :href="'invoices/view/' + invoice.id">
                    <i v-if= "invoice.sale" class="fi-arrow-left in"></i>
                    <i v-if="!invoice.sale" class="fi-arrow-right out"></i>
                </a>
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

export default {
    name: 'FilteredTbody',

    props: {
        invoices: {
            type: Array,
            required: true
        },
    },

    computed: {
        search() {
            console.log('compute')
            return this.$store.state.search
        },
        filteredInvoices() {
            let filteredInvoices = this.invoices

            filteredInvoices.forEach(item => {
                item.hidden = false
                for (let [field, value] of Object.entries(this.search)) {

                    //remove the first tag in property list as we already on that level
                    let model = field.substr(0, field.indexOf('.'))
                    field = field.substr(field.indexOf('.') + 1)

                    if (model == 'invoices' && value) {
                        let fieldValue = field.split(".").reduce((a,b) => a[b], item);

                        if (!fieldValue) {
                            item.hidden = true
                            return
                        }
                        if (fieldValue.toLowerCase().indexOf(value.toLowerCase()) == -1) {
                            item.hidden = true;
                            return
                        }
                    }
                }
            })

            this.$emit('setCount', filteredInvoices.filter(item => item.hidden !== true).length)
            return filteredInvoices
        }
    },

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