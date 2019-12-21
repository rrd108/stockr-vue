import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import i18n from '@/i18n'

import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: `/${i18n.locale}`
  },
  {
    path: '/:lang',
    component: {
      render(c) { return c('router-view') }
    },
    children: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: 'invoices/:id',
        name: 'view-invoice',
        component: () => import('../views/ViewInvoice.vue'),
        props: true
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('../views/Invoices.vue')
      },
      {
        path: 'add-invoice',
        name: 'add-invoice',
        component: () => import('../views/AddInvoice.vue')
      },
      {
        path: 'add-product',
        component: () => import('../views/AddProduct.vue')
      },
      {
        path: 'stock',
        name: 'stock',
        component: () => import('../views/Stock.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  let language = to.params.lang;
  if (!language) {
    language = 'hu';
  }
  i18n.locale = language;

  if (to.name !== 'home') {
    if (!store.state.user.email) {
      next('/')
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next()
  }
})

export default router
