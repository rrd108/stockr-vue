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

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
