<template>
    <div>
        <h3 :class="isSale ? 'out' : 'in'"><i class="fi-plus"></i> {{$t("new invoice")}}</h3>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="storage-id">{{$t("storage")}}</label>
                <select v-model="storage_id" id="storage-id">
                    <option v-for="storage in storages" :key="storage.id" :value="storage.id">{{ storage.name }}</option>
                </select>
            </div>
            <div class="column small-12 large-6">
                <label for="invoicetype-id">{{$t("invoice type")}}</label>
                <select v-model="invoicetype_id" id="invoicetype-id">
                    <option v-for="invoicetype in invoicetypes" :key="invoicetype.id" :value="invoicetype.id">{{ invoicetype.name }}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="partner-id">{{$t("partner")}}</label>
                <input type="text" @blur="setByPartner" v-model.lazy="partner" list="partners" id="partner-id" autocomplete="off">
                <datalist id="partners">
                    <option v-for="partner in partners" :key="partner.id">{{ partner.name }}</option>
                </datalist>
            </div>
            <div class="column small-12 large-6">
                <label for="date">{{$t("date")}}</label>
                <input type="date" v-model="date">
            </div>
        </div>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="number">{{$t("number")}}</label>
                <input type="text" v-model="number" id="number" name="number">
            </div>
            <div class="column small-12 large-3">
                <label for="currency">{{$t("currency")}}</label>
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
                    <th class="text-center" scope="col">Termék</th>
                    <th class="text-center" scope="col">Készlet</th>
                    <th class="text-center" scope="col">Mennyiség</th>
                    <th class="text-center" scope="col">Beszerzési ár</th>
                    <th class="text-center" scope="col">Eladási ár</th>
                    <th class="text-center" scope="col">Ár</th>
                    <th class="text-center" scope="col">Összeg</th>
                    <th class="text-center" scope="col">ÁFA</th>
                    <th class="text-center" scope="col">ÁFA</th>
                    <th class="text-center" scope="col">Bruttó összeg</th>
                    <th class="text-center group" scope="col" style="display: none;">Törzsvásárló</th>
                    <th class="text-center group" scope="col" style="display: none;">Viszonteladó</th>
                    <th class="text-center group" scope="col" style="display: none;">Kisker</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="text" id="__items-0-product-id" name="__items[0][product_id]" list="datalist-items-0-product-id" autocomplete="off">
                        <datalist id="datalist-items-0-product-id" type="datalistJs">
                            <option value="0">TODO</option>
                        </datalist>
                    </td>
                    <td class="text-right">0</td>
                    <td class="text-right">
                        <input type="number" name="items[0][quantity]" class="quantity" required="required" step="1" id="items-0-quantity">
                    </td>
                    <td class="text-right">0</td>
                    <td class="text-right">0</td>
                    <td>
                        <input type="number" name="items[0][price]" class="net price text-right" required="required" step="1" id="items-0-price">
                    </td>
                    <td class="text-right">0</td>
                    <td class="text-right">0</td>
                    <td class="text-right">0</td>
                    <td class="text-right">0</td>
                    <td class="text-right group" style="display: none;">
                        <input type="hidden" name="items[0][selling_price][0][group_id]" id="items-0-selling-price-0-group-id" value="1">
                        <div class="input text required">
                            <input type="text" name="items[0][selling_price][0][price]" class="price" data-percentage="35" required="required" maxlength="8" id="items-0-selling-price-0-price">
                        </div>
                    </td>
                    <td class="text-right group" style="display: none;">
                        <input type="hidden" name="items[0][selling_price][1][group_id]" id="items-0-selling-price-1-group-id" value="2">
                        <div class="input text required">
                            <input type="text" name="items[0][selling_price][1][price]" class="price" data-percentage="50" required="required" maxlength="8" id="items-0-selling-price-1-price">
                        </div>
                    </td>
                    <td class="text-right group" style="display: none;">
                        <input type="hidden" name="items[0][selling_price][2][group_id]" id="items-0-selling-price-2-group-id" value="3">
                        <div class="input text required">
                            <input type="text" name="items[0][selling_price][2][price]" class="price" data-percentage="100" required="required" maxlength="8" id="items-0-selling-price-2-price">
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <button class="button" id="addNewRow" type="button">
                            <i class="fi-plus"> New Row</i>
                        </button>&nbsp;
                        <button class="button" id="saveInvoice" type="submit">
                            <i class="fi-check"> Save Invoice</i>
                        </button>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right">0</td>
                    <td></td>
                    <td class="text-right">0</td>
                    <td class="text-right">0</td>
                    <td class="group" style="display: none;"></td>
                    <td class="group" style="display: none;"></td>
                    <td class="group" style="display: none;"></td>
                </tr>
            </tfoot>
        </table>
    </fieldset>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AddInvoice',

    data() {
        return {
            isSale: true,
            storages: {},
            storage_id: 0,
            invoicetypes: {},
            invoicetype_id: 0,
            partners: {},
            partner: '',
            partner_id: 0,
            date: (new Date()).toISOString().split('T')[0],
            number: Math.random().toString().substr(2),
            currency: 'HUF',
        }
    },

    // TODO hide and swo table cols based on isSale

    computed: {
        isHeaderReady() {
            return (this.storage_id && this.invoicetype_id && this.partner_id && this.date && this.number && this.currency);
        }
    },

    created() {
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
    },

    methods: {
        setByPartner() {
            let partner = this.partners.find(partner => partner.name == this.partner)
            this.partner_id = partner.id
            this.isSale = partner.group.percentage ? true : false
        }
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
</style>