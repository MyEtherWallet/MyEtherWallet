import { createRouter, createWebHistory } from 'vue-router'
import DefaultRoutes from './routes_default'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: DefaultRoutes
})
export default router
