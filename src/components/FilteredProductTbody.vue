<template>
    <tbody>
        <tr v-for="product in filteredProducts" :key="product.id" v-show="!product.hidden">
            <td><a :href="'view/' + product.id">{{product.name}}</a></td>
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

export default {
    name: 'FilteredTbody',

    props: {
        products: {
            type: Array,
            required: true
        },
        search: {type: Object},
    },

    computed: {
        filteredProducts() {
            let filteredProducts = this.products

            if (this.search.val) {
                let field = this.search.field.split('.')[1]

                filteredProducts.forEach((item) => {
                    if (!item[field]) {
                        item.hidden = true
                        return
                    }
                    item.hidden = (item[field].toLowerCase().indexOf(this.search.val.toLowerCase()) == -1) ? true : false
                })
            } else {
                filteredProducts.forEach((item) => {
                    item.hidden = false
                })
            }
            this.$emit('setCount', filteredProducts.filter(item => item.hidden !== true).length)
            return filteredProducts
        }
    },

}
</script>

<style scoped>
</style>