<script setup>
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()

  const barcode = ref('')
  const barcodeRef = ref(null)
  const product = ref({})
  const productName = ref('')

  onMounted(() => {
    barcodeRef.value.focus()
  })

  const isEanChange = ref(false)
  const handleBarcode = () => {
    isEanChange.value = false
    updated.value = false

    product.value = store.products.find(p => p.ean == barcode.value)

    if (product.value) {
      barcode.value = ''
    }

    if (!product.value) {
      product.value = {}
    }
  }

  const updated = ref(false)
  const selectProduct = () => {
    product.value = store.products.find(p => p.name == productName.value.split(' >')[0].trim())
    if (product.value.ean && product.value.ean != barcode.value) {
      isEanChange.value = true
    }
  }

  const updateProduct = () => {
    axios
      .put(
        `${import.meta.env.VITE_API_URL}products/${product.value.id}.json?company=${store.company.id}&ApiKey=${
          store.user.api_token
        }`,
        { ean: barcode.value }
      )
      .then(res => {
        product.value = res.data.product
        store.products = store.products.map(p => (p.id == product.value.id ? product.value : p))
        updated.value = true
        barcode.value = ''
        productName.value = ''
        barcodeRef.value.focus()
      })
      .catch(error => console.error(error))
  }
</script>

<template>
  <div class="small-12 large-6 columns content">
    <h3>Vonalkód felvitel</h3>

    <label for="barcode">Vonalkód</label>
    <input type="text" v-model="barcode" required="required" id="barcode" ref="barcodeRef" @change="handleBarcode" />
  </div>

  <div class="small-12 large-6 columns content">
    <h3>
      {{ product.name }}
      <button class="button" :class="{ warning: isEanChange }" v-if="product.name && barcode" @click="updateProduct">
        {{ isEanChange ? 'Ean csere' : 'Mentés' }}
      </button>
    </h3>
    <dl>
      <dt>ean</dt>
      <dd>
        {{ product.ean }}
        <span v-if="updated">✅</span>
      </dd>
      <dt>name</dt>
      <dd v-if="product.name">
        {{ product.name }}
      </dd>
      <dd v-if="!product.name">
        <input
          type="text"
          v-model="productName"
          ref="productRef"
          list="products"
          autocomplete="off"
          @change="selectProduct"
        />
        <datalist id="products">
          <option v-for="product in store.products" :key="product.id">
            {{ product.name }} >{{ product.size }} #{{ product.code }}
          </option>
        </datalist>
      </dd>
      <dt>en_name</dt>
      <dd>{{ product.en_name }}</dd>
      <dt>code</dt>
      <dd>{{ product.code }}</dd>
      <dt>size</dt>
      <dd>{{ product.size }}</dd>
      <dt>vat</dt>
      <dd>{{ product.vat }}</dd>
      <dt>avaragePurchasePrice</dt>
      <dd>{{ product.avaragePurchasePrice }}</dd>
      <dt>lastPurchasePrice</dt>
      <dd>{{ product.lastPurchasePrice }}</dd>
      <dt>stock</dt>
      <dd>{{ product.stock }}</dd>
      <dt>sells</dt>
      <dd>{{ product.sells }}</dd>
      <dt>id</dt>
      <dd>{{ product.id }}</dd>
    </dl>
  </div>
</template>

<style scoped>
  h3 {
    display: flex;
    justify-content: space-between;
  }
</style>
