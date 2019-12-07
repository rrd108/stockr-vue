<template>
  <div class="small-12 columns content">
    <h3>{{$t("products")}}</h3>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th scope="col">{{$t("name")}} {{searchResultsCount}} {{$t("products")}}</th>
                <th scope="col">{{$t("code")}}</th>
                <th scope="col">{{$t("size")}}</th>
                <th scope="col">{{$t("stock")}}</th>
                <th scope="col" rowspan="2">Avarage purchase price</th>
                <th scope="col" rowspan="2">Last purchase price</th>
                <th scope="col">Value</th>
                <th scope="col">Value</th>
            </tr>
            <tr>
                <td><filter-input search="products.name" @row-filter="filterRow($event)" /></td>
                <td><filter-input search="products.code" /></td>
                <td><filter-input search="products.size" /></td>
                <td class="text-right">
                    {{products.reduce((sum, product) =>
                        sum + (product.hidden ? 0 : parseInt(product.stock))
                        , 0) | toNum(0)
                    }}
                    pcs
                </td>
                <td class="text-right">{{products.reduce((sum, product) => sum + (product.hidden ? 0 : parseInt(product.stock * product.avaragePurchasePrice)) , 0)  | toCurrency}}</td>
                <td class="text-right">{{products.reduce((sum, product) => sum + (product.hidden ? 0 : parseInt(product.stock * product.lastPurchasePrice)) , 0) | toCurrency}}</td>
            </tr>
        </thead>
        <tbody is="filtered-tbody" :products="products" :search="search"></tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
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
            products: [],
            searchResultsCount: 0,
            search: {},
        }
    },

    created() {
        //we use query string ApiKey as axios not sending out the ApiKey header
        axios.get(process.env.VUE_APP_API_URL + 'products/stock.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
        .then(resp => {
            let products = resp.data
            products.forEach((product) => {
                product.hidden = false;
            })
            this.products = products
            this.searchResultsCount = products.length
        })
        .catch(err => console.error(err));
    },

    methods : {
        filterRow(search) {
            this.search = search
        }
    }
}
</script>
