import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAccessRedirectStore } from '@/stores/accessRedirectStore'

export const beforeAccessEnter = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const accessRedirectStore = useAccessRedirectStore()
  if (from.name) {
    accessRedirectStore.lastVisitedRouteName = from.name as string
  }
  next()
}
