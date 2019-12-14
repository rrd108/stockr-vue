import Vue from 'vue'
import VueRouter from 'vue-router'
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
        path: 'stock',
        name: 'stock',
        component: () => import('../views/Stock.vue')
      },
      {// TODO remove this
        path: 'about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
