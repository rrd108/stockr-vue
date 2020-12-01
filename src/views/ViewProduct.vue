<template>
  <div>
      <h3>{{product.name}}</h3>
      <table class="vertical-table" v-if="isLoaded">
        <tr>
            <th scope="row">{{$t("product")}}</th>
            <td>
              <span @click="setForEdit('name')" v-show="editProductProperty != 'name'">{{product.name}}</span>
              <input type="text" @blur="edit('name')" v-model="product.name" v-show="editProductProperty == 'name'">
               -
              <span @click="setForEdit('code')" v-show="editProductProperty != 'code'">#{{product.code}}</span>
              <input type="text" @blur="edit('code')" v-model="product.code" v-show="editProductProperty == 'code'">
            </td>
            <th scope="row">{{$t("size")}}</th>
            <td>{{product.size}}</td>
            <th scope="row">{{$t("vat")}}</th>
            <td>{{product.vat}} %</td>
        </tr>
        <tr>
            <th scope="row">{{$t("purchase")}}</th>
            <td class="text-right">
                {{product.items.reduce((total, item) => total +
                    (item.invoice.sale ? 0 : (-1 * item.price * item.quantity)), 0) | toCurrency(currency)}}
            </td>
            <th scope="row">{{$t("sells")}}</th>
            <td class="text-right">
                {{product.items.reduce((total, item) => total +
                    (item.invoice.sale ? (item.price * item.quantity) : 0), 0) | toCurrency(currency)}}
            </td>
            <th scope="row">{{$t("profit")}}</th>
            <td class="text-right">
                {{product.items.reduce((total, item) => total +
                  (item.invoice.sale ? (item.price * item.quantity) : (-1 * item.price * item.quantity)), 0) | toCurrency(currency)}}
            </td>
        </tr>
        <tr>
            <th></th><td></td>
            <th scope="row">{{$t("avarage purchase price")}}</th>
            <td class="text-right">{{product.avaragePurchasePrice | toCurrency(currency)}}</td>
            <th scope="row">{{$t("last purchase price")}}</th>
            <td class="text-right">{{product.lastPurchasePrice | toCurrency(currency)}}</td>
        </tr>
        <tr>
            <th scope="row">{{$t("stock")}}</th>
            <td class="text-right">{{stock | toNum(1)}}</td>
            <th scope="row">{{$t("stock")}}</th>
            <td class="text-right">{{stock * product.avaragePurchasePrice | toCurrency(currency)}}</td>
            <th scope="row">{{$t("stock")}}</th>
            <td class="text-right">{{stock * product.lastPurchasePrice | toCurrency(currency)}}</td>
        </tr>
        <tr>
            <th scope="row">{{$t("last purchase")}}</th>
            <td class="text-right">{{lastPurchase.invoice.date | toLocaleDateString}}</td>
            <th scope="row">{{$t("sells")}}</th>
            <td class="text-right">{{totalSells | toNum(1) }}</td>
            <th scope="row">{{$t("runout")}}</th>
            <td class="text-right">{{runoutDate | toLocaleDateString}}</td>
        </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th>{{$t("partner")}}</th>
          <th>{{$t("turnover")}}</th>
          <th>{{$t("amount")}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer">
          <th>
            {{product.items.find(item => item.Partners.id == customer).invoice.partner.name}}
          </th>
          <td>
            {{product.items.filter(item => item.Partners.id == customer).reduce((total, item) => total + (item.invoice.sale ? -1 * item.quantity : item.quantity), 0)}}
          </td>
          <td>
            {{product.items.filter(item => item.Partners.id == customer).reduce((total, item) => total + (item.invoice.sale ? item.quantity * item.price : 0), 0) | toCurrency}}
          </td>
        </tr>
      </tbody>
    </table>

    <table>
        <thead>
            <tr>
                <th class="text-center" scope="col">{{$t("sale")}}</th>
                <th class="text-center" scope="col">{{$t("number")}}</th>
                <th class="text-center" scope="col">{{$t("date")}}</th>
                <th class="text-center" scope="col">{{$t("partner")}}</th>
                <th class="text-center" scope="col">{{$t("storage")}}</th>
                <th class="text-center" scope="col">{{$t("quantity")}}</th>
                <th class="text-center" scope="col">{{$t("price")}}</th>
                <th class="text-center" scope="col">{{$t("value")}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in product.items" :key="item.id">
                <td>
                    <!-- TODO create a component for this -->
                    <router-link :to="'invoices/' + item.invoice.id">
                        <i v-if= "item.invoice.sale" class="fi-arrow-left out"></i>
                        <i v-if="!item.invoice.sale" class="fi-arrow-right in"></i>
                    </router-link>
                </td>
                <td v-html="$options.filters.invoiceNumber(item.invoice.number)"></td>
                <td>{{item.invoice.date | toLocaleDateString}}</td>
                <td>{{item.invoice.partner.name}}</td>
                <td>{{item.invoice.storage.name}}</td>
                <td class="text-right">{{item.invoice.sale ? -1 * item.quantity : item.quantity | toNum(1) }}</td>
                <td class="text-right">{{item.price | toCurrency(currency)}}</td>
                <td class="text-right">{{item.invoice.sale ? item.price * item.quantity : -1 * item.price * item.quantity | toCurrency(currency)}}</td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import InvoiceNumberFilterMixin from '@/mixins/InvoiceNumberFilterMixin'

export default {
  name: 'ViewProduct',

  data() {
    return {
      currency: this.$store.state.company.currency,
      editProductProperty:'',
      isLoaded: false,
      product: {},
    }
  },

  computed : {
    lastPurchase() {
      return this.product.items.filter(item => item.invoice.sale == false).reduce((prev, current) => prev.invoice.date < current.invoice.date ? current : prev)
    },
    customers() {
      return [...new Set(this.product.items.filter(item => item.Partners.group_id != 4).map(item => item.Partners.id))].sort()
    },
    stock() {
      return this.product.items.reduce((total, item) => total + (item.invoice.sale ? -1 * item.quantity : item.quantity), 0)
    },
    runoutDate() {
      const lastPurchaseDate = new Date(this.lastPurchase.invoice.date)
      const daysSinceLastPurchase = (new Date() - lastPurchaseDate) / (1000 * 60 * 60 *24)
      let runoutDays = this.lastPurchase.quantity / (this.totalSells / daysSinceLastPurchase)
      return lastPurchaseDate.setDate(lastPurchaseDate.getDate() + runoutDays)
    },
    totalSells() {
      return this.product.items.reduce((total, item) => total + (item.invoice.sale ? item.quantity : 0), 0)
    },
  },

  mixins: [
      InvoiceNumberFilterMixin,
  ],

  created() {
    axios.get(process.env.VUE_APP_API_URL + 'products/' + this.$route.params.id + '.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
      .then(response => {
        this.isLoaded = true
        this.product = response.data.product
      })
      .catch(err => console.error(err))
  },

  methods: {
    setForEdit(property) {
      this.editProductProperty = property
    },
    edit(property) {
      this.editProductProperty = false;
      let product = {}
      product[property] = this.product[property]
      axios.patch(`${process.env.VUE_APP_API_URL}/products/${this.$route.params.id}.json?company=${this.$store.state.company.id}&ApiKey=${this.$store.state.user.api_token}`, product)
        .then(response => this.$store.commit('updateProduct', {property: property, product: response.data.product}))
        .catch(err => console.error(err))
    }
  },

}
</script>

<style scoped>
span {
  cursor: pointer;
}
span:hover {
  background-color: #ffc;
}
</style>>