import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNamedRaw } from 'vue-router'
import {
  ROUTES_MAIN,
  walletFlowRouteName,
  type WalletFlowKind,
} from '@/router/routeNames'
import { pageRouteName } from '@/router/routeHierarchy'

/**
 * Targets for the connect ("access") and create-wallet overlay routes, resolved against
 * whichever page the user is currently on. Because those routes are appended to every
 * page (routesWalletFlow.ts), opening the flow from /stocks goes to /stocks/access —
 * not /portfolio/access — so /portfolio no longer paints itself in behind the modal and
 * cancelling returns the user where they were.
 */
export const useWalletFlowRoute = () => {
  const route = useRoute()
  const router = useRouter()

  /** The page the overlay opens over and returns to. */
  const hostRouteName = computed(
    () => pageRouteName(route) ?? ROUTES_MAIN.HOME.NAME,
  )

  const locationFor = (kind: WalletFlowKind): RouteLocationNamedRaw => {
    const name = walletFlowRouteName(hostRouteName.value, kind)
    return {
      // A page can opt out (`meta.noWalletFlow`, e.g. the 404), so fall back to the
      // canonical Home-hosted route ('/access', '/create') instead of throwing.
      name: router.hasRoute(name)
        ? name
        : walletFlowRouteName(ROUTES_MAIN.HOME.NAME, kind),
      // Carry the host's deep-link query through (/crypto?category=defi) and pre-set a
      // valid `type` so the route's beforeEnter guard has nothing to redirect.
      query: { ...route.query, type: 'default' },
      // No `params`: a named location already inherits the required params from the
      // current location, and passing extras trips a dev-only "Discarded invalid
      // param(s)" warning. So this resolves to /crypto/token/peaq-2/access on its own.
    }
  }

  /** `:to` / `router.push` target for the connect overlay on the current page. */
  const accessRoute = computed(() => locationFor('access'))
  /** `:to` / `router.push` target for the create overlay on the current page. */
  const createRoute = computed(() => locationFor('create'))
  /** True while an overlay route is active. Only overlay records carry the meta key. */
  const isWalletFlowRoute = computed(() => Boolean(route.meta.walletFlow))

  /** Leave the overlay, restoring the page underneath and its query. */
  const closeWalletFlowRoute = () => {
    const query = { ...route.query }
    delete query.type
    return router.push({ name: hostRouteName.value, query })
  }

  return {
    accessRoute,
    createRoute,
    hostRouteName,
    isWalletFlowRoute,
    closeWalletFlowRoute,
  }
}

/**
 * Keep the URL in step with a flag-driven wallet-flow dialog.
 *
 * The connect/create dialogs are mounted globally in App.vue and most callers open them
 * by flipping a store flag rather than navigating (wallet card, side menu, swap, trade,
 * buy/sell, perps, rewards, …). That left the URL on e.g. /portfolio with no trace of
 * the open flow. Calling this from the single component that owns each dialog covers
 * every entry point at once, instead of patching 25 call sites.
 *
 * @param isOpen      the dialog's open flag
 * @param kind        which overlay this dialog is
 * @param currentView the step the dialog is showing, carried in `?type=` so a remount
 *                    of the route view can't drop it
 */
export const useWalletFlowUrlSync = (
  isOpen: Ref<boolean>,
  kind: WalletFlowKind,
  currentView: Ref<string>,
): void => {
  const route = useRoute()
  const router = useRouter()
  const { accessRoute, createRoute } = useWalletFlowRoute()

  watch(isOpen, open => {
    // Already on this overlay's route (route-first entry, or a remount) — nothing to
    // sync. Being on the *other* overlay's route still navigates, so switching between
    // create and connect moves the URL with it.
    if (!open || route.meta.walletFlow === kind) return
    const target = kind === 'access' ? accessRoute.value : createRoute.value
    void router.push({
      ...target,
      query: { ...target.query, type: currentView.value },
    })
  })
}
