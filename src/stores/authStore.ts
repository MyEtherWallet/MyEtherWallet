import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { analytics } from '@/analytics'
import { OnboardingEvent } from '@/analytics/events'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import PrivyWallet from '@/providers/ethereum/privyWallet'
import { tabHoldsPrivyData } from '@/providers/privy/tabStorage'
import type { PrivySession, PrivyUser } from '@/providers/privy/user'
import type { HexPrefixedString } from '@/providers/types'
import { ROUTES_AUTH } from '@/router/routeNames'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletStore } from '@/stores/walletStore'

export type AuthStatus = 'anonymous' | 'authenticated'
export type LoginMethod = 'google' | 'email'

/** Shown in the saved-address list and sent to analytics as the wallet name. */
const WALLET_NAME = 'Privy'
/** The app creates the wallet itself in the wallet-setup step, never at login. */
const NO_WALLET_AT_LOGIN = {
  embedded: { ethereum: { createOnLogin: 'off' } },
} as const

/**
 * The Privy SDK and everything built on it, loaded on first use so it stays
 * out of the startup bundle, and initialized before it is handed out.
 */
const importPrivy = async () => {
  const [client, users, iframe] = await Promise.all([
    import('@/providers/privy/client'),
    import('@/providers/privy/user'),
    import('@/providers/privy/walletIframe'),
  ])
  return { privy: client.privy, ready: client.privyReady, ...users, ...iframe }
}
type PrivyModules = Awaited<ReturnType<typeof importPrivy>>
/** The modules once loaded, for the parts that must not wait on a network call. */
let loadedModules: PrivyModules | undefined

const loadPrivy = async (): Promise<PrivyModules> => {
  loadedModules = await importPrivy()
  await loadedModules.ready()
  return loadedModules
}

const errorCode = (error: unknown): string => {
  const code = (error as { code?: unknown } | null)?.code
  return typeof code === 'string' ? code : 'unknown'
}

/**
 * Google / email login through Privy (MEW-2289).
 *
 * The login behaves like every other wallet connection: there is no separate
 * logout (the Privy wallet's `disconnect()` ends it), and after a reload the
 * wallet is watch-only. The login itself stays in the tab until then or until
 * the tab closes, so the user can be asked whether to continue with it; it is
 * never reused without that. The connect modal is a pure consumer of this
 * store.
 */
