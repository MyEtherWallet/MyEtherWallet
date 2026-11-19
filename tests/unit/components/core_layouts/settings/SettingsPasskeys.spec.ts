import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

type Passkey = {
  credentialId: string
  name: string | undefined
  addedAt: number | null
  active: boolean
}

const h = await vi.hoisted(async () => {
  const { ref } = await import('vue')
  return {
    passkeys: ref<Passkey[]>([]),
    supported: true,
    offered: true,
    addPasskey: vi.fn(),
    removePasskey: vi.fn(),
    activatePasskeys: vi.fn(),
  }
})

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    passkeys: h.passkeys,
    addPasskey: h.addPasskey,
    removePasskey: h.removePasskey,
    activatePasskeys: h.activatePasskeys,
  }),
}))
vi.mock('@/providers/privy/passkeySupport', () => ({
  passkeySupported: () => h.supported,
}))
vi.mock('@/providers/privy/accountOffer', () => ({
  passkeysOffered: () => h.offered,
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  const { ref } = await import('vue')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key, locale: ref('en') }),
  }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import SettingsPasskeys from '@/components/core_layouts/settings/SettingsPasskeys.vue'

// The mocked stores are shared refs: a component left mounted by one test
// would react to the next test's changes.
enableAutoUnmount(afterEach)

const passkey = (credentialId: string, overrides: Partial<Passkey> = {}) => ({
  credentialId,
  name: 'iCloud Keychain',
  addedAt: 1_794_000_000,
  active: true,
  ...overrides,
})

const render = () =>
  mount(SettingsPasskeys, {
    global: { mocks: { $t: (key: string) => key } },
  })
type Section = ReturnType<typeof render>
const button = (w: Section, label: string) =>
  w.findAll('button').find(b => b.text().includes(label))
const removeButtons = (w: Section) =>
  w.findAll('button[aria-label="settings.remove_passkey"]')

describe('SettingsPasskeys', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.passkeys.value = []
    h.supported = true
    h.offered = true
    h.addPasskey.mockResolvedValue('added')
    h.removePasskey.mockResolvedValue(undefined)
    h.activatePasskeys.mockResolvedValue(undefined)
  })

  it('offers to add a passkey to an account that has none', () => {
    const w = render()

    expect(w.text()).toContain('settings.passkeys_empty')
    expect(button(w, 'settings.add_passkey')).toBeDefined()
  })

  it('adds a passkey from Settings', async () => {
    const w = render()

    await button(w, 'settings.add_passkey')!.trigger('click')

    expect(h.addPasskey).toHaveBeenCalledWith('settings')
  })

  it('lists each passkey by what made it, and still offers to add another', () => {
    h.passkeys.value = [
      passkey('cred-a'),
      passkey('cred-b', { name: 'Windows Hello' }),
    ]
    const w = render()

    expect(w.text()).toContain('iCloud Keychain')
    expect(w.text()).toContain('Windows Hello')
    expect(w.text()).not.toContain('settings.passkeys_empty')
    expect(button(w, 'settings.add_passkey')).toBeDefined()
  })

  it('keeps the credential ids out of the page', () => {
    h.passkeys.value = [passkey('cred-secret-a')]
    const w = render()

    expect(w.html()).not.toContain('cred-secret-a')
  })

  it('is absent, with no way to add a passkey, while passkeys are not offered', () => {
    h.offered = false
    const w = render()

    expect(w.find('section').exists()).toBe(false)
    expect(button(w, 'settings.add_passkey')).toBeUndefined()
  })

  it('still lets an account that has passkeys see and remove them while adding is not offered', () => {
    h.offered = false
    h.passkeys.value = [passkey('cred-a')]
    const w = render()

    expect(w.text()).toContain('iCloud Keychain')
    expect(removeButtons(w)).toHaveLength(1)
    expect(button(w, 'settings.add_passkey')).toBeUndefined()
  })

  it('is absent on a browser without passkeys when there are none to show', () => {
    h.supported = false
    const w = render()

    expect(w.find('section').exists()).toBe(false)
  })

  it('still lists existing passkeys on a browser that cannot add one', () => {
    h.supported = false
    h.passkeys.value = [passkey('cred-a')]
    const w = render()

    expect(w.text()).toContain('iCloud Keychain')
    expect(button(w, 'settings.add_passkey')).toBeUndefined()
  })

  it('removes a passkey straight away while another one remains', async () => {
    h.passkeys.value = [passkey('cred-a'), passkey('cred-b')]
    const w = render()

    await removeButtons(w)[1].trigger('click')

    expect(h.removePasskey).toHaveBeenCalledWith('cred-b')
  })

  it('asks before removing the last passkey, because that turns the check off', async () => {
    h.passkeys.value = [passkey('cred-a')]
    const w = render()

    await removeButtons(w)[0].trigger('click')

    expect(h.removePasskey).not.toHaveBeenCalled()
    expect(w.text()).toContain('settings.remove_last_passkey')

    await button(w, 'settings.remove')!.trigger('click')

    expect(h.removePasskey).toHaveBeenCalledWith('cred-a')
  })

  it('keeps the last passkey when the user backs out', async () => {
    h.passkeys.value = [passkey('cred-a')]
    const w = render()
    await removeButtons(w)[0].trigger('click')

    await button(w, 'common.cancel')!.trigger('click')

    expect(h.removePasskey).not.toHaveBeenCalled()
    expect(w.text()).not.toContain('settings.remove_last_passkey')
  })

  it('says so when adding a passkey fails', async () => {
    h.addPasskey.mockRejectedValue(new Error('failed_to_create_passkey'))
    const w = render()

    await button(w, 'settings.add_passkey')!.trigger('click')
    await flushPromises()

    expect(w.find('[role="alert"]').text()).toContain('settings.passkey_error')
  })

  it('stays quiet when the user dismisses the browser prompt', async () => {
    h.addPasskey.mockResolvedValue('cancelled')
    const w = render()

    await button(w, 'settings.add_passkey')!.trigger('click')
    await flushPromises()

    expect(w.find('[role="alert"]').exists()).toBe(false)
  })

  it('stays quiet when the user cancels the passkey check that removing asks for', async () => {
    h.passkeys.value = [passkey('cred-a'), passkey('cred-b')]
    h.removePasskey.mockRejectedValue(new Error('Passkey check canceled'))
    const w = render()

    await removeButtons(w)[0].trigger('click')
    await flushPromises()

    expect(w.find('[role="alert"]').exists()).toBe(false)
  })

  it('offers to activate a passkey that was added but is not the check yet', async () => {
    h.passkeys.value = [passkey('cred-a', { active: false })]
    const w = render()

    expect(w.text()).toContain('settings.passkey_not_active')
    await button(w, 'settings.activate_passkey')!.trigger('click')

    expect(h.activatePasskeys.mock.calls).toEqual([['settings']])
  })
})
