import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('@/views/BuilderView.vue')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/PreviewView.vue')
    },
    {
      path: '/service/qr-entry',
      name: 'qr-entry',
      component: () => import('@/views/service/QrEntryView.vue')
    },
    {
      path: '/service/waiting',
      name: 'waiting',
      component: () => import('@/views/service/WaitingView.vue')
    },
    {
      path: '/service/menu',
      name: 'menu',
      component: () => import('@/views/service/MenuView.vue')
    },
    {
      path: '/service/menu-detail',
      name: 'menu-detail',
      component: () => import('@/views/service/MenuDetailView.vue')
    },
    {
      path: '/service/menu/:menuId',
      name: 'menu-detail-with-id',
      component: () => import('@/views/service/MenuDetailView.vue')
    },
    {
      path: '/service/cart',
      name: 'cart',
      component: () => import('@/views/service/CartView.vue')
    },
    {
      path: '/service/payment',
      name: 'payment',
      component: () => import('@/views/service/PaymentView.vue')
    },
    {
      path: '/service/complete',
      name: 'complete',
      component: () => import('@/views/service/CompleteView.vue')
    }
  ]
})

export default router
