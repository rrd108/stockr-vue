<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  import { useStockrStore } from '@/stores'

  import toCurrency from '@/composables/useToCurrency'
  import toNum from '@/composables/useToNum'
  import toLocaleDateString from '@/composables/useToLocaleDateString'
  import invoiceNumber from '@/composables/useInvoiceNumber'

  const store = useStockrStore()
  const route = useRoute()

  const invoice = ref({})

  const storedInvoice = store.invoices.find(invoice => invoice.id == route.params.id)
  if (storedInvoice) {
    const storage = store.storages.find(storage => storage.id == storedInvoice.storage_id)
    invoice.value = {
      ...storedInvoice,
      storage: {
        ...storage,
        company: store.company,
      },
      partner: store.partners.find(partner => partner.id == storedInvoice.partner_id),
      items: [
        ...storedInvoice.items.map(item => ({
          ...item,
          product: store.products.find(product => product.id == item.product_id),
        })),
      ],
    }
  }

  /*  export default {
    name: 'ViewInvoce',

    data() {
      return {
        api: '',
        currency: this.$store.company.currency,
        due_date: null,
        fulfillment_date: null,
        onEdit: false,
        onInvoicing: false,
        invoice: {},
        invoice_comment: '#gauranga',
        invoicetype_id: 0,
        isLoaded: false,
        payment_method: 2,
      }
    },

    computed: {
      invoicetypes() {
        return this.$store.invoicetypes
      },
    },

    created() {
      if (Object.keys(this.$store.invoicetypes).length === 0) {
        this.$store.dispatch('getInvoicetypes')
      }

      this.api = import.meta.env.VITE_API_URL

      axios
        .get(
          import.meta.env.VITE_API_URL +
            'invoices/' +
            this.$route.params.id +
            '.json?company=' +
            this.$store.company.id +
            '&ApiKey=' +
            this.$store.user.api_token
        )
        .then(response => {
          this.invoice = response.data.invoice
          this.fulfillment_date = this.due_date = response.data.invoice.date.substr(0, 10)
          this.isLoaded = true
        })
        .catch(err => console.error(err))
    },

    filters: {
      // TODO move out to a mixin as tha same code is used at FilteredInvoiceTbody
      invoiceNumber(value) {
        if (value.indexOf('|') != -1) {
          value = value.split('|')
          value =
            value[0] +
            '<a href="' +
            value[2] +
            '">\
                    <i class="fi-page-pdf"></i> ' +
            value[1] +
            '\
                    </a>'
        }
        return value + ' '
      },
    },

    methods: {
      changeInvoicetype() {
        this.onEdit = !this.onEdit
        if (this.invoicetype_id) {
          this.invoice.invoicetype = this.invoicetypes.find(invoicetype => invoicetype.id == this.invoicetype_id)

          let data = {
            id: this.invoice.id,
            invoicetype_id: this.invoicetype_id,
          }
          // TODO axios.put does not work as sends out an OPTIONS request what gets a 302 response
          axios
            .post(
              import.meta.env.VITE_API_URL +
                'invoices/edit/' +
                this.invoice.id +
                '.json?company=' +
                this.$store.company.id +
                '&ApiKey=' +
                this.$store.user.api_token,
              data
            )
            .then(() => {
              this.$store.commit(
                'setInvoices',
                this.$store.invoices.map(invoice => (invoice.id == this.invoice.id ? this.invoice : invoice))
              )
            })
            .catch(error => console.log(error))
        } else {
          this.invoicetype_id = this.invoice.invoicetype.id
        }
      },

      deleteInvoice() {
        // TODO update status data in the store also
        axios
          .delete(
            `${import.meta.env.VITE_API_URL}invoices/delete/${this.invoice.id}.json?company=${
              this.$store.company.id
            }&ApiKey=${this.$store.user.api_token}`
          )
          .then(response => console.log(response))
          .catch(error => console.error(error))
      },

      generateInvoice() {
        axios
          .get(
            `${import.meta.env.VITE_API_URL}invoices/billingo/${this.invoice.id}.json?company=${
              this.$store.company.id
            }&ApiKey=${this.$store.user.api_token}&due_date=${this.due_date}&fulfillment_date=${
              this.fulfillment_date
            }&payment_method=${this.payment_method}&invoice_comment=${this.invoice_comment}`
          )
          .then(response => {
            this.invoice.number = response.data.invoice.number
            this.onInvoicing = false
          })
          .catch(error => {
            console.log(error)
            this.onInvoicing = false
          })
      },

      getPdf() {
        axios({
          method: 'get',
          url:
            import.meta.env.VITE_API_URL +
            'invoices/' +
            this.invoice.id +
            '.pdf?company=' +
            this.$store.company.id +
            '&ApiKey=' +
            this.$store.user.api_token,
          responseType: 'arraybuffer',
        })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', this.invoice.id + '.pdf')
            document.body.appendChild(link)
            link.click()
          })
          .catch(error => console.log(error))
      },
    },
  }*/
</script>

