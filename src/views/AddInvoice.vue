<template>
    <form @submit.prevent="saveInvoice">
        <h3 :class="isSale ? 'out' : 'in'"><i class="fi-plus"></i> {{$t("new invoice")}}</h3>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="storage-id"><i class="fi-contrast"> {{$t("storage")}}</i></label>
                <select v-model="storage_id" id="storage-id" ref="storage">
                    <option v-for="storage in storages" :key="storage.id" :value="storage.id">{{ storage.name }}</option>
                </select>
            </div>
            <div class="column small-12 large-6">
                <label for="invoicetype-id"><i class="fi-shield"> {{$t("invoice type")}}</i></label>
                <select v-model="invoicetype_id" id="invoicetype-id">
                    <option v-for="invoicetype in invoicetypes" :key="invoicetype.id" :value="invoicetype.id">{{ invoicetype.name }}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="partner-id"><i class="fi-torsos"> {{$t("partner")}}</i></label>
                <input type="text" @blur="setByPartner" v-model.lazy="partner" list="partners" id="partner-id" autocomplete="off">
                <datalist id="partners">
                    <option v-for="partner in partners" :key="partner.id">{{ partner.name }}</option>
                </datalist>
            </div>
            <div class="column small-12 large-6">
                <label for="date"><i class="fi-calendar"> {{$t("date")}}</i></label>
                <input type="date" v-model="date">
            </div>
        </div>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="number"><i class="fi-ticket"> {{$t("number")}}</i></label>
                <input type="text" v-model="number" id="number">
            </div>
            <div class="column small-12 large-3">
                <label for="currency"><i class="fi-euro"> {{$t("currency")}}</i></label>
                <input type="text" v-model="currency">
            </div>
            <div class="column small-12 large-3">
                <div :class="isSale ? 'sale out' : 'sale in'">
                    <label for="isSale"> {{isSale ? $t("sale") : $t("purchase")}}<input type="checkbox" v-model="isSale" id="isSale"></label>
                </div>
            </div>
        </div>

        <fieldset id="items" :disabled="!isHeaderReady">
        <table cellpadding="0" cellspacing="0">
            <thead>
                <tr :class="isSale ? 'out' : 'in'">
                    <th class="text-center" scope="col">{{$t("product")}}</th>
                    <th class="text-center" scope="col">{{$t("stock")}}</th>
                    <th class="text-center" scope="col">{{$t("quantity")}}</th>
                    <th class="text-center" scope="col">{{$t("cost")}}</th>
                    <th class="text-center" scope="col">{{$t("selling price")}}</th>
                    <th class="text-center" scope="col">{{$t("price")}}</th>
                    <th class="text-center" scope="col">{{$t("amount")}}</th>
                    <th class="text-center" scope="col">{{$t("vat")}}</th>
                    <th class="text-center" scope="col">{{$t("vat")}}</th>
                    <th class="text-center" scope="col">{{$t("gross amount")}}</th>
                    <th></th>
                    <!--th class="text-center group" scope="col" style="display: none;">Törzsvásárló</!--th>
                    <th class="text-center group" scope="col" style="display: none;">Viszonteladó</th>
                    <th-- class="text-center group" scope="col" style="display: none;">Kisker</th-->
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="text" v-model.lazy="product" @change="setSelectedProduct" ref="product" list="products" autocomplete="off">
                        <datalist id="products">
                            <option v-for="product in products" :key="product.id">{{ product.name }}</option>
                        </datalist>
                    </td>
                    <td class="text-right">{{selectedProduct.stock | toNum}}</td>
                    <td class="text-right">
                        <input v-model="quantity" type="number" class="quantity" required="required" step="0.01">
                    </td>
                    <td class="text-right">
                        <i v-show="selectedProduct.avaragePurchasePrice"
                            class="fi-price-tag avg" :title="$t('avarage purchase price')">
                            {{selectedProduct.avaragePurchasePrice | toCurrency}}
                        </i>
                        <br>
                        <i v-show="selectedProduct.lastPurchasePrice"
                            :title="$t('last purchase price')"
                            class="fi-price-tag last">
                            {{selectedProduct.lastPurchasePrice | toCurrency}}
                        </i>
                    </td>
                    <td class="text-right">{{selectedPartner.group ? selectedProduct.lastPurchasePrice * (1 + (selectedPartner.group.percentage / 100)) : 0 | toCurrency}}</td>
                    <td class="text-right">
                        <input v-model="price" type="number" class="price text-right" required="required" step="0.01">
                    </td>
                    <td class="text-right">{{price * quantity | toCurrency}}</td>
                    <td class="text-right">{{selectedProduct.vat}} %</td>
                    <td class="text-right">{{price * quantity * (selectedProduct.vat/100) | toCurrency}}</td>
                    <td class="text-right">{{price * quantity * (1 + (selectedProduct.vat/100)) | toCurrency}}</td>
                    <td><button @click.prevent="addItem" class="fi-arrow-down"></button></td>


                    <!--td class="text-right group" style="display: none;">
                        <input type="hidden" name="items[0][selling_price][0][group_id]" id="items-0-selling-price-0-group-id" value="1">
                        <div class="input text required">
                            <input type="text" name="items[0][selling_price][0][price]" class="price" data-percentage="35" required="required" maxlength="8" id="items-0-selling-price-0-price">
                        </div>
                    </!--td>
                    <td class="text-right group" style="display: none;">
                        <input type="hidden" name="items[0][selling_price][1][group_id]" id="items-0-selling-price-1-group-id" value="2">
                        <div class="input text required">
                            <input type="text" name="items[0][selling_price][1][price]" class="price" data-percentage="50" required="required" maxlength="8" id="items-0-selling-price-1-price">
                        </div>
                    </td>
                    <td-- class="text-right group" style="display: none;">
                        <input type="hidden" name="items[0][selling_price][2][group_id]" id="items-0-selling-price-2-group-id" value="3">
                        <div class="input text required">
                            <input type="text" name="items[0][selling_price][2][price]" class="price" data-percentage="100" required="required" maxlength="8" id="items-0-selling-price-2-price">
                        </div>
                    </td-->
                </tr>
                <tr v-for="invoiceItem in invoiceItems" :key="invoiceItem.uuid">
                    <td>{{invoiceItem.name}}</td>
                    <td class="text-right">{{invoiceItem.stock | toNum}}</td>
                    <td class="text-right">{{invoiceItem.quantity}}</td>
                    <td class="text-right">
                        <i class="fi-price-tag avg">
                            {{invoiceItem.avaragePurchasePrice | toCurrency}}
                        </i>
                        <br>
                        <i class="fi-price-tag last">
                            {{invoiceItem.lastPurchasePrice | toCurrency}}
                        </i>
                    </td>
                    <td class="text-right">{{invoiceItem.lastPurchasePrice * (1 + (selectedPartner.group.percentage / 100)) | toCurrency}}</td>
                    <td class="text-right">{{invoiceItem.price | toCurrency}}</td>
                    <td class="text-right">{{invoiceItem.price * invoiceItem.quantity | toCurrency}}</td>
                    <td class="text-right">{{invoiceItem.vat}} %</td>
                    <td class="text-right">{{invoiceItem.price * invoiceItem.quantity * (invoiceItem.vat/100) | toCurrency}}</td>
                    <td class="text-right">{{invoiceItem.price * invoiceItem.quantity * (1 + (invoiceItem.vat/100)) | toCurrency}}</td>
                    <td></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <button class="button" id="saveInvoice" type="submit">
                            <i class="fi-check"> {{$t("save")}}</i>
                        </button>
                    </td>
                    <td></td>
                    <td class="text-right">{{invoiceItems.reduce((total, item) => total + parseInt(item.quantity), 0)}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right">{{invoiceItems.reduce((total, item) => total + item.quantity * item.price, 0) | toCurrency}}</td>
                    <td class="text-right">-</td>
                    <td class="text-right">{{invoiceItems.reduce((total, item) => total + item.quantity * item.price * item.vat / 100, 0) | toCurrency}}</td>
                    <td class="text-right">{{invoiceItems.reduce((total, item) => total + item.quantity * item.price * (1 + item.vat / 100), 0) | toCurrency}}</td>
                    <!--td class="group" style="display: none;"></!--td>
                    <td class="group" style="display: none;"></td>
                    <td class="group" style="display: none;"></td>-->
                    <td></td>
                </tr>
            </tfoot>
        </table>
    </fieldset>
    </form>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AddInvoice',

    data() {
        return {
            currency: 'HUF',        // TODO
            date: (new Date()).toISOString().split('T')[0],
            invoicetypes: {},
            invoicetype_id: 0,
            invoiceItems: [],
            isSale: true,
            number: 0,
            partner: '',
            partners: {},
            price: 0,
            product: '',
            product_id: 0,
            selectedPartner: {},
            selectedProduct: {},
            storages: {},
            storage_id: 0,
            quantity: 0,
        }
    },

    // TODO hide and show table cols based on isSale

    computed: {
        isHeaderReady() {
            return (this.storage_id && this.invoicetype_id && this.selectedPartner.id && this.date && this.number && this.currency);
        },
        products() {
            return this.$store.state.products
        }
    },

    created() {
        this.number = 27

        // TODO get these from storage
        axios.get(process.env.VUE_APP_API_URL + 'storages.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.storages = response.data
            })
            .catch(err => console.error(err))

        axios.get(process.env.VUE_APP_API_URL + 'invoicetypes.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.invoicetypes = response.data
            })
            .catch(err => console.error(err))

        axios.get(process.env.VUE_APP_API_URL + 'partners.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
            .then(response => {
                this.partners = response.data
            })
            .catch(err => console.error(err))

        if(Object.keys(this.$store.state.products).length === 0) {
            this.$store.dispatch('getProducts')
        }
    },

    mounted() {
        this.$refs.storage.focus()
    },

    methods: {
        setByPartner() {
            this.selectedPartner = this.partners.find(partner => partner.name == this.partner)
            this.isSale = this.selectedPartner.group.percentage ? true : false
        },
        setSelectedProduct() {
            this.selectedProduct = this.products.find(product => product.name == this.product)
            this.product = this.selectedProduct.name
            this.price = (this.selectedProduct.lastPurchasePrice * (1 + (this.selectedPartner.group.percentage / 100))).toFixed(2)
        },
        addItem() {
            this.invoiceItems.unshift({
                uuid: Math.random().toString().substr(2),
                product_id: this.selectedProduct.id,
                name: this.selectedProduct.name,
                stock: this.selectedProduct.stock,
                quantity: this.quantity,
                avaragePurchasePrice: this.selectedProduct.avaragePurchasePrice,
                lastPurchasePrice: this.selectedProduct.lastPurchasePrice,
                percentage: this.selectedProduct.percentage,
                price: this.price,
                vat: this.selectedProduct.vat,
            })
            this.selectedProduct = {}
            this.product = ''
            this.quantity = this.price = 0
            this.$refs.product.focus()
        },
        saveInvoice() {
            // TODO do not save when data is in the inputs
            const qs = require('qs');
            let data = {
                storage_id: this.storage_id,
                invoicetype_id: this.invoicetype_id,
                partner_id: this.selectedPartner.id,
                date: this.date,
                number: this.number,
                currency: this.currency,
                sale: this.isSale ? 1 : 0,
                // TODO items array is different for purchases
                items: this.invoiceItems.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
            data = qs.stringify(data)

            axios.post(process.env.VUE_APP_API_URL + 'invoices.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token, data)
                .then(response => {
                    if (response.data.invoice.id) {
                        // TODO add the new invoice to the store
                        this.$router.push({ name: 'invoices', params: { newInvoice: response.data.invoice.number } })
                    }
                })
                .catch(error => console.log(error))
        },
    }
}
</script>

<style scoped>
h3 {
    padding: .5rem 1rem;
}
div.sale label {
    font-size: 2em;
    cursor: pointer;
    color: #fff;
}
div.sale.out label {
    background: #50bc5b;
}
div.sale.in label {
    background: #bc50b1;
}
div.sale label:before {
    margin-left: .3em;
    font-family: foundation-icons;
}

div.sale.out label:before {
    content: "\f10a";
}
div.sale.in label:before {
    content: "\f10b";
}
div.sale input {
    width: 0;
    height: 0;
}
i.avg, i.last {
    font-size: .8rem;
    margin: .2rem;
    padding: .25rem .5rem;
    border-radius: .5rem;
}
i.avg {
    background: #d0eff4;
}
i.last {
    background: #cdffc1;
}
</style>