export const useAuthStore = defineStore('authStore', () => {
  const status = ref<AuthStatus>('anonymous')
  const user = shallowRef<PrivyUser | null>(null)
  const walletAddress = ref<string | null>(null)
  /** Whether the logged-in user already has an embedded wallet. */
  const hasWallet = ref(false)
  /** Analytics only: the flow branches on `hasWallet`. */
  const isNew = ref(false)
  const loginMethod = ref<LoginMethod | null>(null)
  /** "Get updates" choice; null = not answered. Captured, not persisted. */
  const emailOptIn = ref<boolean | null>(null)
  /** Privy error code of the last failed step, for the screens to map. */
  const error = ref<string | null>(null)
  /**
   * Identifies the current login. Work that awaits compares it afterwards, so
   * nothing is applied to the store for a login that has ended meanwhile.
   */
  let loginEpoch = 0

  const reset = (): void => {
    loginEpoch += 1
    status.value = 'anonymous'
    user.value = null
    walletAddress.value = null
    hasWallet.value = false
    isNew.value = false
    loginMethod.value = null
    emailOptIn.value = null
    error.value = null
  }

  /** Run a Privy step, recording its error code before rethrowing. */
  const attempt = async <T>(step: () => Promise<T>): Promise<T> => {
    error.value = null
    try {
      return await step()
    } catch (e) {
      error.value = errorCode(e)
      throw e
    }
  }

  /**
   * The Privy login still valid in this tab, if any. A tab that has not used
   * Privy answers without loading the SDK. `user.get()` throws when logged
   * out, so the access token is what tells a login from leftover data.
   */
  const liveLogin = async () => {
    if (!tabHoldsPrivyData()) return null
    const loaded = await loadPrivy()
    if (!(await loaded.privy.getAccessToken())) return null
    const current = await loaded.privy.user.get().then(
      result => result.user,
      () => null,
    )
    return { loaded, user: current }
  }

  /**
   * End the Privy login. This is the Privy wallet's `disconnect()`.
   *
   * The store forgets the login and the wallet iframe goes at once; only then
   * is Privy told. A logout that answers late therefore cannot wipe a login
   * made in the meantime. The SDK clears the local tokens before it contacts
   * Privy, so the login is gone even offline. No user id is passed: with one
   * the SDK also waits on the wallet iframe to clear MFA state, which this
   * app does not use.
   */
  const endLogin = async (): Promise<void> => {
    reset()
    loadedModules?.teardownWalletIframe()
    const { privy } = await loadPrivy()
    await privy.auth.logout()
  }

  /** End the login and, if its wallet is the active one, leave it watch-only. */
  const dropLogin = async (): Promise<void> => {
    try {
      await endLogin()
    } finally {
      const walletStore = useWalletStore()
      if (walletStore.wallet instanceof PrivyWallet) {
        walletStore.setWatchOnlyIfExist()
      }
    }
  }

  /** A new login never starts on top of an old one. */
  const dropExistingLogin = async (): Promise<void> => {
    if (await liveLogin()) await dropLogin()
  }

  const applyUser = (loggedIn: PrivyUser, loaded: PrivyModules): void => {
    user.value = loggedIn
    hasWallet.value = loaded.embeddedWallet(loggedIn) !== null
    status.value = 'authenticated'
  }

  const applySession = (
    session: PrivySession,
    method: LoginMethod,
    loaded: PrivyModules,
  ): void => {
    applyUser(session.user, loaded)
    isNew.value = loaded.isNewUser(session)
    loginMethod.value = method
  }

  /**
   * Prepare a Google login and return the URL to leave for; the browser
   * returns on the callback route. The caller navigates, so it can decide
   * not to when the user has closed the modal meanwhile.
   */
  const startGoogleLogin = (): Promise<string> =>
    attempt(async () => {
      await dropExistingLogin()
      const { privy } = await loadPrivy()
      const { url } = await privy.auth.oauth.generateURL(
        'google',
        `${window.location.origin}${ROUTES_AUTH.CALLBACK.PATH}`,
      )
      loginMethod.value = 'google'
      return url
    })

  /** Finish a Google login with the code and state from the callback URL. */
  const completeOAuth = (code: string, state: string): Promise<void> =>
    attempt(async () => {
      const loaded = await loadPrivy()
      const session = await loaded.privy.auth.oauth.loginWithCode(
        code,
        state,
        undefined,
        undefined,
        'login-or-sign-up',
        NO_WALLET_AT_LOGIN,
      )
      applySession(session, 'google', loaded)
    })

  const sendEmailCode = (email: string): Promise<void> =>
    attempt(async () => {
      await dropExistingLogin()
      const { privy } = await loadPrivy()
      await privy.auth.email.sendCode(email)
      loginMethod.value = 'email'
    })

  const loginWithEmailCode = (email: string, otp: string): Promise<void> =>
    attempt(async () => {
      const loaded = await loadPrivy()
      const session = await loaded.privy.auth.email.loginWithCode(
        email,
        otp,
        'login-or-sign-up',
        NO_WALLET_AT_LOGIN,
      )
      applySession(session, 'email', loaded)
    })

  /**
   * Connect the embedded wallet, creating it first for a user who has none.
   *
   * Safe to retry. Privy is asked for the user before anything is created,
   * because a create whose answer was lost has still made the wallet, and the
   * create itself carries a key that makes repeating it harmless.
   *
   * @param chainId chain the wallet starts on; defaults to the selected one
   */
  const provisionWallet = (chainId?: string): Promise<void> =>
    attempt(async () => {
      const epoch = loginEpoch
      const loginEnded = (): boolean => epoch !== loginEpoch
      const ended = () => new Error('The Privy login ended')

      const loaded = await loadPrivy()
      if (!user.value || loginEnded()) throw ended()
      const walletChainId = chainId ?? useChainsStore().selectedChain?.chainID
      if (!walletChainId) throw new Error('No chain to connect the wallet on')
      loaded.mountWalletIframe()

      const latest = await loaded.privy.user.get().then(
        result => result.user,
        () => null,
      )
      if (loginEnded()) throw ended()
      if (latest) applyUser(latest, loaded)

      let account = user.value
      if (!loaded.embeddedWallet(account)) {
        const created = await loaded.privy.embeddedWallet.create({
          idempotencyKey: await loaded.walletIdempotencyKey(account),
        })
        if (loginEnded()) throw ended()
        applyUser(created.user, loaded)
        account = created.user
      }
      const input = loaded.walletProviderInput(account)
      if (!input) throw new Error('The embedded wallet was not created')
      const provider =
        await loaded.privy.embeddedWallet.getEthereumProvider(input)
      if (loginEnded()) throw ended()

      const wallet = new PrivyWallet({
        provider,
        address: input.wallet.address as HexPrefixedString,
        chainId: String(walletChainId),
        logout: endLogin,
      })
      const walletStore = useWalletStore()
      await walletStore.setWallet(
        wallet,
        WALLET_NAME,
        WalletConfigType.SOFTWARE,
      )
      if (loginEnded()) {
        // The login was dropped while the wallet store was connecting: a
        // signing wallet must not outlive it.
        if (walletStore.wallet === wallet) walletStore.setWatchOnlyIfExist()
        throw ended()
      }
      walletAddress.value = input.wallet.address
      hasWallet.value = true
    })

  /** The email of a login still valid in this tab, to offer "Continue as". */
  const findExistingLogin = async (): Promise<{
    email: string | undefined
  } | null> => {
    const login = await liveLogin()
    if (!login?.user) return null
    return { email: login.loaded.primaryEmail(login.user) }
  }

  /** Reuse the login still valid in this tab. Only ever on the user's say-so. */
  const continueWithExistingLogin = (): Promise<void> =>
    attempt(async () => {
      const login = await liveLogin()
      if (!login?.user) throw new Error('No Privy login to continue with')
      applyUser(login.user, login.loaded)
      isNew.value = false
    })

  /** Drop the login still valid in this tab so another account can log in. */
  const useDifferentAccount = (): Promise<void> => attempt(dropLogin)

  /**
   * A saved Privy address is being deleted: end the login it belongs to, if
   * that login is still in this tab, the way disconnecting the wallet does.
   * A login for another Privy account is left alone, and a tab that has not
   * used Privy answers without loading the SDK. When the login's address
   * cannot be read, it is ended: deleting must not leave a login behind.
   */
  const endLoginFor = async (address: string): Promise<void> => {
    const login = await liveLogin()
    if (!login) return
    const owner = login.user && login.loaded.embeddedWallet(login.user)?.address
    if (owner && owner.toLowerCase() !== address.toLowerCase()) return
    await dropLogin()
  }

  const setOptIn = (value: boolean): void => {
    emailOptIn.value = value
    void analytics.trackOnboardingEvent(OnboardingEvent.OPT_IN, { value })
  }

  return {
    status,
    user,
    walletAddress,
    hasWallet,
    isNew,
    loginMethod,
    emailOptIn,
    error,
    startGoogleLogin,
    completeOAuth,
    sendEmailCode,
    loginWithEmailCode,
    provisionWallet,
    findExistingLogin,
    continueWithExistingLogin,
    useDifferentAccount,
    endLoginFor,
    setOptIn,
  }
})
