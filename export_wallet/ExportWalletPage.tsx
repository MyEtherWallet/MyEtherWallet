import { useEffect, useRef, useState } from 'react'
import { useExportWallet, useLogin, usePrivy } from '@privy-io/react-auth'
import configs from '@/configs'
import { exportPageMessages } from './messages'
import { forgetSdkSession } from './sdkSession'

/**
 * The page a Privy user gets their recovery phrase from.
 *
 * Privy lets a wallet be exported only through its React SDK: Privy hands
 * the phrase over in its own modal on its own origin, through Copy buttons
 * and nowhere else, and this app never sees it. The app itself runs on
 * Privy's core SDK, whose login this SDK cannot read, so the user logs in
 * again here. This page does nothing else: log in, Privy's export screen,
 * log out, and a reminder that the phrase is now on the clipboard.
 *
 * A login is never reused. The React SDK keeps its login in localStorage,
 * which every tab shares and which outlives the tab. So the page shows the
 * export screen only for a login it has just seen made, once, and ends any
 * other login it finds before anything is shown.
 *
 * This folder is React, apart from the Vue app in `src/`: it has its own
 * tsconfig (React's JSX settings) and its own lint rules for hooks.
 */

/**
 * Set in this tab's sessionStorage when the user starts a login here. Its one
 * job is to survive the trip to Google and back; it is taken off again the
 * moment the page loads, whatever the page then decides.
 */
export const LOGIN_STARTED_KEY = 'mew-export-login'

/** How long the SDK may take to say whether there is a login. */
const SDK_READY_TIMEOUT_MS = 20_000
/**
 * How long Privy's wallet may take to become ready after a login. On the
 * return from Google the login is known before the wallet is.
 */
const WALLET_READY_TIMEOUT_MS = 15_000
const WALLET_READY_RETRY_MS = 500
/** How the SDK words "the wallet is not ready yet", which is not a failure. */
const WALLET_NOT_READY = 'Wallet not ready for export'

const markLoginStarted = (): void => {
  try {
    sessionStorage.setItem(LOGIN_STARTED_KEY, '1')
  } catch {
    // Without the mark a Google login is ended on return: fails closed.
  }
}
const clearLoginMark = (): void => {
  try {
    sessionStorage.removeItem(LOGIN_STARTED_KEY)
  } catch {
    // Nothing to clear.
  }
}
/**
 * Whether this load is the return from a Google login started on this page:
 * the tab carries the mark and the address carries Privy's reply. Neither
 * alone will do. Reading the mark removes it, so a later load of this tab (a
 * reload, a restored tab) starts with nothing.
 */
const takeReturnFromLogin = (): boolean => {
  let marked = false
  try {
    marked = sessionStorage.getItem(LOGIN_STARTED_KEY) !== null
  } catch {
    marked = false
  }
  clearLoginMark()
  const reply = new URLSearchParams(window.location.search)
  return (
    marked && reply.has('privy_oauth_state') && reply.has('privy_oauth_code')
  )
}

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

type Step = 'starting' | 'login' | 'showing' | 'done' | 'error'

const BUTTON =
  'flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-background-brand px-6 text-s-16 font-semibold text-white transition-colors hover:bg-background-brand-hover'

