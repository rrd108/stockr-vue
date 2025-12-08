<script setup>
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import axios from 'axios'
  import { useStockrStore } from '@/stores'
  import { useRouter } from 'vue-router'
  import toNum from '@/composables/useToNum'
  import toCurrency from '@/composables/useToCurrency'
  import useProductNameProps from '@/composables/useProductNameProps'

  const store = useStockrStore()
  const { invoices, products } = storeToRefs(store)
  const router = useRouter()

  const setNumber = () => {
    let year = new Date().getFullYear()
    let number = year + '/' + 1
    if (invoices.value && Array.isArray(invoices.value) && invoices.value.length > 0) {
      let lastSellInvoice = invoices.value.find(invoice => invoice.number && invoice.number.match(new RegExp(year + '/')))
      if (lastSellInvoice) {
        number = parseInt(lastSellInvoice.number.substr(lastSellInvoice.number.indexOf('/') + 1)) + 1
        number = year + '/' + number
      }
    }
    return number
  }

  const invoice = ref({
    storage_id: 0,
    invoicetype_id: 0,
    partner: '',
    date: new Date().toISOString().split('T')[0],
    number: setNumber(),
    currency: 'HUF',
    items: [],
  })

  const invoicePartner = computed(() => {
    if (!invoice.value.partner) {
      return { group: { percentage: 1 } }
    }
    return store.partners && Array.isArray(store.partners) ? store.partners.find(partner => partner.name == invoice.value.partner) : null
  })
  const isSale = computed(() => (invoicePartner.value && invoicePartner.value.group ? invoicePartner.value.group.percentage : 0))

  const isHeaderReady = computed(
    () =>
      invoice.value.storage_id && invoice.value.invoicetype_id && invoice.value.partner && invoice.value.date && invoice.value.number && invoice.value.currency
  )
  const buyerGroups = computed(() => (store.groups && Array.isArray(store.groups) ? store.groups.filter(group => group.percentage > 0) : []))

  const showProductsOnlyInStock = ref(true)
  const productsToShow = computed(() => {
    if (!products.value || !Array.isArray(products.value)) {
      return []
    }
    return showProductsOnlyInStock.value ? products.value.filter(product => product.stock > 0) : products.value
  })

  const emptyItem = {
    product: '',
    quantity: 0,
    price: 0,
  }
  const item = ref({ ...emptyItem })
  const sellingPrices = ref({})

  const selectedProduct = ref({})
  const setSelectedProduct = () => {
    if (!products.value || !Array.isArray(products.value)) {
      return
    }
    let _product = products.value.find(product => product.name == item.value.product)
    let autoAddItem = false
    if (!_product) {
      _product = products.value.find(product => product.ean == item.value.product || product.name.includes(item.value.product))
      autoAddItem = true
    }

    if (!_product) {
      return
    }

    item.value.product = _product.name
    const productProps = useProductNameProps(item.value.product)
    selectedProduct.value = {
      ..._product,
      code: productProps.code,
      size: productProps.size,
      ean: productProps.ean,
    }
    item.value.price = (
      selectedProduct.value.lastPurchasePrice *
      (1 + (invoicePartner.value && invoicePartner.value.group ? invoicePartner.value.group.percentage : 0) / 100)
    ).toFixed(2)

    // Initialize sellingPrices for each buyer group
    sellingPrices.value = {}
    buyerGroups.value.forEach(group => {
      sellingPrices.value[group.id] = (item.value.price * (1 + group.percentage / 100)).toFixed(2)
    })

    if (autoAddItem) {
      item.value.quantity = 1
      addItem()
    }
  }

  const productRef = ref(null)
  const quantityRef = ref(null)
  const isSaving = ref(false)

  // Watch for price changes and update selling prices
  watch(
    () => item.value.price,
    newPrice => {
      if (newPrice && buyerGroups.value.length > 0) {
        buyerGroups.value.forEach(group => {
          sellingPrices.value[group.id] = (newPrice * (1 + group.percentage / 100)).toFixed(2)
        })
      }
    }
  )

  const addItem = (putFocus = true) => {
    if (!item.value.product || !item.value.quantity || !item.value.price) {
      return
    }

    // if we aready have the product in invoice items we should increase the quantity
    const existingItem = invoice.value.items.find(item => item.product_id == selectedProduct.value.id)
    if (existingItem) {
      existingItem.quantity += item.value.quantity
      item.value = { ...emptyItem }
    }

    if (!existingItem) {
      invoice.value.items.unshift({
        ...selectedProduct.value,
        uuid: Math.random().toString(36).substring(2, 9),
        product_id: selectedProduct.value.id,
        quantity: item.value.quantity,
        price: item.value.price,
        sellingPrices: { ...sellingPrices.value },
      })
    }

    selectedProduct.value = {}
    item.value = { ...emptyItem }
    sellingPrices.value = {}

    if (putFocus) {
      productRef.value.focus()
    }
  }

  const changeItem = uuid => {
    const product = invoice.value.items.find(invoiceItem => invoiceItem.uuid == uuid)
    if (!product) {
      return
    }
    item.value.product = product.name
    item.value.price = product.price
    item.value.quantity = product.quantity
    setSelectedProduct()
    invoice.value.items = invoice.value.items.filter(invoiceItem => invoiceItem.uuid != uuid)
  }

  const saveInvoice = () => {
    addItem(false)

    if (!invoice.value.items.length) {
      return
    }

    isSaving.value = true

    const data = {
      ...invoice.value,
      partner_id: invoicePartner.value && invoicePartner.value.id ? invoicePartner.value.id : null,
      sale: isSale.value ? 1 : 0,
      items: invoice.value.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    axios
      .post(import.meta.env.VITE_API_URL + 'invoices.json?company=' + store.company.id, data, store.tokenHeader)
      .then(response => {
        if (invoices.value && Array.isArray(invoices.value)) {
          invoices.value.unshift({
            ...response.data.invoice,
            partner: store.partners && Array.isArray(store.partners) ? store.partners.find(partner => partner.id == data.partner_id) : null,
            invoicetype:
              store.invoicetypes && Array.isArray(store.invoicetypes) ? store.invoicetypes.find(invoicetype => invoicetype.id == data.invoicetype_id) : null,
            storage: store.storages && Array.isArray(store.storages) ? store.storages.find(storage => storage.id == data.storage_id) : null,
          })
        }
        isSaving.value = false
        router.push({ name: 'invoices' })
      })
      .catch(error => {
        console.error(error)
        isSaving.value = false
      })
  }
</script>

<template>
  <form @submit.prevent="saveInvoice">
    <h3 :class="isSale ? 'out' : 'in'"><i class="fi-plus"></i> Új bizonylat</h3>

    <div class="row">
      <div class="column small-12 large-6">
        <label for="storage-id"><i class="fi-contrast"> Raktár </i></label>
        <select v-model="invoice.storage_id" id="storage-id">
          <option v-for="storage in store.storages" :key="storage.id" :value="storage.id">
            {{ storage.name }}
          </option>
        </select>
      </div>
      <div class="column small-12 large-6">
        <label for="invoicetype-id"><i class="fi-shield"> Bizonylat típus </i></label>
        <select v-model="invoice.invoicetype_id" id="invoicetype-id">
          <option v-for="invoicetype in store.invoicetypes" :key="invoicetype.id" :value="invoicetype.id">
            {{ invoicetype.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="row">
      <div class="column small-12 large-6">
        <label for="partner-id"> <i class="fi-torsos"> Partner </i> / {{ invoicePartner && invoicePartner.group ? invoicePartner.group.name : '' }} </label>
        <input type="text" v-model.lazy="invoice.partner" list="partners" id="partner-id" autocomplete="off" />
        <datalist id="partners">
          <option v-for="partner in store.partners" :key="partner.id">
            {{ partner.name }}
          </option>
        </datalist>
      </div>
      <div class="column small-12 large-6">
        <label for="date"><i class="fi-calendar"> Dátum </i></label>
        <input type="date" v-model="invoice.date" />
      </div>
    </div>

    <div class="row">
      <div class="column small-12 large-6">
        <label for="number"><i class="fi-ticket"> Szám </i></label>
        <input type="text" v-model="invoice.number" id="number" />
      </div>
      <div class="column small-12 large-2">
        <label for="currency"><i class="fi-euro"> Valuta </i></label>
        <input type="text" v-model="invoice.currency" />
      </div>
      <div class="column small-12 large-1">
        <label for="showProductsOnlyInStock">Készleten</label>
        <input type="checkbox" v-model="invoice.showProductsOnlyInStock" />
      </div>
      <div class="column small-12 large-3">
        <div :class="isSale ? 'sale out' : 'sale in'">
          <label> {{ isSale ? 'Eladás' : 'Beszerzés' }}</label>
        </div>
      </div>
    </div>

    <fieldset id="items" :disabled="!isHeaderReady || !store.isBaseDataLoaded">
      <table cellpadding="0" cellspacing="0">
        <thead>
          <tr :class="isSale ? 'out' : 'in'">
            <th class="text-center" scope="col">Termék</th>
            <th class="text-center" scope="col">Méret</th>
            <th class="text-center" scope="col">Kód</th>
            <th class="text-center" scope="col">Készlet</th>
            <th class="text-center" scope="col">Mennyiség</th>
            <th v-show="isSale" class="text-center" scope="col">Költség</th>
            <th v-show="isSale" class="text-center" scope="col">Eladási ár</th>
            <th class="text-center" scope="col">Ár</th>
            <th class="text-center" scope="col">Összeg</th>
            <th class="text-center" scope="col">ÁFA</th>
            <th class="text-center" scope="col">ÁFA</th>
            <th class="text-center" scope="col">Bruttó</th>

            <th v-for="group in buyerGroups" :key="group.id" v-show="!isSale" class="text-center" scope="col">
              {{ group.name }}
              <span class="small">{{ group.percentage }}%</span>
            </th>

            <th>-</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <input type="text" v-model="item.product" @change="setSelectedProduct" ref="productRef" list="products" autocomplete="off" />
              <datalist id="products">
                <option v-for="product in productsToShow" :key="product.id">
                  {{ product.name }}
                  {{ product.size ? '> ' + product.size : '' }}
                  {{ product.code ? '# ' + product.code : '' }}
                  {{ product.ean ? '< ' + product.ean : '' }}
                </option>
              </datalist>
            </td>
            <td class="text-right">{{ selectedProduct.size }}</td>
            <td class="text-right">{{ selectedProduct.code }}</td>
            <td class="text-right">{{ toNum(selectedProduct.stock, 1) }}</td>
            <td class="text-right">
              <input ref="quantityRef" v-model="item.quantity" type="number" class="quantity" required="required" step="0.01" />
            </td>
            <td v-show="isSale" class="text-right">
              <i v-show="selectedProduct.avaragePurchasePrice" class="fi-price-tag avg" title="Átlagos beszerzési ár">
                {{ toCurrency(selectedProduct.avaragePurchasePrice, invoice.currency) }}
              </i>
              <br />
              <i v-show="selectedProduct.lastPurchasePrice" title="Utolsó beszerzési ár" class="fi-price-tag last">
                {{ toCurrency(selectedProduct.lastPurchasePrice, invoice.currency) }}
              </i>
            </td>
            <td v-show="isSale" class="text-right">
              {{
                invoicePartner && invoicePartner.group
                  ? toCurrency(selectedProduct.lastPurchasePrice * (1 + invoicePartner.group.percentage / 100), invoice.currency)
                  : 0
              }}
            </td>
            <td class="text-right">
              <input v-model="item.price" type="number" class="price text-right" required="required" step="0.01" />
              <span class="avg">{{ toNum((item.price / selectedProduct.avaragePurchasePrice - 1) * 100) }}%</span>
              <span class="last">{{ toNum((item.price / selectedProduct.lastPurchasePrice - 1) * 100) }}%</span>
            </td>
            <td class="text-right">
              {{ toCurrency(item.price * item.quantity, invoice.currency) }}
            </td>
            <td class="text-right">{{ selectedProduct.vat }} %</td>
            <td class="text-right">
              {{ toCurrency(item.price * item.quantity * (selectedProduct.vat / 100), invoice.currency) }}
            </td>
            <td class="text-right">
              {{ toCurrency(item.price * item.quantity * (1 + selectedProduct.vat / 100), invoice.currency) }}
            </td>

            <td v-for="group in buyerGroups" :key="group.id" v-show="!isSale">
              <input v-model="sellingPrices[group.id]" type="number" class="price text-right" step="0.01" />
            </td>

            <td>
              <button @click.prevent="addItem" class="fi-arrow-down"></button>
            </td>
          </tr>
          <tr v-for="invoiceItem in invoice.items" :key="invoiceItem.uuid">
            <td>{{ invoiceItem.name }}</td>
            <td>{{ invoiceItem.size }}</td>
            <td>{{ invoiceItem.code }}</td>
            <td class="text-right">{{ toNum(invoiceItem.stock, 1) }}</td>
            <td class="text-right">{{ invoiceItem.quantity }}</td>
            <td v-show="isSale" class="text-right">
              <i class="fi-price-tag avg">
                {{ toCurrency(invoiceItem.avaragePurchasePrice, invoice.currency) }}
              </i>
              <br />
              <i class="fi-price-tag last">
                {{ toCurrency(invoiceItem.lastPurchasePrice, invoice.currency) }}
              </i>
            </td>
            <td v-show="isSale" class="text-right">
              {{
                invoicePartner && invoicePartner.group
                  ? toCurrency(invoiceItem.lastPurchasePrice * (1 + invoicePartner.group.percentage / 100), invoice.currency)
                  : 0
              }}
            </td>
            <td class="text-right">
              {{ toCurrency(invoiceItem.price, invoice.currency) }}
            </td>
            <td class="text-right">
              {{ toCurrency(invoiceItem.price * invoiceItem.quantity, invoice.currency) }}
            </td>
            <td class="text-right">{{ invoiceItem.vat }} %</td>
            <td class="text-right">
              {{ toCurrency(invoiceItem.price * invoiceItem.quantity * (invoiceItem.vat / 100), invoice.currency) }}
            </td>
            <td class="text-right">
              {{ toCurrency(invoiceItem.price * invoiceItem.quantity * (1 + invoiceItem.vat / 100), invoice.currency) }}
            </td>

            <td v-for="group in buyerGroups" :key="group.id" v-show="!isSale" class="text-right">
              {{ invoiceItem.sellingPrices && invoiceItem.sellingPrices[group.id] ? toCurrency(invoiceItem.sellingPrices[group.id], invoice.currency) : '-' }}
            </td>

            <td class="pointer">
              <i class="fi-pencil" @click="changeItem(invoiceItem.uuid)"></i>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <button class="button" id="saveInvoice" type="submit" :disabled="isSaving">
                <i v-if="!isSaving" class="fi-check"> Ment </i>
                <span v-else>Mentés...</span>
              </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-right">
              {{ invoice.items.reduce((total, item) => total + parseInt(item.quantity), 0) }}
            </td>
            <td v-show="isSale"></td>
            <td v-show="isSale"></td>
            <td></td>
            <td class="text-right">
              {{
                toCurrency(
                  invoice.items.reduce((total, item) => total + item.quantity * item.price, 0),
                  invoice.currency
                )
              }}
            </td>
            <td class="text-right">-</td>
            <td class="text-right">
              {{
                toCurrency(
                  invoice.items.reduce((total, item) => total + (item.quantity * item.price * item.vat) / 100, 0),
                  invoice.currency
                )
              }}
            </td>
            <td class="text-right">
              {{
                toCurrency(
                  invoice.items.reduce((total, item) => total + item.quantity * item.price * (1 + item.vat / 100), 0),
                  invoice.currency
                )
              }}
            </td>

            <td v-for="group in buyerGroups" :key="group.id" v-show="!isSale" class="text-center">-</td>

            <td></td>
          </tr>
        </tfoot>
      </table>
    </fieldset>
  </form>
</template>

<style scoped>
  h3 {
    padding: 0.5rem 1rem;
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
    margin: 0 0.5em;
    font-family: foundation-icons;
  }

  div.sale.out label:before {
    content: '\f10a';
  }
  div.sale.in label:before {
    content: '\f10b';
  }
  div.sale input {
    width: 0;
    height: 0;
  }
  .avg,
  .last {
    font-size: 0.8rem;
    margin: 0.2rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }
  .avg {
    background: #d0eff4;
  }
  .last {
    background: #cdffc1;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media screen and (max-width: 40em) {
    thead {
      display: none;
    }
    td {
      display: flex;
    }
    td::before {
      width: 40%;
      text-align: left;
      font-weight: bold;
    }
    /* TODO hardcoded texts */
    td:nth-of-type(1):before {
      content: 'Termék';
    }
    td:nth-of-type(2):before {
      content: 'Méret';
    }
    td:nth-of-type(3):before {
      content: 'Kód';
    }
    td:nth-of-type(4):before {
      content: 'Készlet';
    }
    td:nth-of-type(5):before {
      content: 'Mennyiség';
    }
    td:nth-of-type(6):before {
      content: 'Költség';
    }
    td:nth-of-type(7):before {
      content: 'Eladási ár';
    }
    td:nth-of-type(8):before {
      content: 'Ár';
    }
    td:nth-of-type(9):before {
      content: 'Összeg';
    }
    td:nth-of-type(10):before {
      content: 'ÁFA';
    }
    td:nth-of-type(11):before {
      content: 'ÁFA';
    }
    td:nth-of-type(12):before {
      content: 'Bruttó';
    }
    td:nth-of-type(13):before {
      content: 'Törzsvásárló';
    }
    td:nth-of-type(14):before {
      content: 'Viszonteladó';
    }
    td:nth-of-type(15):before {
      content: 'Kisker';
    }
  }
</style>
