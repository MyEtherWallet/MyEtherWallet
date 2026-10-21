import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// chainsStore pulls the Ledger HW module (see avatar.spec); blockies needs a canvas.
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ allChains: [] }),
}))
vi.mock('@/utils/blockies', () => ({
  default: () => ({ toDataURL: () => 'data:image/png;base64,stub' }),
}))

import AppAddressSelector from '@/components/navbar/AppAddressSelector.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

const ADDRESS = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  messages: {
    en: {
      multi_address: {
        connected: 'Connected',
        watch_only: 'Watch only',
        no_address_pill: 'No address',
      },
      common: { loading: 'Loading' },
    },
  },
})

const mountSelector = (props: Record<string, unknown> = {}) =>
  mount(AppAddressSelector, {
    props: {
      address: ADDRESS,
      balance: '$130.23',
      networkIcon: 'eth.svg',
      ...props,
    },
    global: { plugins: [i18n] },
  })

const hasEye = (wrapper: ReturnType<typeof mountSelector>) =>
  wrapper.findAllComponents(AppIcon).some(icon => icon.props('name') === 'eye')

const button = (wrapper: ReturnType<typeof mountSelector>) =>
  wrapper.get('[data-testid="address-selector"]')

describe('AppAddressSelector — design-library Address selector (MEW-2462)', () => {
  it('is a button with the Figma pill box', () => {
    const el = button(mountSelector())
    expect(el.element.tagName).toBe('BUTTON')
    expect(el.attributes('type')).toBe('button')
    // The manage-accounts popup is not a menu, so no aria-haspopup.
    expect(el.attributes('aria-haspopup')).toBeUndefined()
    expect(el.classes()).toEqual(
      expect.arrayContaining([
        'h-10',
        'rounded-full',
        'border-border-default',
        'bg-background-alternative',
        'pl-2',
        'pr-2.5',
        'gap-2.5',
        'hover:bg-background-default',
      ]),
    )
  })

  it('shows the account avatar with the network badge', () => {
    const avatar = mountSelector().findComponent(AppAvatar)
    expect(avatar.props()).toMatchObject({
      type: 'account',
      size: 's',
      address: ADDRESS,
      badgeBottom: true,
    })
    expect(mountSelector().find('img[src="eth.svg"]').exists()).toBe(true)
  })

  it('shows the name, or the truncated address when there is none', () => {
    expect(mountSelector({ name: 'Savings account' }).text()).toContain(
      'Savings account',
    )
    const unnamed = mountSelector().text()
    expect(unnamed).toContain('0x32Be...2D88')
    expect(unnamed).toContain('$130.23')
  })

  it('shows the connected dot, or the eye when watch-only', () => {
    const connected = mountSelector()
    expect(
      connected.find('[data-test="address-selector-connected"]').exists(),
    ).toBe(true)
    expect(hasEye(connected)).toBe(false)

    const watchOnly = mountSelector({ connected: false })
    expect(
      watchOnly.find('[data-test="address-selector-connected"]').exists(),
    ).toBe(false)
    expect(hasEye(watchOnly)).toBe(true)
  })

  it('flips the chevron, drops the hover fill and reports aria-expanded while open', () => {
    const closed = button(mountSelector())
    expect(closed.attributes('aria-expanded')).toBe('false')
    expect(closed.find('.rotate-180').exists()).toBe(false)

    const open = button(mountSelector({ open: true }))
    expect(open.attributes('aria-expanded')).toBe('true')
    expect(open.find('.rotate-180').exists()).toBe(true)
    expect(open.classes()).not.toContain('hover:bg-background-default')
  })

  it('composes the accessible name from balance, account and connection', () => {
    expect(
      button(mountSelector({ name: 'Savings' })).attributes('aria-label'),
    ).toBe('$130.23, Savings, Connected')
    expect(
      button(mountSelector({ connected: false })).attributes('aria-label'),
    ).toBe('$130.23, 0x32Be...2D88, Watch only')
  })

  it('swaps the balance for a placeholder while loading, also for screen readers', () => {
    const wrapper = mountSelector({ loading: true, name: 'Savings' })
    expect(button(wrapper).attributes('aria-label')).toBe(
      'Loading, Savings, Connected',
    )
    expect(
      wrapper.find('[data-test="address-selector-loading"]').exists(),
    ).toBe(true)
    expect(wrapper.text()).not.toContain('$130.23')
  })

  it('shows the network and "No address" without an address', () => {
    const wrapper = mountSelector({ address: '' })
    expect(wrapper.findComponent(AppAvatar).exists()).toBe(false)
    expect(
      wrapper.get('[data-test="address-selector-no-address"]').text(),
    ).toBe('No address')
    expect(button(wrapper).attributes('aria-label')).toBe('No address')
  })

  it('passes clicks through', async () => {
    const wrapper = mountSelector()
    await button(wrapper).trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
