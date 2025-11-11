import { createRouter, createWebHistory } from 'vue-router'
import { useWalletStore } from '@/stores/walletStore'
import DefaultRoutes from './routesDefault'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...DefaultRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0, behavior: 'smooth' }
    }
  },
})

// reroute when address is undefined
router.beforeEach((to, from, next) => {
  const store = useWalletStore()
  if (to.meta && to.meta.noAuth) {
    next()
  } else {
    if (store.wallet) {
      next()
    } else {
      next('/')
    }
  }
})
export default router
