import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('@/views/Help.vue'),
  },
  {
    path: '/invoices/:id',
    name: 'view-invoice',
    component: () => import('@/views/ViewInvoice.vue'),
    props: true,
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('@/views/Invoices.vue'),
  },
  {
    path: '/add-invoice',
    name: 'add-invoice',
    component: () => import('@/views/AddInvoice.vue'),
  },
  {
    path: '/add-partner',
    name: 'add-partner',
    component: () => import('@/views/AddPartner.vue'),
  },
  {
    path: '/add-product',
    component: () => import('@/views/AddProduct.vue'),
  },
  {
    path: '/partners/:id',
    component: () => import('@/views/ViewPartner.vue'),
    props: true,
  },
  {
    path: '/partners',
    component: () => import('@/views/Partners.vue'),
    props: true,
  },
  {
    path: '/products/:id',
    component: () => import('@/views/ViewProduct.vue'),
    props: true,
  },
  {
    path: '/settings',
    component: () => import('@/views/Settings.vue'),
  },
  {
    path: '/stock@date',
    name: 'stock@date',
    component: () => import('@/views/StockAtDate.vue'),
  },
  {
    path: '/stock',
    name: 'stock',
    component: () => import('@/views/Stock.vue'),
  },
  {
    path: '/stock-rotation',
    name: 'stock-rotation',
    component: () => import('@/views/StockRotation.vue'),
  },
]

const router = new VueRouter({
  //base: '/stockr/', //BB
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'home') {
    if (!store.state.user.email) {
      next({ path: '/', query: { redirect: to.path } })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next()
  }
})

export default router
