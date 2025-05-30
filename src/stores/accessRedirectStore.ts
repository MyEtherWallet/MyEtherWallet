import { ROUTES_MAIN } from '@/router/routeNames'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store to manage the last visited route name for access redirects.
 * This store is used to redirect users back to the last visited route
 * after they complete an access action (like accessing a wallet).
 * It initializes with the home route as the default last visited route.
 */
export const useAccessRedirectStore = defineStore(
  'accessRedirectStore ',
  () => {
    const lastVisitedRouteName = ref(ROUTES_MAIN.HOME.PATH)
    return { lastVisitedRouteName }
  },
)
