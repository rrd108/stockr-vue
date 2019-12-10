import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.use(Vuelidate)

router.beforeEach((to, from, next) => {
  let language = to.params.lang;
  if (!language) {
    language = 'hu';
  }

  i18n.locale = language;
  next();
})

Vue.filter('toCurrency', function (value) {
  // TODO set it from session
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
});

Vue.filter('toNum', function (value, precision) {
  return precision ? value : parseInt(value);
});

Vue.filter('toNumFormat', function (value, decimals = 0, dec_point, thousands_sep) {
  let n = value, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
  let d = dec_point == undefined ? "," : dec_point;
  let t = thousands_sep == undefined ? " " : thousands_sep, s = n < 0 ? "-" : "";
  let i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
