<template>
  <div>
      <h3>{{product.name}}</h3>
      <table class="vertical-table" v-if="isLoaded">
        <tr>
            <th scope="row">{{$t("product")}}</th>
            <td>{{product.name}}</td>
            <th scope="row">{{$t("size")}}</th>
            <td>{{product.size}}</td>
            <th scope="row">{{$t("code")}}</th>
            <td>{{product.code}}</td>
            <th scope="row">{{$t("vat")}}</th>
            <td>{{product.vat}}</td>
        </tr>
        <tr>
            <th scope="row">{{$t("profit")}}</th>
            <td class="text-right">
                {{product.items.reduce((total, item) => total +
                    (item.invoice.sale ? (item.price * item.quantity) : (-1 * item.price * item.quantity)), 0)}}
            </td>
            <th scope="row">{{$t("Stock value by avarage price")}}</th>
            <td class="text-right"></td>
            <th scope="row">{{$t("stock")}}</th>
            <td class="text-right"></td>
            <th scope="row">{{$t("Stock value by last price")}}</th>
            <td class="text-right"></td>
        </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ViewProduct',

    data() {
        return {
            isLoaded: false,
            product: {},
        }
    },

    created() {
        axios.get(process.env.VUE_APP_API_URL + 'products/' + this.$route.params.id + '.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.isLoaded = true
                this.product = response.data.product
            })
            .catch(err => console.error(err))
    },

}
</script>

<style scoped>

</style>>