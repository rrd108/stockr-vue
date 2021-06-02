<template>
  <div v-if="isLoaded" class="small-12 columns content">
    <h3>
      {{ invoice.storage.company.name }}
      <i
        class="fi-trash"
        @click="deleteInvoice"
        v-show="invoice.status != 'd'"
      ></i>
    </h3>

    <table class="vertical-table" :class="{ deleted: invoice.status == 'd' }">
      <tbody>
        <tr>
          <th scope="row">{{ $t('partner') }}</th>
          <td>{{ invoice.partner.name }}</td>
          <th scope="row">{{ $t('storage') }}</th>
          <td>{{ invoice.storage.name }}</td>
        </tr>
        <tr>
          <th scope="row">{{ $t('invoice type') }}</th>
          <td class="pointer">
            <i class="fi-pencil" v-show="!onEdit" @click="changeInvoicetype">
              {{ invoice.invoicetype.name }}</i
            >
            <select
              v-model="invoicetype_id"
              v-show="onEdit"
              @change="changeInvoicetype"
            >
              <option
                v-for="invoicetype in invoicetypes"
                :key="invoicetype.id"
                :value="invoicetype.id"
              >
                {{ invoicetype.name }}
              </option>
            </select>
          </td>
          <th scope="row">{{ $t('date') }}</th>
          <td>{{ invoice.date | toLocaleDateString }}</td>
        </tr>
        <tr>
          <th scope="row">{{ $t('number') }}</th>
          <td>
            <span
              v-html="$options.filters.invoiceNumber(invoice.number)"
            ></span>
            <i
              v-if="
                invoice.partner.group.id != 4 &&
                invoice.number.indexOf('|') == -1
              "
              @click="onInvoicing = true"
              class="fi-page-export-pdf pointer"
            >
              Billingo</i
            >
          </td>
          <th scope="row">{{ $t('type') }}</th>
          <td>{{ invoice.sale ? $t('sale') : $t('purchase') }}</td>
        </tr>
        <tr>
          <th scope="row">{{ $t('currency') }}</th>
          <td>{{ invoice.currency }}</td>
          <th scope="row">PDF</th>
          <td>
            <i @click="getPdf" class="fi-page-export-pdf pointer"> PDF</i>
          </td>
        </tr>
      </tbody>
    </table>

    <table
      cellpadding="0"
      cellspacing="0"
      :class="{ deleted: invoice.status == 'd' }"
    >
      <thead>
        <tr :class="invoice.sale ? 'out' : 'in'">
          <th class="text-center" scope="col">{{ $t('product') }}</th>
          <th class="text-center" scope="col">{{ $t('quantity') }}</th>
          <th class="text-center" scope="col">{{ $t('price') }}</th>
          <th class="text-center" scope="col">{{ $t('amount') }}</th>
          <th class="text-center" scope="col">{{ $t('vat') }}</th>
          <th class="text-center" scope="col">{{ $t('vat') }}</th>
          <th class="text-center" scope="col">{{ $t('gross amount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in invoice.items" :key="item.id">
          <td>
            {{ item.product.name }} {{ item.product.size }}
            {{ item.product.code }}
          </td>
          <td class="text-right">{{ item.quantity }}</td>
          <td class="text-right">{{ item.price | toCurrency(currency) }}</td>
          <td class="text-right">
            {{ (item.price * item.quantity) | toCurrency(currency) }}
          </td>
          <td class="text-right">{{ item.product.vat }} %</td>
          <td class="text-right">
            {{
              ((item.product.vat * item.price * item.quantity) / 100)
                | toCurrency(currency)
            }}
          </td>
          <td class="text-right">
            {{
              (item.price * item.quantity * (1 + item.product.vat / 100))
                | toCurrency(currency)
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>{{ $t('total') }}</td>
          <td class="text-right">
            {{
              invoice.items.reduce(
                (total, item) => total + parseInt(item.quantity),
                0
              ) | toNum(1)
            }}
          </td>
          <td></td>
          <td class="text-right">
            {{
              invoice.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              ) | toCurrency(currency)
            }}
          </td>
          <td></td>
          <td class="text-right">
            {{
              invoice.items.reduce(
                (total, item) =>
                  total + (item.price * item.quantity * item.product.vat) / 100,
                0
              ) | toCurrency(currency)
            }}
          </td>
          <td class="text-right">
            {{
              invoice.items.reduce(
                (total, item) =>
                  total +
                  item.price * item.quantity * (1 + item.product.vat / 100),
                0
              ) | toCurrency(currency)
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
          <input type="radio" id="kp" value="1" v-model="payment_mode" />
          <label for="kp">Készpénz</label>
          <br />
          <input type="radio" id="transfer" value="2" v-model="payment_mode" />
          <label for="transfer">Átutalás</label>
        </dd>
        <dt>Megjegyzés a számlára</dt>
        <dd><input type="text" v-model="invoice_comment" /></dd>
      </dl>
      <button class="button" @click="generateInvoice">Számlázás</button>
    </aside>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ViewInvoce',

  data() {
    return {
      api: '',
      currency: this.$store.state.company.currency,
      due_date: null,
      fulfillment_date: null,
      onEdit: false,
      onInvoicing: false,
      invoice: {},
      invoice_comment: '#gauranga',
      invoicetype_id: 0,
      isLoaded: false,
      payment_mode: 2,
    }
  },

  computed: {
    invoicetypes() {
      return this.$store.state.invoicetypes
    },
  },

  created() {
    if (Object.keys(this.$store.state.invoicetypes).length === 0) {
      this.$store.dispatch('getInvoicetypes')
    }

    this.api = process.env.VUE_APP_API_URL

    axios
      .get(
        process.env.VUE_APP_API_URL +
          'invoices/' +
          this.$route.params.id +
          '.json?company=' +
          this.$store.state.company.id +
          '&ApiKey=' +
          this.$store.state.user.api_token
      )
      .then((response) => {
        this.invoice = response.data.invoice
        this.fulfillment_date = this.due_date = response.data.invoice.date.substr(
          0,
          10
        )
        this.isLoaded = true
      })
      .catch((err) => console.error(err))
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
        this.invoice.invoicetype = this.invoicetypes.find(
          (invoicetype) => invoicetype.id == this.invoicetype_id
        )

        const qs = require('qs')
        let data = {
          id: this.invoice.id,
          invoicetype_id: this.invoicetype_id,
        }
        // TODO axios.put does not work as sends out an OPTIONS request what gets a 302 response
        axios
          .post(
            process.env.VUE_APP_API_URL +
              'invoices/edit/' +
              this.invoice.id +
              '.json?company=' +
              this.$store.state.company.id +
              '&ApiKey=' +
              this.$store.state.user.api_token,
            qs.stringify(data)
          )
          .then(() => {
            this.$store.commit(
              'setInvoices',
              this.$store.state.invoices.map((invoice) =>
                invoice.id == this.invoice.id ? this.invoice : invoice
              )
            )
          })
          .catch((error) => console.log(error))
      } else {
        this.invoicetype_id = this.invoice.invoicetype.id
      }
    },

    deleteInvoice() {
      // TODO update status data in the store also
      axios
        .delete(
          `${process.env.VUE_APP_API_URL}invoices/delete/${this.invoice.id}.json?company=${this.$store.state.company.id}&ApiKey=${this.$store.state.user.api_token}`
        )
        .then((response) => console.log(response))
        .catch((error) => console.error(error))
    },

    generateInvoice() {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}invoices/billingo/${this.invoice.id}.json?company=${this.$store.state.company.id}&ApiKey=${this.$store.state.user.api_token}&due_date=${this.due_date}&fulfillment_date=${this.fulfillment_date}&payment_mode=${this.payment_mode}&invoice_comment=${this.invoice_comment}`
        )
        .then((response) => {
          this.invoice.number = response.data.invoice.number
        })
        .catch((error) => console.log(error))
    },

    getPdf() {
      axios({
        method: 'get',
        url:
          process.env.VUE_APP_API_URL +
          'invoices/' +
          this.invoice.id +
          '.pdf?company=' +
          this.$store.state.company.id +
          '&ApiKey=' +
          this.$store.state.user.api_token,
        responseType: 'arraybuffer',
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', this.invoice.id + '.pdf')
          document.body.appendChild(link)
          link.click()
        })
        .catch((error) => console.log(error))
    },
  },
}
</script>

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
  font-weight:bold;
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
</style>>