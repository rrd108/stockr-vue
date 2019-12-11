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
    },

    computed: {
        search() {
            return this.$store.state.search
        },
        filteredProducts() {
            let filteredProducts = this.products

            filteredProducts.forEach(item => {
                item.hidden = false
                for (let [field, value] of Object.entries(this.search)) {

                    //remove the first tag in property list as we already on that level
                    let model = field.substr(0, field.indexOf('.'))
                    field = field.substr(field.indexOf('.') + 1)

                    if (model == 'products' && value) {
                        let fieldValue = field.split(".").reduce((a,b) => a[b], item);

                        if (!fieldValue) {
                            item.hidden = true
                            return
                        }
                        if (fieldValue.toLowerCase().indexOf(value.toLowerCase()) == -1) {
                            item.hidden = true;
                            return
                        }
                    }
                }
            })

            this.$emit('setCount', filteredProducts.filter(item => item.hidden !== true).length)
            return filteredProducts
        }
    },

}
</script>

<style scoped>
</style>