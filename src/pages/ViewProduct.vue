<template>
  <div>
    <h3>{{ product.name }}</h3>
    <table class="vertical-table" v-if="isLoaded">
      <tr>
        <th scope="row">Termék</th>
        <td>
          <quick-edit v-model="product.name" buttonCancelText="X" @input="edit('name')" />
          -
          <quick-edit v-model="product.code" buttonCancelText="X" emptyText="kód" @input="edit('code')" />
        </td>
        <th scope="row">Méret</th>
        <td>
          <quick-edit v-model="product.size" buttonCancelText="X" emptyText="méret" @input="edit('size')" />
        </td>
        <th scope="row">ÁFA</th>
        <td>
          <quick-edit v-model="product.vat" buttonCancelText="X" emptyText="ÁFA" @input="edit('vat')" />
          %
        </td>
      </tr>
      <tr>
        <th scope="row">Beszerzés</th>
        <td class="text-right">
          {{
            toCurrency(
              product.items.reduce((total, item) => total + (item.invoice.sale ? 0 : -1 * item.price * item.quantity), 0),
              currency
            )
          }}
        </td>
        <th scope="row">Eladás</th>
        <td class="text-right">
          {{
            toCurrency(
              product.items.reduce((total, item) => total + (item.invoice.sale ? item.price * item.quantity : 0), 0),
              currency
            )
          }}
        </td>
        <th scope="row">profit</th>
        <td class="text-right">
          {{
            toCurrency(
              product.items.reduce(
                (total, item) => total + (item.invoice.sale ? item.price * item.quantity : -1 * item.price * item.quantity),
                0
              ),
              currency
            )
          }}
        </td>
      </tr>
      <tr>
        <th></th>
        <td></td>
        <th scope="row">Átlagos beszerzési ár</th>
        <td class="text-right">
          {{ toCurrency(product.avaragePurchasePrice, currency) }}
        </td>
        <th scope="row">Utolsó beszerzési ár</th>
        <td class="text-right">
          {{ toCurrency(product.lastPurchasePrice, currency) }}
        </td>
      </tr>
      <tr>
        <th scope="row">Készlet</th>
        <td class="text-right">{{ toNum(stock, 1) }}</td>
        <th scope="row">Készlet</th>
        <td class="text-right">
          {{ toCurrency(stock * product.avaragePurchasePrice, currency) }}
        </td>
        <th scope="row">Készlet</th>
        <td class="text-right">
          {{ toCurrency(stock * product.lastPurchasePrice, currency) }}
        </td>
      </tr>
      <tr>
        <th scope="row">Utolsó beszerzés</th>
        <td class="text-right">
          {{ toLocaleDateString(lastPurchase.invoice.date) }}
        </td>
        <th scope="row">Eladás</th>
        <td class="text-right">{{ toNum(totalSells, 1) }}</td>
        <th scope="row">Kifutás</th>
        <td class="text-right">{{ toLocaleDateString(runoutDate) }}</td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th>Partner</th>
          <th>Forgalom</th>
          <th>Összeg</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer">
          <th>
            {{ product.items.find(item => item.Partners.id == customer).invoice.partner.name }}
          </th>
          <td>
            {{
              product.items
                .filter(item => item.Partners.id == customer)
                .reduce((total, item) => total + (item.invoice.sale ? -1 * item.quantity : item.quantity), 0)
            }}
          </td>
          <td>
            {{
              toCurrency(
                product.items
                  .filter(item => item.Partners.id == customer)
                  .reduce((total, item) => total + (item.invoice.sale ? item.quantity * item.price : 0), 0)
              )
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th class="text-center" scope="col">Eladás</th>
          <th class="text-center" scope="col">Szám</th>
          <th class="text-center" scope="col">Dátum</th>
          <th class="text-center" scope="col">Partner</th>
          <th class="text-center" scope="col">Raktár</th>
          <th class="text-center" scope="col">Mennyiség</th>
          <th class="text-center" scope="col">Ár</th>
          <th class="text-center" scope="col">Érték</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in product.items" :key="item.id">
          <td>
            <!-- TODO create a component for this -->
            <router-link :to="`/invoices/${item.invoice.id}`">
              <i v-if="item.invoice.sale" class="fi-arrow-left out"></i>
              <i v-if="!item.invoice.sale" class="fi-arrow-right in"></i>
            </router-link>
          </td>
          <td v-html="$options.filters.invoiceNumber(item.invoice.number)"></td>
          <td>{{ toLocaleDateString(item.invoice.date) }}</td>
          <td>{{ item.invoice.partner.name }}</td>
          <td>{{ item.invoice.storage.name }}</td>
          <td class="text-right">
            {{ toNum(item.invoice.sale ? -1 * item.quantity : item.quantity, 1) }}
          </td>
          <td class="text-right">{{ toCurrency(item.price, currency) }}</td>
          <td class="text-right">
            {{
              item.invoice.sale
                ? toCurrency(item.price * item.quantity, currency)
                : toCurrency(-1 * item.price * item.quantity, currency)
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  import invoiceNumber from '@/composables/useInvoiceNumber'
  import QuickEdit from 'vue-quick-edit'
  import toCurrency from '@/composables/useToCurrency'
  import toNum from '@/composables/useToNum'
  import toLocaleDateString from '@/composables/useToLocaleDateString'

  export default {
    name: 'ViewProduct',

    components: { QuickEdit },

    data() {
      return {
        currency: this.$store.company.currency,
        editProductProperty: '',
        isLoaded: false,
        product: {},
      }
    },

    computed: {
      lastPurchase() {
        return this.product.items
          .filter(item => item.invoice.sale == false)
          .reduce((prev, current) => (prev.invoice.date < current.invoice.date ? current : prev))
      },
      customers() {
        return [
          ...new Set(this.product.items.filter(item => item.Partners.group_id != 4).map(item => item.Partners.id)),
        ].sort()
      },
      stock() {
        return this.product.items.reduce(
          (total, item) => total + (item.invoice.sale ? -1 * item.quantity : item.quantity),
          0
        )
      },
      runoutDate() {
        const lastPurchaseDate = new Date(this.lastPurchase.invoice.date)
        const daysSinceLastPurchase = (new Date() - lastPurchaseDate) / (1000 * 60 * 60 * 24)
        let runoutDays = this.lastPurchase.quantity / (this.totalSells / daysSinceLastPurchase)
        return lastPurchaseDate.setDate(lastPurchaseDate.getDate() + runoutDays)
      },
      totalSells() {
        return this.product.items.reduce((total, item) => total + (item.invoice.sale ? item.quantity : 0), 0)
      },
    },

    created() {
      axios
        .get(
          import.meta.env.VITE_API_URL +
            'products/' +
            this.$route.params.id +
            '.json?company=' +
            this.$store.company.id +
            '&ApiKey=' +
            this.$store.user.api_token
        )
        .then(response => {
          this.isLoaded = true
          this.product = response.data.product
        })
        .catch(err => console.error(err))
    },

    methods: {
      invoiceNumber,
      edit(property) {
        this.editProductProperty = false
        let product = {}
        product[property] = this.product[property]
        axios
          .patch(
            `${import.meta.env.VITE_API_URL}/products/${this.$route.params.id}.json?company=${
              this.$store.company.id
            }&ApiKey=${this.$store.user.api_token}`,
            product
          )
          .then(response =>
            this.$store.commit('updateProduct', {
              property: property,
              product: response.data.product,
            })
          )
          .catch(err => console.error(err))
      },
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
  .vue-quick-edit {
    display: inline-block;
  }
</style>
>
