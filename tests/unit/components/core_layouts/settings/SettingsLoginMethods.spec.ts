import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// The Passkeys section (stubbed below) imports the auth store, and the real
// store reaches the hardware-wallet SDK, which Vitest cannot load.
vi.mock('@/stores/authStore', () => ({ useAuthStore: () => ({}) }))

import SettingsLoginMethods from '@/components/core_layouts/settings/SettingsLoginMethods.vue'

const EMAIL = 'ada@example.com'

const render = (props: {
  method: 'google' | 'email' | null
  email: string | null
}) =>
  mount(SettingsLoginMethods, {
    props,
    // The Passkeys section reads the auth store; it has its own spec.
    global: {
      mocks: { $t: (key: string) => key },
      stubs: { SettingsPasskeys: true },
    },
  })

describe('SettingsLoginMethods', () => {
  it('names a Google login and shows the account email with it', () => {
    const w = render({ method: 'google', email: EMAIL })

    expect(w.text()).toContain('settings.login_method.google')
    expect(w.text()).toContain(EMAIL)
  })

  it('names an email login', () => {
    const w = render({ method: 'email', email: EMAIL })

    expect(w.text()).toContain('settings.login_method.email')
    expect(w.text()).not.toContain('settings.login_method.google')
  })

  it('keeps the email inside the container that session replay blocks, and out of every attribute', () => {
    const w = render({ method: 'google', email: EMAIL })

    expect(w.find('[data-private]').text()).toContain(EMAIL)
    const attributeValues = w
      .findAll('*')
      .flatMap(node => Object.values(node.attributes()))
    expect(attributeValues.join(' ')).not.toContain(EMAIL)
  })

  it('goes back to Settings from the back button', async () => {
    const w = render({ method: 'google', email: EMAIL })

    await w.find('button').trigger('click')

    expect(w.emitted('back')).toHaveLength(1)
  })

  it('holds the Passkeys section under the login method', () => {
    const w = render({ method: 'google', email: EMAIL })

    expect(w.findComponent({ name: 'SettingsPasskeys' }).exists()).toBe(true)
  })
})