<template>
  <div v-if="invoice.id" class="small-12 columns content">
    <h3>
      {{ invoice.storage.company.name }}
      <i class="fi-trash" @click="deleteInvoice" v-show="invoice.status != 'd'"></i>
    </h3>

    <table class="vertical-table" :class="{ deleted: invoice.status == 'd' }">
      <tbody>
        <tr>
          <th scope="row">Partner</th>
          <td>{{ invoice.partner.name }}</td>
          <th scope="row">Raktár</th>
          <td>{{ invoice.storage.name }}</td>
        </tr>
        <tr>
          <th scope="row">Bizonylat típus</th>
          <td class="pointer">
            <i class="fi-pencil" v-show="!onEdit" @click="changeInvoicetype"> {{ invoice.invoicetype.name }}</i>
            <select v-model="invoicetype_id" v-show="onEdit" @change="changeInvoicetype">
              <option v-for="invoicetype in invoicetypes" :key="invoicetype.id" :value="invoicetype.id">
                {{ invoicetype.name }}
              </option>
            </select>
          </td>
          <th scope="row">Dátum</th>
          <td>{{ toLocaleDateString(invoice.date) }}</td>
        </tr>
        <tr>
          <th scope="row">Szám</th>
          <td>
            <span v-html="invoiceNumber(invoice.number)"></span>
            <i
              v-if="invoice.partner.group.id != 4 && invoice.number.indexOf('|') == -1"
              @click="onInvoicing = true"
              class="fi-page-export-pdf pointer"
            >
              Billingo</i
            >
          </td>
          <th scope="row">Típus</th>
          <td>{{ invoice.sale ? 'Eladás' : 'Beszerzés' }}</td>
        </tr>
        <tr>
          <th scope="row">Valuta</th>
          <td>{{ invoice.currency }}</td>
          <th scope="row">PDF</th>
          <td>
            <i @click="getPdf" class="fi-page-export-pdf pointer"> PDF</i>
          </td>
        </tr>
      </tbody>
    </table>

    <table cellpadding="0" cellspacing="0" :class="{ deleted: invoice.status == 'd' }">
      <thead>
        <tr :class="invoice.sale ? 'out' : 'in'">
          <th class="text-center" scope="col">Termék</th>
          <th class="text-center" scope="col">Mennyiség</th>
          <th class="text-center" scope="col">Ár</th>
          <th class="text-center" scope="col">Összeg</th>
          <th class="text-center" scope="col">ÁFA</th>
          <th class="text-center" scope="col">ÁFA</th>
          <th class="text-center" scope="col">Bruttó</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in invoice.items" :key="item.id">
          <td>
            {{ item.product.name }} {{ item.product.size }} {{ item.product.code }} <i>{{ item.product.en_name }}</i>
          </td>
          <td class="text-right">{{ item.quantity }}</td>
          <td class="text-right">{{ toCurrency(item.price, currency) }}</td>
          <td class="text-right">
            {{ toCurrency(item.price * item.quantity, currency) }}
          </td>
          <td class="text-right">{{ item.product.vat }} %</td>
          <td class="text-right">
            {{ toCurrency((item.product.vat * item.price * item.quantity) / 100, currency) }}
          </td>
          <td class="text-right">
            {{ toCurrency(item.price * item.quantity * (1 + item.product.vat / 100), currency) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>Összesen</td>
          <td class="text-right">
            {{
              toNum(
                invoice.items.reduce((total, item) => total + parseInt(item.quantity), 0),
                1
              )
            }}
          </td>
          <td></td>
          <td class="text-right">
            {{
              toCurrency(
                invoice.items.reduce((total, item) => total + item.price * item.quantity, 0),
                currency
              )
            }}
          </td>
          <td></td>
          <td class="text-right">
            {{
              toCurrency(
                invoice.items.reduce((total, item) => total + (item.price * item.quantity * item.product.vat) / 100, 0),
                currency
              )
            }}
          </td>
          <td class="text-right">
            {{
              toCurrency(
                invoice.items.reduce((total, item) => total + item.price * item.quantity * (1 + item.product.vat / 100), 0),
                currency
              )
            }}
          </td>
        </tr>
      </tfoot>
    </table>

    <aside v-show="onInvoicing">
      <h2>Billingo számla kiállítás <span @click="onInvoicing = false">x</span></h2>
      <dl>
        <dt>Teljesítés dátuma</dt>
        <dd><input type="date" v-model="fulfillment_date" /></dd>
        <dt>Fizetési határidő</dt>
        <dd><input type="date" v-model="due_date" /></dd>
        <dt>Fizetési mód</dt>
        <dd>
          <input type="radio" id="kp" value="1" v-model="payment_method" />
          <label for="kp">Készpénz</label>
          <br />
          <input type="radio" id="transfer" value="2" v-model="payment_method" />
          <label for="transfer">Átutalás</label>
        </dd>
        <dt>Megjegyzés a számlára</dt>
        <dd><input type="text" v-model="invoice_comment" /></dd>
      </dl>
      <button class="button" @click="generateInvoice">Számlázás</button>
    </aside>
  </div>
</template>

<style scoped>
  h3 {
    display: flex;
    justify-content: space-between;
  }

  aside {
    box-sizing: border-box;
    position: absolute;
    top: 20vh;
    left: 10vw;
    width: 80vw;
    padding: 1rem;
    background-color: #50bc5b;
    color: #fff;
    border-radius: 0.5rem;
  }
  h2 {
    display: flex;
    justify-content: space-between;
  }
  h2 span {
    cursor: pointer;
    background: #fff;
    color: #50bc5b;
    border-radius: 50%;
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
    height: 1.2rem;
    width: 1.2rem;
  }
  dd {
    display: flex;
    align-items: baseline;
  }
  label {
    color: #fff;
  }
</style>
>
