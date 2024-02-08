<script setup>
  import { computed } from 'vue'
  import invoiceNumber from '@/composables/useInvoiceNumber'
  import toCurrency from '@/composables/useToCurrency'
  import toLocaleDateString from '@/composables/useToLocaleDateString'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()

  const props = defineProps({
    invoices: {
      type: Array,
      required: true,
    },
  })
</script>

<template>
  <tbody>
    <tr v-for="invoice in invoices" :key="invoice.id" :class="{ deleted: invoice.status == 'd' }">
      <td>
        <router-link :to="'invoices/' + invoice.id">
          <i v-if="invoice.sale" class="fi-arrow-left out"></i>
          <i v-if="!invoice.sale" class="fi-arrow-right in"></i>
        </router-link>
      </td>
      <td v-html="invoiceNumber(invoice.number)"></td>
      <td>{{ toLocaleDateString(invoice.date) }}</td>
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
        {{ toCurrency(invoice.amount, invoice.currency) }}
      </td>
    </tr>
  </tbody>
</template>

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
