<template>
    <tbody>
        <tr v-for="product in filteredItems" :key="product.id">
            <td>
        <i class="fi-pencil" @click="edit(product.id)"></i>
                <router-link :to="'products/' + product.id">
                    <i class="fi-foot"> {{product.name}}</i>
                </router-link>
            </td>
            <td>{{product.code}}</td>
            <td>{{product.size}}</td>
            <td class="text-right">{{product.stock | toNum(1)}}</td>
            <td class="text-right">{{product.sells | toNum(1)}}</td>
            <td class="text-right">{{product.avaragePurchasePrice | toCurrency}}</td>
            <td class="text-right">{{product.lastPurchasePrice | toCurrency}}</td>
            <td class="text-right">{{product.stock * product.avaragePurchasePrice | toCurrency}}</td>
            <td class="text-right">{{product.stock * product.lastPurchasePrice | toCurrency}}</td>
        </tr>
    </tbody>
</template>

<script>
import RowFilterMixin from '@/mixins/RowFilterMixin'

export default {
    name: 'FilteredTbody',

    props: {
        products: {
            type: Array,
            required: true
        },
    },

    data() {
        return {
            model: 'products'
        }
    },

    mixins: [
        RowFilterMixin
    ],

  methods: {
    edit(id) {
      // TODO have a form for edit name, code, size, vat, hidden
      console.log(this.products.find(product => product.id == id))
    }
  },
}
</script>

<style scoped>
td i.fi-pencil {
    visibility: hidden;
}
i.fi-pencil {
    margin-right: 1rem;
}
td:hover i.fi-pencil {
    visibility: visible;
    cursor: pointer;
}
</style>