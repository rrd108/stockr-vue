<template>
  <div class="small-12 columns content">
    <h3>{{$t("products")}}</h3>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th scope="col">{{$t("products")}} {{searchResultsCount}}</th>
                <th scope="col">{{$t("code")}}</th>
                <th scope="col">{{$t("size")}}</th>
                <th scope="col">{{$t("stock")}}</th>
                <th scope="col">{{$t("sells")}}</th>
                <th scope="col" rowspan="2">{{$t("avarage purchase price")}}</th>
                <th scope="col" rowspan="2">{{$t("last purchase price")}}</th>
                <th scope="col">{{$t("amount")}}</th>
                <th scope="col">{{$t("amount")}}</th>
            </tr>
            <tr>
                <td><filter-input :search="'products.name'" placeholder="product" /></td>
                <td><filter-input :search="'products.code'" placeholder="code" /></td>
                <td><filter-input :search="'products.size'" placeholder="size" /></td>
                <td class="text-right">
                    {{stock | toNum}} {{$t("pcs")}}
                </td>
                <td class="text-right">
                    {{sells | toNum}} {{$t("pcs")}}
                </td>
                <td class="text-right">{{products.reduce((sum, product) => sum + (product.hidden ? 0 : parseInt(product.stock * product.avaragePurchasePrice)) , 0)  | toCurrency}}</td>
                <td class="text-right">{{products.reduce((sum, product) => sum + (product.hidden ? 0 : parseInt(product.stock * product.lastPurchasePrice)) , 0) | toCurrency}}</td>
            </tr>
        </thead>
        <tbody is="filtered-tbody" :products="products" @setCount="setCount($event)"></tbody>
    </table>
  </div>
</template>

<script>
import FilterInput from '@/components/FilterInput.vue'
import FilteredTbody from '@/components/FilteredProductTbody.vue'

export default {
    name: 'Stock',

    components : {
        FilterInput,
        FilteredTbody
    },

    data(){
        return {
            searchResultsCount: 0,
        }
    },

    computed: {
        products() {
            return this.$store.state.products
        },
        sells() {
            return this.products.reduce((sum, product) =>
                sum + ((product.hidden || !product.sells) ? 0 : parseInt(product.sells)),
                0)
        },
        stock() {
            return this.products.reduce((sum, product) =>
                sum + ((product.hidden || !product.stock) ? 0 : parseInt(product.stock)),
                0)
        },
    },

    created() {
        if(Object.keys(this.$store.state.products).length === 0) {
            this.$store.dispatch('getProducts')
        }
    },

    methods : {
        setCount(count) {
            this.searchResultsCount = count
        },
    }
}
</script>
