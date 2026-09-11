import { createRouter, createWebHistory } from 'vue-router'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import DefaultRoutes from './routesDefault'
import { pageRouteName } from './routeHierarchy'
import { isChunkLoadError } from './chunkError'

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
    }
    // Opening or cancelling the connect/create overlay doesn't change the page
    // underneath, so don't scroll it — otherwise "return the user where they were"
    // still loses their scroll position.
    if (
      (to.meta.walletFlow || from.meta.walletFlow) &&
      pageRouteName(to) &&
      pageRouteName(to) === pageRouteName(from)
    ) {
      return false
    }
    return { top: 0, left: 0, behavior: 'smooth' }
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
  if (!isChunkLoadError(error)) return

  const reloadKey = `chunk-reload:${to.fullPath}`
  if (!sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, '1')
    window.location.href = to.fullPath
  }
})

export default router
