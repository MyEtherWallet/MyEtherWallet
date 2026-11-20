import { defineStore } from 'pinia'
import { computed, ref, shallowRef, toRaw } from 'vue'
import { analytics } from '@/analytics'
import {
  AccountSecurityEvent,
  OnboardingEvent,
  type PasskeySource,
} from '@/analytics/events'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import PrivyWallet from '@/providers/ethereum/privyWallet'
import { passkeysOf } from '@/providers/privy/passkeyList'
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
/** The longest a logout waits for the wallet iframe to forget a passkey check. */
const FORGET_CHECK_TIMEOUT_MS = 2000
/**
 * The same when a wallet is being connected. Longer: the iframe has only just
 * been mounted, and the wallet waits on it in any case.
 */
const FORGET_CHECK_AT_LOGIN_TIMEOUT_MS = 10_000
/** The app creates the wallet itself in the wallet-setup step, never at login. */
const NO_WALLET_AT_LOGIN = {
  embedded: { ethereum: { createOnLogin: 'off' } },
} as const

/**
 * The Privy SDK and everything built on it, loaded on first use so it stays
 * out of the startup bundle, and initialized before it is handed out.
 */
const importPrivy = async () => {
  const [client, users, iframe, passkey, mfa] = await Promise.all([
    import('@/providers/privy/client'),
    import('@/providers/privy/user'),
    import('@/providers/privy/walletIframe'),
    import('@/providers/privy/passkey'),
    import('@/providers/privy/mfaChallenge'),
  ])
  return {
    privy: client.privy,
    ready: client.privyReady,
    ...users,
    ...iframe,
    ...passkey,
    ...mfa,
  }
}
type PrivyModules = Awaited<ReturnType<typeof importPrivy>>
/** The modules once loaded, for the parts that must not wait on a network call. */
let loadedModules: PrivyModules | undefined

