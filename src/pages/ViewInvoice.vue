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

  const billingo = ref({ fulfillment_date: null, due_date: null, payment_method: null, invoice_comment: null })

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
    billingo.value = {
      fulfillment_date: invoice.value.date.substr(0, 10),
      due_date: invoice.value.date.substr(0, 10),
      payment_method: 2,
      invoice_comment: '#gauranga',
    }
  }
  if (!storedInvoice) {
    // TODO we can get here only if we visit directly an url - in this case we do not have basedata
    axios
      .get(`${import.meta.env.VITE_API_URL}invoices/${route.params.id}.json?company=${store.company.id}`, store.tokenHeader)
      .then(response => {
        invoice.value = response.data.invoice
        billingo.value = {
          fulfillment_date: invoice.value.date.substr(0, 10),
          due_date: invoice.value.date.substr(0, 10),
          payment_method: 2,
          invoice_comment: '#gauranga',
        }
      })
      .catch(error => console.error(error))
  }

  const deleteInvoice = () =>
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}invoices/delete/${invoice.value.id}.json?company=${store.company.id}`,
        store.tokenHeader
      )
      .then(response => {
        invoice.value.status = 'd'
        store.invoices.find(inv => inv.id == invoice.value.id).status = 'd'
      })
      .catch(error => console.error(error))

  const onEdit = ref(false)
  const changeInvoicetype = () => {
    {
      onEdit.value = !onEdit.value
      axios
        .put(
          `${import.meta.env.VITE_API_URL}invoices/edit/${invoice.value.id}.json?company=${store.company.id}`,
          store.tokenHeader,
          {
            id: invoice.value.id,
            invoicetype_id: invoice.value.invoicetype_id,
          }
        )
        .then(() => {
          invoice.value.invoicetype = store.invoicetypes.find(invoicetype => invoicetype.id == invoice.value.invoicetype_id)
          const storedInvoce = store.invoices.find(inv => inv.id == invoice.value.id)
          storedInvoce.invoicetype_id = invoice.value.invoicetype_id
          storedInvoce.invoicetype = invoice.value.invoicetype
        })
        .catch(error => console.error(error))
    }
  }

  const getPdf = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}invoices/${invoice.value.id}.pdf?company=${store.company.id}`,
        store.tokenHeader,
        { responseType: 'arraybuffer' }
      )
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', invoice.value.id + '.pdf')
        document.body.appendChild(link)
        link.click()
      })
      .catch(error => console.log(error))
  }

  const onInvoicing = ref(false)
  const generateInvoice = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}invoices/billingo/${invoice.value.id}.json?company=${
          store.company.id
        }&,store.tokenHeaderdue_date=${billingo.due_date}&fulfillment_date=${billingo.fulfillment_date}&payment_method=${
          billingo.payment_method
        }&invoice_comment=${billingo.invoice_comment}`
      )
      .then(response => {
        invoice.value.number = response.data.invoice.number
        onInvoicing.value = false
      })
      .catch(error => {
        console.error(error)
        onInvoicing.value = false
      })
  }
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
            <i class="fi-pencil" v-show="!onEdit" @click="onEdit = !onEdit"> {{ invoice.invoicetype.name }}</i>
            <select v-model="invoice.invoicetype_id" v-show="onEdit" @change="changeInvoicetype">
              <option v-for="invoicetype in store.invoicetypes" :key="invoicetype.id" :value="invoicetype.id">
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
              Billingo
            </i>
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
          <td class="text-right">{{ toCurrency(item.price, invoice.currency) }}</td>
          <td class="text-right">
            {{ toCurrency(item.price * item.quantity, invoice.currency) }}
          </td>
          <td class="text-right">{{ item.product.vat }} %</td>
          <td class="text-right">
            {{ toCurrency((item.product.vat * item.price * item.quantity) / 100, invoice.currency) }}
          </td>
          <td class="text-right">
            {{ toCurrency(item.price * item.quantity * (1 + item.product.vat / 100), invoice.currency) }}
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
                invoice.currency
              )
            }}
          </td>
          <td></td>
          <td class="text-right">
            {{
              toCurrency(
                invoice.items.reduce((total, item) => total + (item.price * item.quantity * item.product.vat) / 100, 0),
                invoice.currency
              )
            }}
          </td>
          <td class="text-right">
            {{
              toCurrency(
                invoice.items.reduce((total, item) => total + item.price * item.quantity * (1 + item.product.vat / 100), 0),
                invoice.currency
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
        <dd><input type="date" v-model="billingo.fulfillment_date" /></dd>
        <dt>Fizetési határidő</dt>
        <dd><input type="date" v-model="billingo.due_date" /></dd>
        <dt>Fizetési mód</dt>
        <dd>
          <input type="radio" id="kp" value="1" v-model="billingo.payment_method" />
          <label for="kp">Készpénz</label>
          <br />
          <input type="radio" id="transfer" value="2" v-model="billingo.payment_method" />
          <label for="transfer">Átutalás</label>
        </dd>
        <dt>Megjegyzés a számlára</dt>
        <dd><input type="text" v-model="billingo.invoice_comment" /></dd>
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
