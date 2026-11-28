<template>
  <div></div>
</template>
<script setup lang="ts">
// Where Privy sends the browser back after a Google login (MEW-2289). The
// page arrives from outside the app with the OAuth code in the query string:
// leave this URL for the page the user started from (which also drops the
// code from the address bar), reopen the connect modal on its sign-up view,
// and let the login flow finish there.
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  OAUTH_CODE_PARAM,
  OAUTH_STATE_PARAM,
  RETURN_TO_KEY,
} from '@/modules/access/common/privyOnboarding'
import { usePrivyOnboarding } from '@/modules/access/composables/usePrivyOnboarding'
import { ROUTES_AUTH, ROUTES_MAIN } from '@/router/routeNames'
import { useAccessStore } from '@/stores/accessStore'

const route = useRoute()
const router = useRouter()
const accessStore = useAccessStore()
const { resumeGoogle, failGoogle } = usePrivyOnboarding()

const queryString = (key: string): string | undefined => {
  const value = route.query[key]
  return typeof value === 'string' && value ? value : undefined
}

/**
 * The reason comes from the URL and goes to analytics: reduce it to a short
 * code-like word so nothing else can ride along.
 */
const plainReason = (raw: string | undefined): string =>
  (raw ?? 'missing_code')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'unknown'

/**
 * The remembered page, if it is safe to go to: an in-app path that resolves
 * to a real route. Anything else (another origin, a scheme, an unknown path)
 * falls back to Home.
 */
const takeReturnTo = (): string => {
  const stored = sessionStorage.getItem(RETURN_TO_KEY)
  sessionStorage.removeItem(RETURN_TO_KEY)
  const home = ROUTES_MAIN.HOME.PATH
  if (!stored || !stored.startsWith('/') || stored.startsWith('//')) return home
  const { name } = router.resolve(stored)
  return name === 'not-found' || name === ROUTES_AUTH.CALLBACK.NAME
    ? home
    : stored
}

onMounted(async () => {
  const code = queryString(OAUTH_CODE_PARAM)
  const state = queryString(OAUTH_STATE_PARAM)
  // Started before the modal opens, so it opens on "Verifying…" rather than
  // the entry screen. The flow keeps its own state; this view is gone by then.
  if (code && state) void resumeGoogle(code, state)
  else failGoogle(plainReason(queryString('error')))

  await router.replace(takeReturnTo())
  accessStore.openAccessDialog()
  accessStore.setCurrentView('sign_up')
})
</script>
