import { createRouter, createWebHistory } from 'vue-router'
import DefaultRoutes from './routesDefault'
import WalletRoutes from './routesWallet'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...DefaultRoutes, ...WalletRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0, behavior: 'smooth' }
    }
  },
})
export default router
