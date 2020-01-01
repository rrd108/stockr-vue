<template>
  <div class="small-12 columns content">
    <h3>{{$t("products")}}</h3>
    <h4><input type="date" v-model.lazy="stockDate" @blur="getStock"></h4>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th scope="col">{{$t("products")}} {{searchResultsCount}}</th>
                <th scope="col">{{$t("code")}}</th>
                <th scope="col">{{$t("size")}}</th>
                <th scope="col">{{$t("stock")}}</th>
                <th scope="col" rowspan="2">{{$t("avarage purchase price")}}</th>
                <th scope="col" rowspan="2">{{$t("last purchase price")}}</th>
                <th scope="col">{{$t("amount")}}</th>
                <th scope="col">{{$t("amount")}}</th>
            </tr>
            <tr>
                <td><filter-input :search="'products.name'" /></td>
                <td><filter-input :search="'products.code'" /></td>
                <td><filter-input :search="'products.size'" /></td>
                <td class="text-right">
                    {{products.reduce((sum, product) =>
                        sum + (product.hidden ? 0 : parseInt(product.stock))
                        , 0) | toNum(0)
                    }}
                    {{$t("pcs")}}
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
import axios from 'axios'

export default {
    name: 'Stock',

    components : {
        FilterInput,
        FilteredTbody
    },

    data(){
        return {
            products: [],
            searchResultsCount: 0,
            stockDate: (new Date()).toISOString().split('T')[0],
        }
    },

    methods : {
        getStock() {
            let products = []
            axios.get(process.env.VUE_APP_API_URL + 'products/stock.json'
                + '?company=' + this.$store.state.company.id
                + '&currency=' + this.$store.state.company.currency
                + '&ApiKey=' + this.$store.state.user.api_token
                + '&stockDate=' + this.stockDate)
                .then(resp => {
                    products = resp.data.products
                    products.forEach((product) => {
                        product.hidden = false
                    })
                    this.products = products
                })
                .catch(err => console.error(err))
        },
        setCount(count) {
            this.searchResultsCount = count
        },
    }
}
</script>
