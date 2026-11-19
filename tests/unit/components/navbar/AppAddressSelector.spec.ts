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

const HIDDEN_BELOW_450 = '.max-\\[450px\\]\\:hidden'

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

  it('truncates names of 18+ characters to 17 and an ellipsis, keeping the full name', () => {
    const longName = 'My very long account name for the long weekend'
    const wrapper = mountSelector({ name: longName })
    const label = wrapper.get('[data-test="address-selector-label"]')
    expect(label.text()).toBe('My very long acco…')
    expect(label.attributes('title')).toBe(longName)
    expect(button(wrapper).attributes('aria-label')).toContain(longName)

    const atLimit = mountSelector({ name: '12345678901234567' }).get(
      '[data-test="address-selector-label"]',
    )
    expect(atLimit.text()).toBe('12345678901234567')
    expect(atLimit.attributes('title')).toBeUndefined()

    expect(
      mountSelector({ name: '123456789012345678' })
        .get('[data-test="address-selector-label"]')
        .text(),
    ).toBe('12345678901234567…')
  })

  it('never truncates the shortened address', () => {
    expect(
      mountSelector().get('[data-test="address-selector-label"]').text(),
    ).toBe('0x32Be...2D88')
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

  it('shows only the login email for a Google / email account', () => {
    const wrapper = mountSelector({ email: 'ada@example.com', name: 'Privy' })
    const email = wrapper.get('[data-test="address-selector-email"]')
    expect(email.text()).toBe('ada@example.com')
    // Figma: the email stands alone, without balance, name or connected dot.
    expect(wrapper.text()).not.toContain('$130.23')
    expect(wrapper.text()).not.toContain('Privy')
    expect(
      wrapper.find('[data-test="address-selector-connected"]').exists(),
    ).toBe(false)
    expect(wrapper.findComponent(AppAvatar).props('address')).toBe(ADDRESS)
  })

  it('keeps the email out of session replay: marked private, and in no attribute', () => {
    const address =
      'a.very.long.name.for.an.inbox@a-long-company-domain.example'
    const wrapper = mountSelector({ email: address })
    const email = wrapper.get('[data-test="address-selector-email"]')
    // The mark covers the text. Attributes are recorded whatever the mark
    // says, so the email may not be in a title, an aria-label or any other.
    expect(email.attributes('data-private')).toBeDefined()
    const pill = button(wrapper).element
    for (const el of [pill, ...pill.querySelectorAll('*')]) {
      for (const attribute of Array.from(el.attributes)) {
        expect(attribute.value).not.toContain(address)
        expect(attribute.value).not.toContain('a.very.long.name')
      }
    }
  })

  it('still names the pill for screen readers by the email and the connection', () => {
    const wrapper = mountSelector({ email: 'ada@example.com' })
    const pill = button(wrapper)
    // Named by the elements that hold the text, not by copying it.
    expect(pill.attributes('aria-label')).toBeUndefined()
    const name = pill
      .attributes('aria-labelledby')!
      .split(' ')
      .map(id => wrapper.get(`#${id}`).text())
    expect(name).toEqual(['ada@example.com', 'Connected'])
  })

  it('falls back to its usual name when there is an email but no address to show it for', () => {
    const pill = button(
      mountSelector({ email: 'ada@example.com', address: '' }),
    )
    expect(pill.attributes('aria-labelledby')).toBeUndefined()
    expect(pill.attributes('aria-label')).toBe('No address')
  })

  it('keeps a long email from stretching the navbar', () => {
    const email = mountSelector({
      email: 'a.very.long.name.for.an.inbox@a-long-company-domain.example',
    }).get('[data-test="address-selector-email"]')
    expect(email.classes()).toContain('truncate')
    expect(email.classes().some(c => c.startsWith('max-w-'))).toBe(true)
  })

  it('shows the email even while balances load', () => {
    const wrapper = mountSelector({ email: 'ada@example.com', loading: true })
    expect(wrapper.get('[data-test="address-selector-email"]').text()).toBe(
      'ada@example.com',
    )
    expect(
      wrapper.find('[data-test="address-selector-loading"]').exists(),
    ).toBe(false)
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

  it('below 450 keeps only the avatar, network and chevron; the name stays announced', () => {
    const wrapper = mountSelector({ balance: '$0.99' })
    expect(
      wrapper.get('[data-test="address-selector-text"]').classes(),
    ).toContain('max-[450px]:hidden')
    // Neither the kept parts nor anything around them hides at that width.
    const chevron = wrapper
      .findAllComponents(AppIcon)
      .find(icon => icon.props('name') === 'chevron-down')!
    for (const kept of [
      wrapper.getComponent(AppAvatar),
      wrapper.get('img[src="eth.svg"]'),
      chevron,
    ])
      expect(kept.element.closest(HIDDEN_BELOW_450)).toBeNull()
    expect(button(wrapper).attributes('aria-label')).toContain('$0.99')
  })

  it('below 450 swaps "No address" for the network icon, keeping it when there is none', () => {
    const label = (props: Record<string, unknown> = {}) =>
      mountSelector({ address: '', ...props }).get(
        '[data-test="address-selector-no-address"]',
      )
    expect(label().classes()).toContain('max-[450px]:hidden')
    // Without the icon the label is all the pill has besides the chevron.
    expect(
      label({ networkIcon: undefined }).element.closest(HIDDEN_BELOW_450),
    ).toBeNull()
  })

  it('passes clicks through', async () => {
    const wrapper = mountSelector()
    await button(wrapper).trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
