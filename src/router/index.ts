import { createRouter, createWebHistory } from 'vue-router'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import DefaultRoutes from './routesDefault'

// A persisted watch-only address restores into a wallet asynchronously (on the
// chains-load), which happens after this guard runs on a fresh load. Treat it
// as "has a wallet" so refreshing an auth route (e.g. /portfolio) doesn't bounce
// to Home before the restore lands.
const hasRestorableWallet = (): boolean => {
  const { watchOnlyAddresses } = useWatchOnlyStore()
  return Object.values(watchOnlyAddresses ?? {}).some(
    list => Array.isArray(list) && list.length > 0,
  )
}

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
  // '/' is the public Home; any auth-required route (e.g. /portfolio) falls
  // back there when there's no wallet (connected or restorable).
  if ((to.meta && to.meta.noAuth) || store.wallet || hasRestorableWallet()) {
    next()
  } else {
    next('/')
  }
})

router.onError((error, to) => {
  const message = error instanceof Error ? error.message : String(error)
  const isChunkError =
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Unable to preload CSS')

  if (isChunkError) {
    const reloadKey = `chunk-reload:${to.fullPath}`
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, '1')
      window.location.href = to.fullPath
    }
  }
})

export default router
