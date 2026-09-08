import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteRecordNormalized,
} from 'vue-router'

type AnyRoute = RouteLocationNormalized | RouteLocationNormalizedLoaded

/**
 * The matched records with the connect/create overlay layer removed — i.e. the pages
 * actually painted, which is what "which page am I on" should mean. Without this,
 * `route.name === ROUTES_MAIN.HOME.NAME` style checks silently stop matching the moment
 * an overlay child is active, and the page reflows behind the modal.
 */
export const pageRouteChain = (route: AnyRoute): RouteRecordNormalized[] =>
  route.matched.filter(record => !record.meta.walletFlow && record.name)

/** Name of the deepest page route, ignoring any overlay on top of it. */
export const pageRouteName = (route: AnyRoute): string | undefined => {
  const chain = pageRouteChain(route)
  const name = chain[chain.length - 1]?.name
  return typeof name === 'string' ? name : undefined
}

/**
 * Name of the page hosting the deepest page — the route a view-as-dialog closes back
 * to. Not `matched[matched.length - 2]`: an overlay can now be a child of the dialog's
 * own record, which would make that index the dialog itself.
 */
export const pageParentRouteName = (route: AnyRoute): string | undefined => {
  const chain = pageRouteChain(route)
  const name = chain[chain.length - 2]?.name
  return typeof name === 'string' ? name : undefined
}
