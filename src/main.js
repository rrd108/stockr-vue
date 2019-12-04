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


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
