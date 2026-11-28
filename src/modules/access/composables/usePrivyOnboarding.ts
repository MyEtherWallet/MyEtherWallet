import { computed, ref } from 'vue'
import i18n from '@/i18n'
import { analytics } from '@/analytics'
import { OnboardingEvent, type OnboardingPayload } from '@/analytics/events'
import {
  CONNECTED_HOLD_MS,
  GOOGLE_VERIFY_TIMEOUT_MS,
  RESEND_COOLDOWN_SECONDS,
  RETURN_TO_KEY,
  WALLET_SETUP_MIN_MS,
  type OnboardingError,
  type OnboardingState,
} from '@/modules/access/common/privyOnboarding'
import { useAccessStore } from '@/stores/accessStore'
import { useAuthStore } from '@/stores/authStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { navigateTo } from '@/utils/navigateTo'

/**
 * State machine for the Google / email login screens (MEW-2289). The state is
 * shared: the connect modal reads it for its header, the screens render from
 * it, and the OAuth callback route drives it after the Google redirect.
 *
 * `run` identifies the current pass through the flow. Anything that awaits
 * compares its token afterwards, so closing the modal stops what was pending.
 */
const state = ref<OnboardingState>('entry')
const email = ref('')
const existingEmail = ref<string | undefined>()
const errorKind = ref<OnboardingError | null>(null)
/** i18n key of the problem with the entry screen's email field, if any. */
const emailError = ref<string | null>(null)
/** Seconds until "Resend code" can be used again. */
const resendIn = ref(0)
/** Privy refused more attempts on this code: a new one must be requested. */
const codeLocked = ref(false)
const codeAttempts = ref(0)
/** The user action still waiting on Privy, if any: one at a time. */
const inFlight = ref<symbol | null>(null)
/** The modal was dismissed during wallet setup: finish without the opt-in. */
let dismissedDuringSetup = false
let run = 0
let resendTimer: ReturnType<typeof setInterval> | undefined

/** States a login has reached while its wallet is not connected yet. */
const LOGGED_IN_WITHOUT_WALLET: OnboardingState[] = [
  'google.connected',
  'email.code.success',
]
const IDLE_STATES: OnboardingState[] = ['entry', 'existing_login', 'done']
const CODE_ENTRY_STATES: OnboardingState[] = ['email.code', 'email.code.error']
const TOO_MANY_ATTEMPTS = /too_many|max_attempts|exceeded/

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

const track = (event: OnboardingEvent, payload?: OnboardingPayload): void => {
  void analytics.trackOnboardingEvent(event, payload)
}

const stopResendCooldown = (): void => {
  clearInterval(resendTimer)
  resendTimer = undefined
}

const startResendCooldown = (): void => {
  stopResendCooldown()
  resendIn.value = RESEND_COOLDOWN_SECONDS
  resendTimer = setInterval(() => {
    resendIn.value = Math.max(resendIn.value - 1, 0)
    if (resendIn.value === 0) stopResendCooldown()
  }, 1000)
}

/** Back to a fresh entry screen; anything still pending is abandoned. */
const reset = (): void => {
  run += 1
  inFlight.value = null
  dismissedDuringSetup = false
  stopResendCooldown()
  state.value = 'entry'
  email.value = ''
  existingEmail.value = undefined
  errorKind.value = null
  emailError.value = null
  resendIn.value = 0
  codeLocked.value = false
  codeAttempts.value = 0
}

/**
 * The browser can bring this page back from Google out of its page cache,
 * frozen on "Verifying…" with nothing left to wait for.
 */
const resetWhenRestoredFromCache = (event: PageTransitionEvent): void => {
  if (event.persisted && state.value === 'google.verifying') reset()
}

/**
 * Run a user action unless another one is still waiting on Privy, so a second
 * click cannot send a second code or check a code twice.
 */