export const ExportWalletPage = () => {
  const { ready, authenticated, error, logout } = usePrivy()
  const { exportWallet } = useExportWallet()
  const [step, setStep] = useState<Step>('starting')
  /** Whether the user has had this page clear the clipboard, and how it went. */
  const [clipboard, setClipboard] = useState<'full' | 'cleared' | 'failed'>(
    'full',
  )
  /**
   * A login was just made on this page and has not shown an export yet. Set
   * by the Log in button, or by the return from Google; taken away when the
   * login window is dismissed and when the export screen opens.
   */
  const freshLogin = useRef<boolean | null>(null)
  if (freshLogin.current === null) freshLogin.current = takeReturnFromLogin()
  /** Privy's export screen is open, or about to be, for the current login. */
  const showing = useRef(false)
  // The SDK hands out new functions on every render, and `exportWallet` only
  // works once it has been rebuilt around a ready wallet: always call the
  // latest ones.
  const sdk = useRef({ logout, exportWallet })
  sdk.current = { logout, exportWallet }
  const t = exportPageMessages()

  const { login } = useLogin({
    // The login window was closed, or the login failed: nothing was made.
    onError: () => {
      freshLogin.current = false
      clearLoginMark()
    },
  })

  useEffect(() => {
    if (error) {
      setStep(current => (current === 'starting' ? 'error' : current))
      return
    }
    if (!ready) return
    if (!authenticated) {
      setStep(current => (current === 'starting' ? 'login' : current))
      return
    }
    if (showing.current) return
    if (!freshLogin.current) {
      // A login this page did not just see made: left behind by an earlier
      // visit, or made in another tab. End it. Whoever is here logs in
      // themselves before a phrase is shown.
      void sdk.current.logout().catch(() => setStep('error'))
      return
    }

    /** Open Privy's export screen, waiting for its wallet if need be. */
    const showExport = async (): Promise<boolean> => {
      const deadline = Date.now() + WALLET_READY_TIMEOUT_MS
      for (;;) {
        try {
          // Resolves once the user leaves the export screen.
          await sdk.current.exportWallet()
          return true
        } catch (e) {
          const notReadyYet =
            e instanceof Error && e.message === WALLET_NOT_READY
          if (!notReadyYet || Date.now() >= deadline) return false
          await wait(WALLET_READY_RETRY_MS)
        }
      }
    }

    // One login shows one export.
    freshLogin.current = false
    showing.current = true
    setStep('showing')
    void (async () => {
      const shown = await showExport()
      await sdk.current.logout().catch(() => undefined)
      showing.current = false
      setStep(shown ? 'done' : 'error')
    })()
    // The SDK's functions are reached through `sdk`, a ref, so the effect
    // follows what the SDK reports and nothing else.
  }, [ready, authenticated, error])

  // The SDK that never answers (offline, Privy unreachable) must not leave
  // the user in front of "One moment…" for good.
  useEffect(() => {
    if (ready) return
    const timer = setTimeout(
      () => setStep(current => (current === 'starting' ? 'error' : current)),
      SDK_READY_TIMEOUT_MS,
    )
    return () => clearTimeout(timer)
  }, [ready])

  // A tab closed with the export screen open would leave the login behind.
  // Only then: the page is also left on the way to Google, mid-login.
  useEffect(() => {
    const onLeave = (): void => {
      if (!showing.current) return
      // The SDK's logout cannot finish in a closing tab, so the tokens are
      // dropped here. Logout goes first: it reads the token it tells Privy to
      // end before it does anything else.
      void sdk.current.logout().catch(() => undefined)
      forgetSdkSession()
    }
    window.addEventListener('pagehide', onLeave)
    return () => window.removeEventListener('pagehide', onLeave)
  }, [])

  // Privy's export screen copies the phrase; it is still on the clipboard
  // when the user is back here. Only a click may overwrite the clipboard.
  const clearClipboard = (): void => {
    navigator.clipboard.writeText('').then(
      () => setClipboard('cleared'),
      () => setClipboard('failed'),
    )
  }

  const startLogin = (): void => {
    freshLogin.current = true
    markLoginStarted()
    // An existing account only: nobody signs up on the way to a phrase.
    login({ loginMethods: ['email', 'google'], disableSignup: true })
  }

  const title = <h1 className="text-heading-base">{t.title}</h1>

  const body = () => {
    if (step === 'done') {
      return (
        <>
          <h1 className="text-heading-base">{t.done_title}</h1>
          <p className="text-text-base text-text-subtle">
            {clipboard === 'cleared' ? t.clipboard_cleared : t.done_body}
          </p>
          {clipboard === 'failed' && (
            <p role="alert" className="text-text-base">
              {t.clipboard_failed}
            </p>
          )}
          {clipboard !== 'cleared' && (
            <button type="button" className={BUTTON} onClick={clearClipboard}>
              {t.clear_clipboard}
            </button>
          )}
          <a
            href={import.meta.env.BASE_URL}
            className="font-semibold text-text-brand underline"
          >
            {t.return}
          </a>
        </>
      )
    }
    if (step === 'error') {
      return (
        <>
          {title}
          <p role="alert" className="text-text-base">
            {t.error}
          </p>
          {/* A clean load of the page: nothing of this attempt is carried over. */}
          <a href={configs.WALLET_EXPORT_PAGE} className={BUTTON}>
            {t.try_again}
          </a>
        </>
      )
    }
    if (step === 'login') {
      return (
        <>
          {title}
          <p className="text-text-base text-text-subtle">{t.intro}</p>
          <button type="button" className={BUTTON} onClick={startLogin}>
            {t.log_in}
          </button>
        </>
      )
    }
    return (
      <>
        {title}
        <p className="text-text-base text-text-subtle">
          {step === 'showing' ? t.showing : t.starting}
        </p>
      </>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 text-text-default">
      <section className="flex w-full max-w-[480px] flex-col items-center gap-4 rounded-20 bg-background-default p-6 text-center">
        {body()}
      </section>
    </main>
  )
}
