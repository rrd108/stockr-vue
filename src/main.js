import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.filter('toCurrency', function (value, currency = 'HUF', decimals = 2) {
  if (isNaN(value)) {
    return 0
  }

  if (currency == 'HUF') {
    decimals = 0
  }

  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
})

Vue.filter('toLocaleDateString', function (value) {
  // TODO get locale string from api (user)
  if (value === '') return
  return new Date(value).toLocaleDateString('hu-HU')
})

Vue.filter('toNum', function (value, precision) {
  if (!value) return 0
  return precision ? parseFloat(value).toFixed(precision) : parseInt(value || 0)
})

Vue.filter(
  'toNumFormat',
  function (value, decimals = 0, dec_point, thousands_sep) {
    let n = value,
      c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals
    let d = dec_point == undefined ? ',' : dec_point
    let t = thousands_sep == undefined ? ' ' : thousands_sep,
      s = n < 0 ? '-' : ''
    let i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + ''
    let j = i.length
    j = j > 3 ? j % 3 : 0
    return (
      s +
      (j ? i.substr(0, j) + t : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
      (c
        ? d +
          Math.abs(n - i)
            .toFixed(c)
            .slice(2)
        : '')
    )
  }
)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
