<script setup>
  import { computed, ref } from 'vue'
  import { useStockrStore } from '@/stores'
  import toNum from '@/composables/useToNum'
  import toCurrency from '@/composables/useToCurrency'

  const store = useStockrStore()

  const setNumber = () => {
    let year = new Date().getFullYear()
    let lastSellInvoice = store.invoices.find(invoice => invoice.number.match(new RegExp(year + '/')))
    let number = year + '/' + 1
    if (lastSellInvoice) {
      number = parseInt(lastSellInvoice.number.substr(lastSellInvoice.number.indexOf('/') + 1)) + 1
      number = year + '/' + number
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
    return store.partners.find(partner => partner.name == invoice.value.partner)
  })
  const isSale = computed(() => invoicePartner.value.group.percentage)

  const selectedPartner = ref({})
  const isHeaderReady = computed(
    () =>
      invoice.value.storage_id &&
      invoice.value.invoicetype_id &&
      invoice.value.partner &&
      invoice.value.date &&
      invoice.value.number &&
      invoice.value.currency
  )
  const buyerGroups = () => store.groups.filter(group => group.percentage > 0)

  const showProductsOnlyInStock = ref(true)
  const productsToShow = computed(() =>
    showProductsOnlyInStock.value ? store.products.filter(product => product.stock > 0) : store.products
  )

  const selectedProduct = ref({})
  const item = ref({
    product: '',
    quantity: 0,
    price: 0,
  })

  const invoiceItems = ref([])

  /*  const date = ref(new Date().toISOString().split('T')[0])
  const invoicetype_id = ref(0)
  const number = ref(0)
  const partner = ref('')

  const sellingPrices = () => {
    let sellingPrices = []
    this.buyerGroups.forEach(group => (sellingPrices[group.id] = this.price * (1 + group.percentage / 100)))
    return sellingPrices
  }

  onCreated(() => {
    if (!this.$store.products?.length) {
      this.$store.getBaseData()
    }
    this.number = this.setNumber()
  })

  onMounted(() => {
    this.$refs.storage.focus()
  })

  const addItem = (putFocus = true) => {
    if (this.product && this.quantity && this.price) {
      this.invoiceItems.unshift({
        uuid: Math.random().toString().substr(2),
        product_id: this.selectedProduct.id,
        name: this.selectedProduct.name,
        size: this.selectedProduct.size,
        code: this.selectedProduct.code,
        stock: this.selectedProduct.stock,
        quantity: this.quantity,
        avaragePurchasePrice: this.selectedProduct.avaragePurchasePrice,
        lastPurchasePrice: this.selectedProduct.lastPurchasePrice,
        percentage: this.selectedProduct.percentage,
        price: this.price,
        vat: this.selectedProduct.vat,
        sellingPrices: this.sellingPrices,
      })
      this.selectedProduct = {}
      this.product = ''
      this.quantity = this.price = 0
      if (putFocus) {
        this.$refs.product.focus()
      }
    }
  }
  const changeItem = uuid => {
    let product = this.invoiceItems.find(invoiceItem => invoiceItem.uuid == uuid)
    this.product = product.name
    this.price = product.price
    this.quantity = product.quantity
    this.setSelectedProduct()
    this.invoiceItems = this.invoiceItems.filter(invoiceItem => invoiceItem.uuid != uuid)
  }

  const saveInvoice = () => {
    this.addItem(false)
    if (this.invoiceItems.length) {
      let data = {
        storage_id: this.storage_id,
        invoicetype_id: this.invoicetype_id,
        partner_id: this.selectedPartner.id,
        date: this.date,
        number: this.number,
        currency: this.currency,
        sale: this.isSale ? 1 : 0,
        items: this.invoiceItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          selling_prices: item.sellingPrices,
        })),
      }

      let data4vue = {
        storage: this.storages.find(storage => storage.id == this.storage_id),
        invoicetype: invoicetypes.find(invoicetype => invoicetype.id == this.invoicetype_id),
        partner: this.selectedPartner,
      }

      axios
        .post(
          import.meta.env.VITE_API_URL + 'invoices.json?company=' + company.id + '&ApiKey=' + this.$store.user.api_token,
          data
        )
        .then(response => {
          if (response.data.invoice.id) {
            this.$store.invoice = {
              ...response.data.invoice,
              ...data4vue,
            }
            this.$router.push({
              name: 'invoices',
              params: { newInvoice: response.data.invoice.number },
            })
          }
        })
        .catch(error => console.log(error))
    }
  }

  const setSelectedProduct = () => {
    this.selectedProduct = this.products.find(product => {
      // productName: "product #CODE > 1kg"
      let chunks = this.product.split(/[>#]/)
      let productName = chunks[0]

      if (chunks.length === 1) {
        // we have only product name
        if (product.name.trim() == productName.trim()) {
          return product
        }
      }

      if (chunks.length === 2) {
        // we have product name AND (size OR code)
        if (this.product.indexOf('#')) {
          if (product.name.trim() == productName.trim() && product.code.trim() == chunks[1].trim()) {
            return product
          }
        }
        if (this.product.indexOf('>')) {
          if (product.name.trim() == productName.trim() && product.size.trim() == chunks[1].trim()) {
            return product
          }
        }
      }

      if (chunks.length === 3) {
        // we have product name AND size AND code
        // ['Festett hármas ételhordó ', ' 3 tier ', ' FÉ3']
        if (
          product.name.trim() == productName.trim() &&
          product.size.trim() == chunks[1].trim() &&
          product.code.trim() == chunks[2].trim()
        ) {
          return product
        }
      }
    })
    this.product = this.selectedProduct.name
    this.price = (this.selectedProduct.lastPurchasePrice * (1 + this.selectedPartner.group.percentage / 100)).toFixed(2)
  }*/

  const saveInvoice = () => {
    console.log('TODO saveInvoice')
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
        <label for="partner-id"> <i class="fi-torsos"> Partner </i> / {{ invoicePartner.group.name }} </label>
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
          <label for="isSale">
            {{ isSale ? 'Eladás' : 'Beszerzés' }}<input type="checkbox" v-model="invoice.isSale" id="isSale"
          /></label>
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
              <input
                type="text"
                v-model.lazy="item.product"
                @change="setSelectedProduct"
                list="products"
                autocomplete="off"
              />
              <datalist id="products">
                <option v-for="product in productsToShow" :key="product.id">
                  {{ product.name }}
                  {{ product.size ? '> ' + product.size : '' }}
                  {{ product.code ? '# ' + product.code : '' }}
                </option>
              </datalist>
            </td>
            <td class="text-right">{{ selectedProduct.size }}</td>
            <td class="text-right">{{ selectedProduct.code }}</td>
            <td class="text-right">{{ toNum(selectedProduct.stock, 1) }}</td>
            <td class="text-right">
              <input v-model="item.quantity" type="number" class="quantity" required="required" step="0.01" />
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
                selectedPartner.group
                  ? toCurrency(
                      selectedProduct.lastPurchasePrice * (1 + selectedPartner.group.percentage / 100),
                      invoice.currency
                    )
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
          <tr v-for="invoiceItem in invoiceItems" :key="invoiceItem.uuid">
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
                toCurrency(invoiceItem.lastPurchasePrice * (1 + selectedPartner.group.percentage / 100), invoice.currency)
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
              {{ toCurrency(invoiceItem.sellingPrices[group.id], invoice.currency) }}
            </td>

            <td class="pointer">
              <i class="fi-pencil" @click="changeItem(invoiceItem.uuid)"></i>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <button class="button" id="saveInvoice" type="submit">
                <i class="fi-check"> Ment </i>
              </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-right">
              {{ invoiceItems.reduce((total, item) => total + parseInt(item.quantity), 0) }}
            </td>
            <td v-show="isSale"></td>
            <td v-show="isSale"></td>
            <td></td>
            <td class="text-right">
              {{
                toCurrency(
                  invoiceItems.reduce((total, item) => total + item.quantity * item.price, 0),
                  invoice.currency
                )
              }}
            </td>
            <td class="text-right">-</td>
            <td class="text-right">
              {{
                toCurrency(
                  invoiceItems.reduce((total, item) => total + (item.quantity * item.price * item.vat) / 100, 0),
                  invoice.currency
                )
              }}
            </td>
            <td class="text-right">
              {{
                toCurrency(
                  invoiceItems.reduce((total, item) => total + item.quantity * item.price * (1 + item.vat / 100), 0),
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
    margin-left: 0.3em;
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
