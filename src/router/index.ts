import { createRouter, createWebHistory } from 'vue-router'
import DefaultRoutes from './routes_default'
import WalletRoutes from './routes_wallet'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...DefaultRoutes, ...WalletRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0, behavior: 'smooth' };
    }

  }
})
export default router