const exclusive = async (action: () => Promise<void>): Promise<void> => {
  if (inFlight.value) return
  const mine = Symbol('action')
  inFlight.value = mine
  try {
    await action()
  } finally {
    if (inFlight.value === mine) inFlight.value = null
  }
}

export const usePrivyOnboarding = () => {
  const auth = useAuthStore()
  const accessStore = useAccessStore()
  const globalStore = useGlobalStore()
  const toastStore = useToastStore()
  const { t } = i18n.global

  /** The embedded wallet is Ethereum-only: use the modal's chain when it is EVM. */
  const evmChain = () =>
    accessStore.selectedChain?.type === 'EVM' ? accessStore.selectedChain : null

  const fail = (kind: OnboardingError): void => {
    // Blocked storage reaches every Privy call; it has its own message.
    errorKind.value = auth.error === 'storage_error' ? 'storage' : kind
    state.value = 'error'
  }

  const connectWallet = (): Promise<void> =>
    auth.provisionWallet(evmChain()?.chainID)

  const finish = (): void => {
    state.value = 'done'
    const chain = evmChain()
    if (chain) globalStore.setSelectedNetwork(chain.name)
    accessStore.closeAccessDialog()
    toastStore.addToastMessage({
      text: t('access_wallet.social.toast.logged_in'),
      type: ToastType.Success,
    })
  }

  /** A login that finished after its screen was left belongs to nothing. */
  const dropStaleLogin = (): void => {
    void auth.useDifferentAccount().catch(() => undefined)
  }

  const setUpWallet = async (token: number): Promise<void> => {
    state.value = 'wallet.setup'
    try {
      await Promise.all([wait(WALLET_SETUP_MIN_MS), connectWallet()])
    } catch {
      if (token !== run) return
      if (dismissedDuringSetup) {
        // Nobody is looking at the modal any more: no error screen, no login.
        reset()
        dropStaleLogin()
        return
      }
      fail('wallet')
      return
    }
    if (token !== run) return
    track(OnboardingEvent.WALLET_PROVISIONED)
    if (dismissedDuringSetup) {
      // Connected, but the opt-in is not asked behind a closed modal.
      finish()
      return
    }
    state.value = 'account.ready'
  }

  /**
   * After a login: a user with a wallet is connected while the success screen
   * holds and then finishes; a user without one goes through wallet setup and
   * the opt-in. The new-user flag plays no part in this.
   */
  const afterLogin = async (
    token: number,
    hold: Promise<void>,
  ): Promise<void> => {
    if (!auth.hasWallet) {
      await hold
      if (token === run) await setUpWallet(token)
      return
    }
    try {
      await Promise.all([hold, connectWallet()])
    } catch {
      if (token === run) fail('wallet')
      return
    }
    if (token === run) finish()
  }

  /** The sign-in view opened: start fresh unless a flow is already under way. */
  const enter = async (): Promise<void> => {
    if (!IDLE_STATES.includes(state.value)) return
    reset()
    const token = run
    track(OnboardingEvent.ENTRY_VIEWED)
    // Google and email are not offered on a non-EVM network, so neither is
    // continuing with a login made through them.
    if (!evmChain()) return
    const existing = await auth.findExistingLogin().catch(() => null)
    // Only over the untouched entry screen: the user may have moved on.
    if (token !== run || !existing || state.value !== 'entry') return
    existingEmail.value = existing.email
    state.value = 'existing_login'
  }

  /** Reuse the login still valid in this tab: only ever on the user's click. */
  const continueAsExisting = (): Promise<void> =>
    exclusive(async () => {
      const token = run
      try {
        await auth.continueWithExistingLogin()
      } catch {
        if (token === run) fail('generic')
        return
      }
      if (token !== run) return
      track(OnboardingEvent.LOGIN_SUCCEEDED, { isNew: false })
      await afterLogin(token, Promise.resolve())
    })

  const useDifferentAccount = (): Promise<void> =>
    exclusive(async () => {
      const token = run
      await auth.useDifferentAccount().catch(() => undefined)
      // The modal was closed meanwhile and something else may be under way:
      // that is not this logout's to reset.
      if (token === run) reset()
    })

  /**
   * Leave for Google. `returnTo` is the in-app route to come back to; the
   * callback route validates it before using it.
   */
  const chooseGoogle = (returnTo: string): Promise<void> =>
    exclusive(async () => {
      const token = run
      track(OnboardingEvent.METHOD_SELECTED, { method: 'google' })
      track(OnboardingEvent.GOOGLE_STARTED)
      state.value = 'google.verifying'
      let url: string
      try {
        sessionStorage.setItem(RETURN_TO_KEY, returnTo)
        url = await auth.startGoogleLogin()
      } catch {
        if (token !== run) return
        track(OnboardingEvent.GOOGLE_FAILED, {
          reason: auth.error ?? 'unknown',
        })
        fail('google')
        return
      }
      // The modal was closed while the login was being prepared: stay.
      if (token !== run) return
      window.addEventListener('pageshow', resetWhenRestoredFromCache, {
        once: true,
      })
      navigateTo(url)
    })

  /** The callback route has the code: finish the Google login. */
  const resumeGoogle = async (
    code: string,
    stateCode: string,
  ): Promise<void> => {
    run += 1
    const token = run
    inFlight.value = null
    errorKind.value = null
    state.value = 'google.verifying'
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<'timeout'>(resolve => {
      timer = setTimeout(() => resolve('timeout'), GOOGLE_VERIFY_TIMEOUT_MS)
    })
    const login = auth.completeOAuth(code, stateCode).then(() => 'ok' as const)
    try {
      const outcome = await Promise.race([login, timeout])
      if (outcome === 'timeout') {
        // Whatever the late answer is, this pass is over.
        login.then(dropStaleLogin, () => undefined)
        if (token !== run) return
        track(OnboardingEvent.GOOGLE_FAILED, { reason: 'timeout' })
        fail('timeout')
        return
      }
    } catch {
      if (token !== run) return
      track(OnboardingEvent.GOOGLE_FAILED, { reason: auth.error ?? 'unknown' })
      fail('google')
      return
    } finally {
      clearTimeout(timer)
    }
    if (token !== run) {
      dropStaleLogin()
      return
    }
    track(OnboardingEvent.GOOGLE_SUCCEEDED)
    track(OnboardingEvent.LOGIN_SUCCEEDED, {
      method: 'google',
      isNew: auth.isNew,
    })
    state.value = 'google.connected'
    await afterLogin(token, wait(CONNECTED_HOLD_MS))
  }

  /** The callback arrived without a code: consent denied, or the user went back. */
  const failGoogle = (reason: string): void => {
    run += 1
    track(OnboardingEvent.GOOGLE_FAILED, { reason })
    fail('google')
  }

  const chooseEmail = (address: string): Promise<void> =>
    exclusive(async () => {
      emailError.value = null
      track(OnboardingEvent.METHOD_SELECTED, { method: 'email' })
      const token = run
      try {
        await auth.sendEmailCode(address)
      } catch {
        if (token !== run) return
        emailError.value = TOO_MANY_ATTEMPTS.test(auth.error ?? '')
          ? 'access_wallet.social.error.rate_limited'
          : 'access_wallet.social.error.send_code'
        return
      }
      if (token !== run) return
      email.value = address
      codeAttempts.value = 0
      codeLocked.value = false
      track(OnboardingEvent.EMAIL_CODE_SENT)
      state.value = 'email.code'
      startResendCooldown()
    })

  const submitCode = (code: string): Promise<void> =>
    exclusive(async () => {
      if (!CODE_ENTRY_STATES.includes(state.value)) return
      const token = run
      // Leave the error state while this code is checked, so a second wrong
      // code enters it again and the screen reacts to it like the first.
      state.value = 'email.code'
      try {
        await auth.loginWithEmailCode(email.value, code)
      } catch {
        if (token !== run) return
        codeAttempts.value += 1
        codeLocked.value = TOO_MANY_ATTEMPTS.test(auth.error ?? '')
        track(OnboardingEvent.EMAIL_CODE_FAILED, {
          attempt: codeAttempts.value,
        })
        state.value = 'email.code.error'
        return
      }
      if (token !== run) {
        dropStaleLogin()
        return
      }
      track(OnboardingEvent.LOGIN_SUCCEEDED, {
        method: 'email',
        isNew: auth.isNew,
      })
      state.value = 'email.code.success'
      await afterLogin(token, wait(CONNECTED_HOLD_MS))
    })

  const resendCode = (): Promise<void> =>
    exclusive(async () => {
      if (resendIn.value > 0 || !email.value) return
      const token = run
      try {
        await auth.sendEmailCode(email.value)
      } catch {
        return
      }
      if (token !== run) return
      codeLocked.value = false
      track(OnboardingEvent.EMAIL_CODE_RESENT)
      state.value = 'email.code'
      startResendCooldown()
    })

  const chooseOptIn = (value: boolean): void => {
    auth.setOptIn(value)
    finish()
  }

  /** The back arrow: from the code screens to the entry screen. */
  const back = (): void => {
    if (!CODE_ENTRY_STATES.includes(state.value)) return
    run += 1
    inFlight.value = null
    stopResendCooldown()
    state.value = 'entry'
  }

  /**
   * "Try again": a wallet error connects the wallet again (setting one up
   * only if the user still has none); anything else restarts the flow.
   */
  const retry = (): Promise<void> =>
    exclusive(async () => {
      if (errorKind.value !== 'wallet') {
        reset()
        return
      }
      run += 1
      errorKind.value = null
      await afterLogin(run, Promise.resolve())
    })

  /**
   * The modal closed, by its own buttons or by anything else (browser Back, a
   * link elsewhere). On the opt-in screen that means "create account only".
   * During wallet setup the setup is left to finish and then ends quietly. A
   * login whose wallet was never connected is dropped, so nothing carries on
   * in the background.
   */
  const cancel = async (): Promise<void> => {
    const leaving = state.value
    if (leaving === 'wallet.setup') {
      dismissedDuringSetup = true
      return
    }
    if (leaving === 'account.ready') {
      chooseOptIn(false)
      return
    }
    const dropLogin =
      LOGGED_IN_WITHOUT_WALLET.includes(leaving) ||
      (leaving === 'error' && errorKind.value === 'wallet')
    if (!IDLE_STATES.includes(leaving)) {
      track(OnboardingEvent.ABANDONED, { state: leaving })
    }
    reset()
    if (dropLogin) await auth.useDifferentAccount().catch(() => undefined)
  }

  /** A user action is waiting on Privy: its buttons should not act again. */
  const busy = computed(() => inFlight.value !== null)
  /** The modal's own close button is taken away while the wallet is set up. */
  const isPersistent = computed(() => state.value === 'wallet.setup')
  /**
   * Where the back arrow leads: the entry screen from the code screens,
   * nowhere otherwise. The entry screen is the dialog's first, so it has none.
   */
  const backTarget = computed<'entry' | null>(() =>
    CODE_ENTRY_STATES.includes(state.value) ? 'entry' : null,
  )

  return {
    state,
    email,
    existingEmail,
    errorKind,
    emailError,
    resendIn,
    codeLocked,
    busy,
    isPersistent,
    backTarget,
    enter,
    continueAsExisting,
    useDifferentAccount,
    chooseGoogle,
    resumeGoogle,
    failGoogle,
    chooseEmail,
    submitCode,
    resendCode,
    chooseOptIn,
    back,
    retry,
    cancel,
    reset,
  }
}