const loadPrivy = async (): Promise<PrivyModules> => {
  loadedModules = await importPrivy()
  await loadedModules.ready()
  // From here on Privy may hold a wallet request until the user proves a
  // passkey; without an answer that request waits out a five minute timeout.
  loadedModules.answerPasskeyChecks(outcome => {
    const event = {
      passed: AccountSecurityEvent.PASSKEY_CHECK_PASSED,
      failed: AccountSecurityEvent.PASSKEY_CHECK_FAILED,
      cancelled: AccountSecurityEvent.PASSKEY_CHECK_CANCELLED,
    }[outcome]
    void analytics.trackAccountSecurityEvent(event)
  })
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
  /** The logged-in user's email, shown in the header in place of the address. */
  const email = ref<string | null>(null)
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
   * The account's passkeys. A passkey is the second check Privy asks for
   * before the wallet signs or is exported; it does not log the user in.
   */
  const passkeys = computed(() => passkeysOf(user.value))
  /** A passkey was just added and the user has not been told yet. */
  const passkeyAdded = ref(false)
  /**
   * Identifies the current login. Work that awaits compares it afterwards, so
   * nothing is applied to the store for a login that has ended meanwhile.
   */
  let loginEpoch = 0
  /**
   * Logouts that have begun and not finished. The tokens of the login they
   * end stay in the tab for a moment, so that login still looks alive.
   */
  let logoutsInFlight = 0

  const reset = (): void => {
    loginEpoch += 1
    status.value = 'anonymous'
    user.value = null
    email.value = null
    walletAddress.value = null
    hasWallet.value = false
    isNew.value = false
    loginMethod.value = null
    emailOptIn.value = null
    error.value = null
    passkeyAdded.value = false
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
   *
   * A login that is being logged out is not one: neither when the logout
   * began before this was asked, nor when it began while Privy was answering.
   * Nothing is then built on a login that is about to be gone.
   */
  const liveLogin = async () => {
    if (logoutsInFlight > 0 || !tabHoldsPrivyData()) return null
    const epoch = loginEpoch
    const loaded = await loadPrivy()
    if (!(await loaded.privy.getAccessToken())) return null
    const current = await loaded.privy.user.get().then(
      result => result.user,
      () => null,
    )
    if (epoch !== loginEpoch) return null
    return { loaded, user: current }
  }

  /** Whether Privy asks this user for a second check before the wallet is used. */
  const hasWalletCheck = (account: PrivyUser): boolean =>
    account.mfa_methods.length > 0 ||
    passkeysOf(account).some(passkey => passkey.active)

  /**
   * Have the wallet iframe forget a passkey check this user has passed. Privy
   * keeps a passed check for a while on the device; left there, the next
   * login to the account from this browser could use the wallet without the
   * passkey. Never rejects and never waits longer than `timeoutMs`; resolves
   * whether the iframe confirmed it. A logout goes on either way, so that it
   * neither fails nor hangs; a connection does not (see `provisionWallet`).
   */
  const forgetPasskeyCheck = (
    userId: string,
    timeoutMs: number = FORGET_CHECK_TIMEOUT_MS,
  ): Promise<boolean> =>
    new Promise(resolve => {
      const timer = setTimeout(() => resolve(false), timeoutMs)
      const settle = (forgotten: boolean) => (): void => {
        clearTimeout(timer)
        resolve(forgotten)
      }
      if (!loadedModules) return settle(false)()
      void loadedModules.privy.mfa
        .clearMfa({ userId })
        .then(settle(true), settle(false))
    })

  /**
   * End the Privy login. This is the Privy wallet's `disconnect()`.
   *
   * The store forgets the login and the wallet iframe goes before Privy is
   * told. A logout that answers late therefore cannot wipe a login made in
   * the meantime. The SDK clears the local tokens before it contacts Privy,
   * so the login is gone even offline. No user id is passed to the SDK's
   * logout: with one it waits on the wallet iframe, up to fifteen seconds,
   * to clear the passkey check. For a user who has that check the iframe is
   * asked here instead, briefly, while it is still there.
   */
  const endLogin = async (): Promise<void> => {
    const checkedUser =
      user.value && hasWalletCheck(user.value) ? user.value.id : null
    reset()
    logoutsInFlight += 1
    try {
      if (checkedUser) await forgetPasskeyCheck(checkedUser)
      loadedModules?.teardownWalletIframe()
      const { privy } = await loadPrivy()
      await privy.auth.logout()
    } finally {
      logoutsInFlight -= 1
    }
  }

  /**
   * End the login and, if its wallet is the active one, leave it watch-only.
   *
   * Done only once the wallet is watch-only: what comes next (the next login
   * connecting its wallet, the address being deleted) must not have that
   * switch land on top of it. A switch that fails is not this caller's
   * failure, and the outcome of the logout is what is reported.
   */
  const dropLogin = async (): Promise<void> => {
    try {
      await endLogin()
    } finally {
      const walletStore = useWalletStore()
      if (walletStore.wallet instanceof PrivyWallet) {
        await walletStore.setWatchOnlyIfExist().catch(() => undefined)
      }
    }
  }

  /**
   * A request of the Privy wallet failed: say whether its login is gone, and
   * if so drop it, which leaves the wallet's address watch-only. An answer
   * Privy cannot give (offline) counts as "still there": a signing wallet is
   * not taken away on a guess.
   */
  const dropLoginIfLost = async (): Promise<boolean> => {
    try {
      const { privy } = await loadPrivy()
      if (await privy.getAccessToken()) return false
    } catch {
      return false
    }
    // The wallet is watch-only even when Privy could not be told.
    await dropLogin().catch(() => undefined)
    return true
  }

  /** A new login never starts on top of an old one. */
  const dropExistingLogin = async (): Promise<void> => {
    if (await liveLogin()) await dropLogin()
  }

  const applyUser = (loggedIn: PrivyUser, loaded: PrivyModules): void => {
    user.value = loggedIn
    email.value = loaded.primaryEmail(loggedIn) ?? null
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
      // Every connection starts with no passed check. A logout clears it too,
      // but a tab can be closed, or reloaded, without one: whoever logs in
      // next in this browser is asked for the passkey themselves. A clearing
      // that is not confirmed may have left that check standing, so no
      // wallet is handed out on it: the connection fails and can be retried.
      if (hasWalletCheck(account)) {
        const forgotten = await forgetPasskeyCheck(
          account.id,
          FORGET_CHECK_AT_LOGIN_TIMEOUT_MS,
        )
        if (loginEnded()) throw ended()
        if (!forgotten) {
          throw Object.assign(
            new Error('The passkey check could not be cleared'),
            { code: 'passkey_check_not_cleared' },
          )
        }
      }
      const provider =
        await loaded.privy.embeddedWallet.getEthereumProvider(input)
      if (loginEnded()) throw ended()

      const wallet = new PrivyWallet({
        provider,
        address: input.wallet.address as HexPrefixedString,
        chainId: String(walletChainId),
        logout: endLogin,
        loginLost: dropLoginIfLost,
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
        // The store holds its wallet behind a reactive proxy: compare the
        // wallet itself.
        if (toRaw(walletStore.wallet) === wallet) {
          walletStore.setWatchOnlyIfExist()
        }
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
      loginMethod.value = login.loaded.loginMethodOf(login.user)
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

  /** Take the user as Privy has them now, after a change to their passkeys. */
  const refreshUser = async (loaded: PrivyModules): Promise<void> => {
    const epoch = loginEpoch
    const { user: latest } = await loaded.privy.user.get()
    if (epoch === loginEpoch) applyUser(latest, loaded)
  }

  /**
   * Make every passkey of the account the check. Privy takes the whole list
   * at once, so the ones already in use are named again with a new one.
   */
  const enrollLinkedPasskeys = async (loaded: PrivyModules): Promise<void> => {
    await loaded.enrollPasskeys(
      passkeys.value.map(passkey => passkey.credentialId),
    )
    await refreshUser(loaded)
  }

  /**
   * Add a passkey: the user makes one on this device, and it joins the
   * account's passkeys as the check. Resolves `'cancelled'` when the user
   * dismisses the browser's prompt, which changes nothing.
   *
   * When the passkey is made but cannot be made the check, this rejects and
   * the passkey stays listed as not active; `activatePasskeys()` tries the
   * second half again.
   */
  const addPasskey = (source: PasskeySource): Promise<'added' | 'cancelled'> =>
    attempt(async () => {
      void analytics.trackAccountSecurityEvent(
        AccountSecurityEvent.PASSKEY_ADD_STARTED,
        { source },
      )
      try {
        const epoch = loginEpoch
        const loaded = await loadPrivy()
        if (!user.value) throw new Error('No Privy login to add a passkey to')
        let withPasskey: PrivyUser
        try {
          withPasskey = await loaded.linkPasskey()
        } catch (e) {
          if (e instanceof loaded.PasskeyCancelledError) return 'cancelled'
          throw e
        }
        if (epoch !== loginEpoch) throw new Error('The Privy login ended')
        applyUser(withPasskey, loaded)
        await enrollLinkedPasskeys(loaded)
        passkeyAdded.value = true
        void analytics.trackAccountSecurityEvent(
          AccountSecurityEvent.PASSKEY_ADD_SUCCEEDED,
          { source },
        )
        return 'added'
      } catch (e) {
        void analytics.trackAccountSecurityEvent(
          AccountSecurityEvent.PASSKEY_ADD_FAILED,
          { source, reason: errorCode(e) },
        )
        throw e
      }
    })

  /**
   * Make the linked passkeys the check, after an add that stopped half way.
   * This is what completes that add, so it ends the way an add does.
   */
  const activatePasskeys = (source: PasskeySource): Promise<void> =>
    attempt(async () => {
      await enrollLinkedPasskeys(await loadPrivy())
      passkeyAdded.value = true
      void analytics.trackAccountSecurityEvent(
        AccountSecurityEvent.PASSKEY_ADD_SUCCEEDED,
        { source },
      )
    })

  /**
   * Remove a passkey from the account. Privy asks for a passkey first.
   * Removing the last one turns the check off.
   */
  const removePasskey = (credentialId: string): Promise<void> =>
    attempt(async () => {
      const loaded = await loadPrivy()
      await loaded.unlinkPasskey(credentialId)
      await refreshUser(loaded)
      void analytics.trackAccountSecurityEvent(
        AccountSecurityEvent.PASSKEY_REMOVED,
      )
    })

  const acknowledgePasskeyAdded = (): void => {
    passkeyAdded.value = false
  }

  const setOptIn = (value: boolean): void => {
    emailOptIn.value = value
    void analytics.trackOnboardingEvent(OnboardingEvent.OPT_IN, { value })
  }

  return {
    status,
    user,
    email,
    walletAddress,
    hasWallet,
    isNew,
    loginMethod,
    emailOptIn,
    error,
    passkeys,
    passkeyAdded,
    addPasskey,
    activatePasskeys,
    removePasskey,
    acknowledgePasskeyAdded,
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
