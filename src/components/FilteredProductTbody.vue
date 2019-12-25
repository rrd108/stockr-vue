<template>
    <tbody>
        <tr v-for="product in filteredItems" :key="product.id" v-show="!product.hidden">
            <td><a :href="'view/' + product.id">{{product}}</a></td>
            <td>{{code}}</td>
            <td>{{size}}</td>
            <td class="text-right">{{product.stock | toNum(0)}}</td>
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

}
</script>

<style scoped>
</style>