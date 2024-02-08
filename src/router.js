import { createRouter, createWebHistory } from 'vue-router'
import { useStockrStore } from '@/stores'
import Home from '@/pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('@/pages/Help.vue'),
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('@/pages/Invoices.vue'),
  },
  {
    path: '/invoices/:id',
    name: 'view-invoice',
    component: () => import('@/pages/ViewInvoice.vue'),
    props: true,
  },
  {
    path: '/add-invoice',
    name: 'add-invoice',
    component: () => import('@/pages/AddInvoice.vue'),
  },
  {
    path: '/add-partner',
    name: 'add-partner',
    component: () => import('@/pages/AddPartner.vue'),
  },
  {
    path: '/add-product',
    component: () => import('@/pages/AddProduct.vue'),
  },
  {
    path: '/partners/:id',
    component: () => import('@/pages/ViewPartner.vue'),
    props: true,
  },
  {
    path: '/partners',
    component: () => import('@/pages/Partners.vue'),
    props: true,
  },
  {
    path: '/products/:id',
    component: () => import('@/pages/ViewProduct.vue'),
    props: true,
  },
  {
    path: '/settings',
    component: () => import('@/pages/Settings.vue'),
  },
  {
    path: '/stock@date',
    name: 'stock@date',
    component: () => import('@/pages/StockAtDate.vue'),
  },
  {
    path: '/stock',
    name: 'stock',
    component: () => import('@/pages/Stock.vue'),
  },
  {
    path: '/stock-rotation',
    name: 'stock-rotation',
    component: () => import('@/pages/StockRotation.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach(to => {
//   if (to.name !== 'home') {
//     const store = useStockrStore()
//     if (!store.user.email) {
//       return { path: '/', query: { redirect: to.path } }
//     }
//   }
// })

export default router
