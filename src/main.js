import { createApp } from 'vue'
import createStore from './store'
import router from './router'
import App from './App.vue'
import './style.css'

const store = createStore()

createApp(App).use(router).use(store).mount('#app')
