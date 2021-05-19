<template>
  <tbody>
    <tr v-for="invoice in filteredItems" :key="invoice.id" :class="{deleted: (invoice.status == 'd')}">
      <td>
        <router-link :to="'invoices/' + invoice.id">
          <i v-if="invoice.sale" class="fi-arrow-left out"></i>
          <i v-if="!invoice.sale" class="fi-arrow-right in"></i>
        </router-link>
      </td>
      <td v-html="$options.filters.invoiceNumber(invoice.number)"></td>
      <td>{{ invoice.date | toLocaleDateString }}</td>
      <td>
        <router-link :to="'partners/' + invoice.partner.id">
          <i class="fi-torsos"> {{ invoice.partner.name }}</i>
        </router-link>
      </td>
      <td>
        <i class="fi-contrast"> {{ invoice.storage.name }}</i>
      </td>
      <td>
        <i class="fi-book"> {{ invoice.invoicetype.name }}</i>
      </td>
      <td class="text-right">
        {{ invoice.amount | toCurrency(invoice.currency) }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import RowFilterMixin from '@/mixins/RowFilterMixin'
import InvoiceNumberFilterMixin from '@/mixins/InvoiceNumberFilterMixin'

export default {
  name: 'FilteredTbody',

  props: {
    invoices: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      model: 'invoices',
    }
  },

  mixins: [InvoiceNumberFilterMixin, RowFilterMixin],
}
</script>

<style scoped>
.in,
.out {
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