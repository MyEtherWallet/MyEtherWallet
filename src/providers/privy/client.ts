import Privy from '@privy-io/js-sdk-core'
import configs from '@/configs'
import { tabStorage } from './tabStorage'

/**
 * The app's single Privy client. Reach this module through a dynamic
 * `import()` only, so the SDK stays out of the startup bundle.
 *
 * Login tokens live in this tab's `sessionStorage` (see tabStorage), and the
 * SDK's second copy of them in cookies is turned off: that copy exists for
 * apps whose own server reads it, and cookies are shared by every tab.
 */
export const privy = new Privy({
  appId: configs.PRIVY_APP_ID,
  clientId: configs.PRIVY_CLIENT_ID,
  storage: tabStorage,
  sessions: { cookieWriteBehavior: 'never' },
})

let ready: Promise<void> | undefined

/**
 * Resolves once the client is initialized. The SDK must be initialized once
 * before any other call; a failed attempt is forgotten so a later caller can
 * retry (blocked storage, offline).
 */
export const privyReady = (): Promise<void> => {
  ready ??= privy.initialize().catch((error: unknown) => {
    ready = undefined
    throw error
  })
  return ready
}
