import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, type Ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const flow = vi.hoisted(() => ({
  state: undefined as unknown as Ref<string>,
  email: undefined as unknown as Ref<string>,
  existingEmail: undefined as unknown as Ref<string | undefined>,
  errorKind: undefined as unknown as Ref<string | null>,
  emailError: undefined as unknown as Ref<string | null>,
  resendIn: undefined as unknown as Ref<number>,
  codeLocked: undefined as unknown as Ref<boolean>,
  busy: undefined as unknown as Ref<boolean>,
  enter: vi.fn(),
  continueAsExisting: vi.fn(),
  useDifferentAccount: vi.fn(),
  chooseGoogle: vi.fn(),
  chooseEmail: vi.fn(),
  submitCode: vi.fn(),
  resendCode: vi.fn(),
  chooseOptIn: vi.fn(),
  retry: vi.fn(),
  cancel: vi.fn(),
}))
const setCurrentView = vi.hoisted(() => vi.fn())

vi.mock('@/modules/access/composables/usePrivyOnboarding', () => ({
  usePrivyOnboarding: () => flow,
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ setCurrentView }),
}))
vi.mock('@/composables/useWalletFlowRoute', () => ({
  useWalletFlowRoute: () => ({ hostRouteName: ref('Stocks') }),
}))
vi.mock('vue-router', async orig => ({
  ...(await orig<typeof import('vue-router')>()),
  useRoute: () => ({ params: {}, query: { type: 'sign_up', tab: 'all' } }),
  useRouter: () => ({
    resolve: (to: { name: string; query: Record<string, string> }) => ({
      fullPath: `/${to.name.toLowerCase()}?${new URLSearchParams(to.query)}`,
    }),
  }),
}))
// The entry screen has its own spec; here it only needs to emit.
vi.mock('@/modules/access/components/AccessSignUp.vue', () => ({
  default: {
    name: 'AccessSignUp',
    props: ['emailError'],
    emits: ['sign-up'],
    template: '<div data-testid="entry">{{ emailError }}</div>',
  },
}))

const { default: PrivyFlow } =
  await import('@/modules/access/components/privy/PrivyFlow.vue')

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      access_wallet: {
        social: { existing: { title: 'Continue as {email}?' } },
      },
    },
  },
})

let wrapper: VueWrapper | undefined
const mountFlow = (state: string) => {
  flow.state.value = state
  wrapper = mount(PrivyFlow, {
    attachTo: document.body,
    global: { plugins: [i18n], stubs: { AppSpinner: true } },
  })
  return wrapper
}

