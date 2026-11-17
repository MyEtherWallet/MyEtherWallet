import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'

const fake = vi.hoisted(() => ({
  auth: undefined as unknown as Record<string, unknown>,
  access: undefined as unknown as Record<string, unknown>,
  setSelectedNetwork: vi.fn(),
  addToastMessage: vi.fn(),
  track: vi.fn(),
  navigateTo: vi.fn(),
}))

vi.mock('@/stores/authStore', () => ({ useAuthStore: () => fake.auth }))
vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => fake.access }))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ setSelectedNetwork: fake.setSelectedNetwork }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: fake.addToastMessage }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackOnboardingEvent: fake.track },
}))
vi.mock('@/i18n', () => ({ default: { global: { t: (key: string) => key } } }))
vi.mock('@/utils/navigateTo', () => ({ navigateTo: fake.navigateTo }))

import { usePrivyOnboarding } from '@/modules/access/composables/usePrivyOnboarding'
import {
  CONNECTED_HOLD_MS,
  GOOGLE_VERIFY_TIMEOUT_MS,
  RESEND_COOLDOWN_SECONDS,
  RETURN_TO_KEY,
  WALLET_SETUP_MIN_MS,
} from '@/modules/access/common/privyOnboarding'

const coded = (code: string) => Object.assign(new Error(code), { code })
/** A request the test settles by hand. */
const deferred = <T = undefined>() => {
  let resolve: (value: T) => void = () => undefined
  let reject: (error: unknown) => void = () => undefined
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
const mocked = (name: string) => fake.auth[name] as ReturnType<typeof vi.fn>
const events = () => fake.track.mock.calls.map(call => call[0])

/** A login that succeeds, for a user who does or does not have a wallet. */
const loginSucceeds = (action: string, hasWallet: boolean) => {
  ;(fake.auth[action] as ReturnType<typeof vi.fn>).mockImplementation(
    async () => {
      fake.auth.status = 'authenticated'
      fake.auth.hasWallet = hasWallet
      fake.auth.isNew = false
    },
  )
}

describe('usePrivyOnboarding', () => {
  let flow: ReturnType<typeof usePrivyOnboarding>

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    sessionStorage.clear()
    fake.auth = reactive({
      status: 'anonymous',
      hasWallet: false,
      isNew: false,
      error: null,
      findExistingLogin: vi.fn(async () => null),
      continueWithExistingLogin: vi.fn(async () => undefined),
      useDifferentAccount: vi.fn(async () => undefined),
      startGoogleLogin: vi.fn(async () => 'https://accounts.google.com/x'),
      completeOAuth: vi.fn(async () => undefined),
      sendEmailCode: vi.fn(async () => undefined),
      loginWithEmailCode: vi.fn(async () => undefined),
      provisionWallet: vi.fn(async () => undefined),
      setOptIn: vi.fn(),
    })
    fake.access = reactive({
      selectedChain: { name: 'POLYGON', type: 'EVM', chainID: '137' },
      closeAccessDialog: vi.fn(),
    })
    flow = usePrivyOnboarding()
    flow.reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('entering the sign-in view', () => {
    it('shows the entry screen when the tab holds no login', async () => {
      await flow.enter()

      expect(flow.state.value).toBe('entry')
      expect(events()).toContain('Onboarding_Entry_Viewed')
    })

    it('asks whether to continue when a login is still valid in the tab', async () => {
      ;(
        fake.auth.findExistingLogin as ReturnType<typeof vi.fn>
      ).mockResolvedValue({ email: 'ada@example.com' })

      await flow.enter()

      expect(flow.state.value).toBe('existing_login')
      expect(flow.existingEmail.value).toBe('ada@example.com')
    })

    it('continues with the existing login only when the user says so', async () => {
      loginSucceeds('continueWithExistingLogin', true)

      const pending = flow.continueAsExisting()
      await vi.runAllTimersAsync()
      await pending

      expect(fake.auth.continueWithExistingLogin).toHaveBeenCalledTimes(1)
      expect(fake.auth.provisionWallet).toHaveBeenCalledWith('137')
      expect(flow.state.value).toBe('done')
    })

    it('does not offer to continue when the selected network is not an EVM one', async () => {
      fake.access.selectedChain = { name: 'BITCOIN', type: 'BITCOIN' }
      mocked('findExistingLogin').mockResolvedValue({
        email: 'ada@example.com',
      })

      await flow.enter()

      expect(flow.state.value).toBe('entry')
    })

    it('does not put the prompt over a screen the user has already moved to', async () => {
      const lookup = deferred<{ email: string }>()
      mocked('findExistingLogin').mockReturnValue(lookup.promise)

      const entering = flow.enter()
      await flow.chooseEmail('ada@example.com')
      lookup.resolve({ email: 'old@example.com' })
      await entering

      expect(flow.state.value).toBe('email.code')
    })

    it('logs out and shows the entry screen for a different account', async () => {
      await flow.useDifferentAccount()

      expect(fake.auth.useDifferentAccount).toHaveBeenCalledTimes(1)
      expect(flow.state.value).toBe('entry')
    })
  })

  describe('Google', () => {
    it('remembers where to return and leaves for Google', async () => {
      await flow.chooseGoogle('/stocks?tab=all')

      expect(sessionStorage.getItem(RETURN_TO_KEY)).toBe('/stocks?tab=all')
      expect(fake.auth.startGoogleLogin).toHaveBeenCalledTimes(1)
      expect(fake.navigateTo).toHaveBeenCalledWith(
        'https://accounts.google.com/x',
      )
      expect(flow.state.value).toBe('google.verifying')
      expect(events()).toEqual(
        expect.arrayContaining([
          'Onboarding_Method_Selected',
          'Onboarding_Google_Started',
        ]),
      )
    })

    it('does not leave for Google once the modal was closed while the login was being prepared', async () => {
      const preparing = deferred<string>()
      mocked('startGoogleLogin').mockReturnValue(preparing.promise)

      const choosing = flow.chooseGoogle('/')
      await flow.cancel()
      preparing.resolve('https://accounts.google.com/x')
      await choosing

      expect(fake.navigateTo).not.toHaveBeenCalled()
      expect(flow.state.value).toBe('entry')
    })

    it('returns to the entry screen when the browser brings the page back from Google', async () => {
      await flow.chooseGoogle('/')
      expect(flow.state.value).toBe('google.verifying')

      window.dispatchEvent(
        new PageTransitionEvent('pageshow', { persisted: true }),
      )

      expect(flow.state.value).toBe('entry')
    })

    it('shows the Google error when the redirect cannot start', async () => {
      ;(
        fake.auth.startGoogleLogin as ReturnType<typeof vi.fn>
      ).mockRejectedValue(coded('disallowed_login_method'))

      await flow.chooseGoogle('/')

      expect(flow.state.value).toBe('error')
      expect(flow.errorKind.value).toBe('google')
    })

    it('skips wallet setup and the opt-in for a user who already has a wallet', async () => {
      loginSucceeds('completeOAuth', true)

      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(0)
      expect(flow.state.value).toBe('google.connected')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)
      await pending

      expect(fake.auth.completeOAuth).toHaveBeenCalledWith('code-1', 'state-1')
      expect(fake.auth.provisionWallet).toHaveBeenCalledWith('137')
      expect(flow.state.value).toBe('done')
      expect(fake.access.closeAccessDialog).toHaveBeenCalled()
      expect(fake.setSelectedNetwork).toHaveBeenCalledWith('POLYGON')
    })

    it('sets up a wallet for a user who has none, new or not, then asks the opt-in', async () => {
      loginSucceeds('completeOAuth', false)

      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)
      expect(flow.state.value).toBe('wallet.setup')
      await vi.advanceTimersByTimeAsync(WALLET_SETUP_MIN_MS)
      await pending

      expect(fake.auth.provisionWallet).toHaveBeenCalledTimes(1)
      expect(flow.state.value).toBe('account.ready')
      expect(fake.access.closeAccessDialog).not.toHaveBeenCalled()
    })

    it('shows the Google error when the login cannot be completed', async () => {
      ;(fake.auth.completeOAuth as ReturnType<typeof vi.fn>).mockRejectedValue(
        coded('pkce_state_code_mismatch'),
      )

      await flow.resumeGoogle('code-1', 'bad')

      expect(flow.state.value).toBe('error')
      expect(flow.errorKind.value).toBe('google')
      expect(events()).toContain('Onboarding_Google_Failed')
    })

    it('shows the Google error when the callback carries no code', () => {
      flow.failGoogle('access_denied')

      expect(flow.state.value).toBe('error')
      expect(flow.errorKind.value).toBe('google')
    })

    it('calls it a timeout when Google verification takes too long', async () => {
      ;(fake.auth.completeOAuth as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise(() => undefined),
      )

      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(GOOGLE_VERIFY_TIMEOUT_MS)
      await pending

      expect(flow.state.value).toBe('error')
      expect(flow.errorKind.value).toBe('timeout')
    })
  })

  describe('email', () => {
    it('sends the code and shows the code screen', async () => {
      await flow.chooseEmail('ada@example.com')

      expect(fake.auth.sendEmailCode).toHaveBeenCalledWith('ada@example.com')
      expect(flow.state.value).toBe('email.code')
      expect(flow.email.value).toBe('ada@example.com')
      expect(flow.resendIn.value).toBe(RESEND_COOLDOWN_SECONDS)
    })

    it('stays on the entry screen with a field error when the code cannot be sent', async () => {
      ;(fake.auth.sendEmailCode as ReturnType<typeof vi.fn>).mockRejectedValue(
        coded('invalid_data'),
      )

      await flow.chooseEmail('nope@invalid')

      expect(flow.state.value).toBe('entry')
      expect(flow.emailError.value).toBe('access_wallet.social.error.send_code')
    })

    it('shows the incorrect-code state and counts the attempt', async () => {
      await flow.chooseEmail('ada@example.com')
      ;(
        fake.auth.loginWithEmailCode as ReturnType<typeof vi.fn>
      ).mockRejectedValue(coded('invalid_credentials'))

      await flow.submitCode('000000')

      expect(flow.state.value).toBe('email.code.error')
      expect(fake.track).toHaveBeenCalledWith('Onboarding_Email_Code_Failed', {
        attempt: 1,
      })
    })

    it('shows every wrong code, not only the first', async () => {
      await flow.chooseEmail('ada@example.com')
      mocked('loginWithEmailCode').mockRejectedValueOnce(
        coded('invalid_credentials'),
      )
      await flow.submitCode('000000')
      const second = deferred()
      mocked('loginWithEmailCode').mockReturnValue(second.promise)

      const submitting = flow.submitCode('111111')
      // Back to the plain code screen while the new code is checked, so the
      // error state is entered again and the screen reacts to it.
      expect(flow.state.value).toBe('email.code')
      second.reject(coded('invalid_credentials'))
      await submitting

      expect(flow.state.value).toBe('email.code.error')
      expect(fake.track).toHaveBeenCalledWith('Onboarding_Email_Code_Failed', {
        attempt: 2,
      })
    })

    it('ignores a second submit while a code is being checked', async () => {
      await flow.chooseEmail('ada@example.com')
      const checking = deferred()
      mocked('loginWithEmailCode').mockReturnValue(checking.promise)

      const first = flow.submitCode('123456')
      await flow.submitCode('123456')
      checking.reject(coded('invalid_credentials'))
      await first

      expect(fake.auth.loginWithEmailCode).toHaveBeenCalledTimes(1)
    })

    it('ignores a second Continue while the code is being sent', async () => {
      const sending = deferred()
      mocked('sendEmailCode').mockReturnValue(sending.promise)

      const first = flow.chooseEmail('ada@example.com')
      expect(flow.busy.value).toBe(true)
      await flow.chooseEmail('ada@example.com')
      sending.resolve(undefined)
      await first

      expect(fake.auth.sendEmailCode).toHaveBeenCalledTimes(1)
      expect(flow.busy.value).toBe(false)
    })

    it('goes from a correct code to wallet setup to the opt-in for a new user', async () => {
      await flow.chooseEmail('ada@example.com')
      loginSucceeds('loginWithEmailCode', false)

      const pending = flow.submitCode('123456')
      await vi.advanceTimersByTimeAsync(0)
      expect(flow.state.value).toBe('email.code.success')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)
      expect(flow.state.value).toBe('wallet.setup')
      await vi.advanceTimersByTimeAsync(WALLET_SETUP_MIN_MS)
      await pending

      expect(fake.auth.loginWithEmailCode).toHaveBeenCalledWith(
        'ada@example.com',
        '123456',
      )
      expect(flow.state.value).toBe('account.ready')
    })

    it('does not resend before the cooldown has passed', async () => {
      await flow.chooseEmail('ada@example.com')

      await flow.resendCode()

      expect(fake.auth.sendEmailCode).toHaveBeenCalledTimes(1)
    })

    it('resends once the cooldown has passed and restarts it', async () => {
      await flow.chooseEmail('ada@example.com')
      await vi.advanceTimersByTimeAsync(RESEND_COOLDOWN_SECONDS * 1000)
      expect(flow.resendIn.value).toBe(0)

      await flow.resendCode()

      expect(fake.auth.sendEmailCode).toHaveBeenCalledTimes(2)
      expect(flow.state.value).toBe('email.code')
      expect(flow.resendIn.value).toBe(RESEND_COOLDOWN_SECONDS)
      expect(events()).toContain('Onboarding_Email_Code_Resent')
    })

    it('returns to the entry screen with the back arrow', async () => {
      await flow.chooseEmail('ada@example.com')

      flow.back()

      expect(flow.state.value).toBe('entry')
    })
  })

  describe('wallet setup and opt-in', () => {
    const reachWalletSetupFailure = async () => {
      loginSucceeds('completeOAuth', false)
      ;(
        fake.auth.provisionWallet as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(coded('embedded_wallet_creation_error'))
      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS + WALLET_SETUP_MIN_MS)
      await pending
    }

    it('cannot be closed while the wallet is being set up', async () => {
      loginSucceeds('completeOAuth', false)
      ;(fake.auth.provisionWallet as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise(() => undefined),
      )

      void flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)

      expect(flow.state.value).toBe('wallet.setup')
      expect(flow.isPersistent.value).toBe(true)
    })

    it('shows the wallet error instead of the opt-in when setup fails', async () => {
      await reachWalletSetupFailure()

      expect(flow.state.value).toBe('error')
      expect(flow.errorKind.value).toBe('wallet')
    })

    it('retries only the wallet setup after a wallet error', async () => {
      await reachWalletSetupFailure()

      const pending = flow.retry()
      await vi.advanceTimersByTimeAsync(WALLET_SETUP_MIN_MS)
      await pending

      expect(fake.auth.completeOAuth).toHaveBeenCalledTimes(1)
      expect(fake.auth.provisionWallet).toHaveBeenCalledTimes(2)
      expect(flow.state.value).toBe('account.ready')
    })

    it('finishes without the opt-in when a user who has a wallet retries a failed connect', async () => {
      loginSucceeds('completeOAuth', true)
      mocked('provisionWallet').mockRejectedValueOnce(
        coded('embedded_wallet_webview_not_loaded'),
      )
      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)
      await pending
      expect(flow.errorKind.value).toBe('wallet')

      await flow.retry()

      expect(flow.state.value).toBe('done')
      expect(events()).not.toContain('Onboarding_Wallet_Provisioned')
    })

    it('finishes quietly when the modal is dismissed while the wallet is being set up', async () => {
      loginSucceeds('completeOAuth', false)
      const provisioning = deferred()
      mocked('provisionWallet').mockReturnValue(provisioning.promise)
      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)
      expect(flow.state.value).toBe('wallet.setup')

      await flow.cancel()
      provisioning.resolve(undefined)
      await vi.advanceTimersByTimeAsync(WALLET_SETUP_MIN_MS)
      await pending

      // The wallet is connected; the opt-in is not asked behind a closed modal.
      expect(flow.state.value).toBe('done')
      expect(fake.auth.setOptIn).not.toHaveBeenCalled()
      expect(fake.auth.useDifferentAccount).not.toHaveBeenCalled()
    })

    it('drops the login when wallet setup fails after the modal was dismissed', async () => {
      loginSucceeds('completeOAuth', false)
      const provisioning = deferred()
      mocked('provisionWallet').mockReturnValue(provisioning.promise)
      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)

      await flow.cancel()
      provisioning.reject(coded('embedded_wallet_creation_error'))
      await vi.advanceTimersByTimeAsync(WALLET_SETUP_MIN_MS)
      await pending

      expect(fake.auth.useDifferentAccount).toHaveBeenCalledTimes(1)
      expect(flow.state.value).toBe('entry')
    })

    it('returns to the entry screen when retrying after a Google error', async () => {
      flow.failGoogle('access_denied')

      await flow.retry()

      expect(flow.state.value).toBe('entry')
    })

    it('records the opt-in choice and finishes', async () => {
      loginSucceeds('completeOAuth', false)
      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS + WALLET_SETUP_MIN_MS)
      await pending

      flow.chooseOptIn(true)

      expect(fake.auth.setOptIn).toHaveBeenCalledWith(true)
      expect(flow.state.value).toBe('done')
      expect(fake.access.closeAccessDialog).toHaveBeenCalled()
    })
  })

  describe('closing the modal', () => {
    it('counts closing the opt-in screen as "create account only"', async () => {
      loginSucceeds('completeOAuth', false)
      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS + WALLET_SETUP_MIN_MS)
      await pending

      await flow.cancel()

      expect(fake.auth.setOptIn).toHaveBeenCalledWith(false)
      expect(fake.auth.useDifferentAccount).not.toHaveBeenCalled()
    })

    it('drops a login whose wallet was never connected, and nothing continues', async () => {
      loginSucceeds('completeOAuth', false)
      const pending = flow.resumeGoogle('code-1', 'state-1')
      await vi.advanceTimersByTimeAsync(0)
      expect(flow.state.value).toBe('google.connected')

      await flow.cancel()
      await vi.advanceTimersByTimeAsync(CONNECTED_HOLD_MS)
      await pending

      expect(fake.auth.useDifferentAccount).toHaveBeenCalledTimes(1)
      expect(fake.auth.provisionWallet).not.toHaveBeenCalled()
      expect(flow.state.value).toBe('entry')
      expect(fake.track).toHaveBeenCalledWith('Onboarding_Abandoned', {
        state: 'google.connected',
      })
    })

    it('leaves a logged-out tab alone when the entry screen is closed', async () => {
      await flow.enter()

      await flow.cancel()

      expect(fake.auth.useDifferentAccount).not.toHaveBeenCalled()
    })
  })
})
