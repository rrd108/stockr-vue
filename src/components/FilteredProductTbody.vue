<template>
    <tbody>
        <tr v-for="product in filteredItems" :key="product.id">
            <td>
                <router-link :to="'products/' + product.id">
                    <i class="fi-foot"> {{product.name}}</i>
                </router-link>
            </td>
            <td>{{product.code}}</td>
            <td>{{product.size}}</td>
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