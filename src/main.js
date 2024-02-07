import Vue from 'vue'

//import { createApp } from 'vue'
//import './style.css'

import App from './App.vue'
import router from './router'
import store from './store'

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

//createApp(App).use(router).use(store).mount('#app')
