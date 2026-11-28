import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

const h = await vi.hoisted(async () => {
  const { ref } = await import('vue')
  return {
    isVisible: ref(false),
    awaitsActivation: ref(false),
    dismiss: vi.fn(),
    passkeyAdded: ref(false),
    addPasskey: vi.fn(),
    activatePasskeys: vi.fn(),
    acknowledgePasskeyAdded: vi.fn(),
    track: vi.fn(),
  }
})

vi.mock('@/modules/home/composables/usePasskeyPrompt', () => ({
  usePasskeyPrompt: () => ({
    isVisible: h.isVisible,
    awaitsActivation: h.awaitsActivation,
    dismiss: h.dismiss,
  }),
}))
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    passkeyAdded: h.passkeyAdded,
    addPasskey: h.addPasskey,
    activatePasskeys: h.activatePasskeys,
    acknowledgePasskeyAdded: h.acknowledgePasskeyAdded,
  }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackAccountSecurityEvent: h.track },
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import PasskeyAddedCard from '@/modules/home/components/PasskeyAddedCard.vue'
import PasskeyPromptCard from '@/modules/home/components/PasskeyPromptCard.vue'

// The mocked stores are shared refs: a component left mounted by one test
// would react to the next test's changes.
enableAutoUnmount(afterEach)

const mocks = { $t: (key: string) => key }
const button = (w: ReturnType<typeof mount>, label: string) =>
  w.findAll('button').find(b => b.text().includes(label))
const closeButton = (w: ReturnType<typeof mount>) =>
  w.find('button[aria-label="common.dismiss"]')

beforeEach(() => {
  vi.clearAllMocks()
  h.isVisible.value = false
  h.awaitsActivation.value = false
  h.passkeyAdded.value = false
  h.addPasskey.mockResolvedValue('added')
  h.activatePasskeys.mockResolvedValue(undefined)
})

describe('PasskeyPromptCard', () => {
  const render = () => mount(PasskeyPromptCard, { global: { mocks } })

  it('is absent while the prompt is not due', () => {
    const w = render()

    expect(w.text()).toBe('')
    expect(h.track).not.toHaveBeenCalled()
  })

  it('asks the user to add a passkey, without promising a way to log in', () => {
    h.isVisible.value = true
    const w = render()

    expect(w.text()).toContain('homePage.passkeyPrompt.title')
    expect(w.text()).toContain('homePage.passkeyPrompt.benefit')
    expect(button(w, 'homePage.passkeyPrompt.add')).toBeDefined()
    expect(w.text().toLowerCase()).not.toContain('log in')
  })

  it('reports that it was shown, once', async () => {
    h.isVisible.value = true
    render()

    expect(h.track.mock.calls).toEqual([['Passkey_Prompt_Viewed']])
  })

  it('adds a passkey from the prompt', async () => {
    h.isVisible.value = true
    const w = render()

    await button(w, 'homePage.passkeyPrompt.add')!.trigger('click')

    expect(h.addPasskey).toHaveBeenCalledWith('home_prompt')
  })

  it('finishes a passkey that was made but protects nothing yet, instead of making another', async () => {
    h.isVisible.value = true
    h.awaitsActivation.value = true
    const w = render()

    await button(w, 'homePage.passkeyPrompt.add')!.trigger('click')

    expect(h.activatePasskeys).toHaveBeenCalledWith('home_prompt')
    expect(h.addPasskey).not.toHaveBeenCalled()
  })

  it('is dismissed from its close button', async () => {
    h.isVisible.value = true
    const w = render()

    await closeButton(w).trigger('click')

    expect(h.dismiss).toHaveBeenCalledTimes(1)
    expect(h.track).toHaveBeenLastCalledWith('Passkey_Prompt_Dismissed')
  })

  it('says so when adding the passkey fails', async () => {
    h.isVisible.value = true
    h.addPasskey.mockRejectedValue(new Error('failed_to_create_passkey'))
    const w = render()

    await button(w, 'homePage.passkeyPrompt.add')!.trigger('click')
    await flushPromises()

    expect(w.find('[role="alert"]').text()).toContain(
      'homePage.passkeyPrompt.error',
    )
  })

  it('stays as it is when the user dismisses the browser prompt', async () => {
    h.isVisible.value = true
    h.addPasskey.mockResolvedValue('cancelled')
    const w = render()

    await button(w, 'homePage.passkeyPrompt.add')!.trigger('click')
    await flushPromises()

    expect(w.find('[role="alert"]').exists()).toBe(false)
    expect(h.dismiss).not.toHaveBeenCalled()
  })
})

describe('PasskeyAddedCard', () => {
  const render = () => mount(PasskeyAddedCard, { global: { mocks } })

  it('is absent until a passkey has just been added', () => {
    expect(render().text()).toBe('')
  })

  it('confirms the passkey as what now secures the wallet, not as a way to log in', () => {
    h.passkeyAdded.value = true
    const w = render()

    expect(w.text()).toContain('homePage.passkeyAdded.title')
    expect(w.text()).toContain('homePage.passkeyAdded.body')
    expect(w.text().toLowerCase()).not.toContain('log in')
  })

  it('goes away on "Got it"', async () => {
    h.passkeyAdded.value = true
    const w = render()

    await button(w, 'common.got_it')!.trigger('click')

    expect(h.acknowledgePasskeyAdded).toHaveBeenCalledTimes(1)
  })

  it('goes away from its close button', async () => {
    h.passkeyAdded.value = true
    const w = render()

    await closeButton(w).trigger('click')

    expect(h.acknowledgePasskeyAdded).toHaveBeenCalledTimes(1)
  })
})