describe('PrivyFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flow.state = ref('entry')
    flow.email = ref('ada@example.com')
    flow.existingEmail = ref(undefined)
    flow.errorKind = ref(null)
    flow.emailError = ref(null)
    flow.resendIn = ref(0)
    flow.codeLocked = ref(false)
    flow.busy = ref(false)
  })
  afterEach(() => wrapper?.unmount())

  it('starts the flow when the sign-in view opens', () => {
    mountFlow('entry')

    expect(flow.enter).toHaveBeenCalledTimes(1)
  })

  it('starts a Google login that returns to the page under the modal', async () => {
    const w = mountFlow('entry')

    w.getComponent({ name: 'AccessSignUp' }).vm.$emit('sign-up', {
      method: 'google',
    })

    expect(flow.chooseGoogle).toHaveBeenCalledWith('/stocks?tab=all')
  })

  it('sends the email code for an email sign-up', () => {
    const w = mountFlow('entry')

    w.getComponent({ name: 'AccessSignUp' }).vm.$emit('sign-up', {
      method: 'email',
      email: 'ada@example.com',
    })

    expect(flow.chooseEmail).toHaveBeenCalledWith('ada@example.com')
  })

  it('passes a failed send to the entry screen as a field error', () => {
    flow.emailError = ref('access_wallet.social.error.send_code')

    const w = mountFlow('entry')

    expect(w.get('[data-testid="entry"]').text()).toBe(
      'access_wallet.social.error.send_code',
    )
  })

  it('offers to continue with a login still valid in the tab', async () => {
    flow.existingEmail = ref('ada@example.com')
    const w = mountFlow('existing_login')

    expect(w.text()).toContain('Continue as ada@example.com?')
    await w.get('[data-testid="continue-as"]').trigger('click')
    await w.get('[data-testid="different-account"]').trigger('click')

    expect(flow.continueAsExisting).toHaveBeenCalledTimes(1)
    expect(flow.useDifferentAccount).toHaveBeenCalledTimes(1)
  })

  it('leads to the other wallet methods from that screen without ending the login', async () => {
    flow.existingEmail = ref('ada@example.com')
    const w = mountFlow('existing_login')

    await w.get('[data-testid="existing-other-methods"]').trigger('click')

    // Someone logged in with Google who wants to add a Ledger keeps the login.
    expect(setCurrentView).toHaveBeenCalledWith('default')
    expect(flow.useDifferentAccount).not.toHaveBeenCalled()
    expect(flow.cancel).not.toHaveBeenCalled()
  })

  it('keeps the email of the existing login out of session replay', () => {
    flow.existingEmail = ref('ada@example.com')

    const w = mountFlow('existing_login')

    expect(w.get('h2').attributes('data-private')).toBeDefined()
  })

  it('does not let a button act again while its action is waiting on Privy', () => {
    flow.existingEmail = ref('ada@example.com')
    flow.busy = ref(true)

    const w = mountFlow('existing_login')

    expect(
      w.get('[data-testid="continue-as"]').attributes('disabled'),
    ).toBeDefined()
    expect(
      w.get('[data-testid="different-account"]').attributes('disabled'),
    ).toBeDefined()
  })

  it('shows the verifying screen while Google is checked', () => {
    expect(mountFlow('google.verifying').text()).toContain(
      'access_wallet.social.google.verifying_title',
    )
  })

  it('shows the connected screen once Google succeeded', () => {
    expect(mountFlow('google.connected').text()).toContain(
      'access_wallet.social.google.connected_title',
    )
  })

  it('submits and resends from the code screen', () => {
    const w = mountFlow('email.code')
    const code = w.getComponent({ name: 'PrivyEmailCode' })

    code.vm.$emit('complete', '123456')
    code.vm.$emit('resend')

    expect(code.props('email')).toBe('ada@example.com')
    expect(flow.submitCode).toHaveBeenCalledWith('123456')
    expect(flow.resendCode).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['email.code', 'default'],
    ['email.code.error', 'error'],
    ['email.code.success', 'success'],
  ])('shows the code screen in the right status for %s', (state, status) => {
    const w = mountFlow(state)

    expect(w.getComponent({ name: 'PrivyEmailCode' }).props('status')).toBe(
      status,
    )
  })

  it('shows the wallet setup screen', () => {
    expect(mountFlow('wallet.setup').text()).toContain(
      'access_wallet.social.wallet_setup.title',
    )
  })

  it('records either opt-in choice from the account-ready screen', async () => {
    const w = mountFlow('account.ready')

    await w.get('[data-testid="create-account-only"]').trigger('click')
    await w.get('[data-testid="get-updates"]').trigger('click')

    expect(flow.chooseOptIn.mock.calls).toEqual([[false], [true]])
  })

  it.each([
    ['google', 'access_wallet.social.error.google_title'],
    ['timeout', 'access_wallet.social.error.timeout_title'],
    ['wallet', 'access_wallet.social.error.wallet_title'],
    ['storage', 'access_wallet.social.error.storage_title'],
    ['generic', 'access_wallet.social.error.generic_title'],
  ])('names what went wrong for a %s error', (kind, title) => {
    flow.errorKind = ref(kind)

    expect(mountFlow('error').text()).toContain(title)
  })

  it('retries from the error screen', async () => {
    flow.errorKind = ref('wallet')
    const w = mountFlow('error')

    await w.get('[data-testid="try-again"]').trigger('click')

    expect(flow.retry).toHaveBeenCalledTimes(1)
  })

  it('falls back to the wallet chooser from the error screen', async () => {
    flow.errorKind = ref('google')
    const w = mountFlow('error')

    await w.get('[data-testid="use-wallet"]').trigger('click')

    expect(flow.cancel).toHaveBeenCalledTimes(1)
    expect(setCurrentView).toHaveBeenCalledWith('default')
  })
})
