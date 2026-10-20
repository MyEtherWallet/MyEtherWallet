import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppNavbar from '@/components/navbar/AppNavbar.vue'
import { ROUTES_MAIN } from '@/router/routeNames'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      home: 'Home',
      connect_wallet: 'Connect wallet',
      menu: { 'open-menu': 'Open Menu', main: 'Main' },
      common: {
        create_wallet: 'Create wallet',
        create_wallet_short: 'Create',
        connect_wallet_short: 'Connect',
      },
    },
  },
})

const ripple = { mounted: () => {}, updated: () => {} }

const mountNavbar = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) =>
  mount(AppNavbar, {
    props: { walletSaved: false, ...props },
    slots,
    global: {
      plugins: [i18n],
      directives: { ripple },
      stubs: { RouterLink: RouterLinkStub },
    },
  })

const menuButton = (wrapper: ReturnType<typeof mountNavbar>) =>
  wrapper.get('button[aria-label="Open Menu"]')

describe('AppNavbar', () => {
  it('renders a header landmark with a labelled nav holding the links slot', () => {
    const wrapper = mountNavbar({}, { links: '<a id="link">Stocks</a>' })
    expect(wrapper.element.tagName).toBe('HEADER')
    const nav = wrapper.get('nav')
    expect(nav.attributes('aria-label')).toBe('Main')
    expect(nav.find('#link').exists()).toBe(true)
    // Links live in the drawer below 1280.
    expect(nav.classes()).toEqual(expect.arrayContaining(['hidden', 'xl:flex']))
  })

  it('links the logo home: wordmark on desktop, mark on compact', () => {
    const wrapper = mountNavbar()
    expect(wrapper.getComponent(RouterLinkStub).props('to')).toEqual({
      name: ROUTES_MAIN.HOME.NAME,
    })
    const [wordmark, mark] = wrapper.findAll('img')
    expect(wordmark.classes()).toEqual(
      expect.arrayContaining(['hidden', 'xl:block', 'h-12']),
    )
    expect(mark.classes()).toEqual(
      expect.arrayContaining(['size-10', 'xl:hidden']),
    )
  })

  it('shows the hamburger on compact only, mirrors menuOpen and emits toggle-menu', async () => {
    const wrapper = mountNavbar({ menuOpen: true })
    const btn = menuButton(wrapper)
    expect(btn.classes()).toContain('xl:hidden')
    expect(btn.attributes('aria-expanded')).toBe('true')
    await btn.trigger('click')
    expect(wrapper.emitted('toggle-menu')).toHaveLength(1)

    await wrapper.setProps({ menuOpen: false })
    expect(menuButton(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('without a saved wallet shows Create (desktop only) + Connect and emits each', async () => {
    const wrapper = mountNavbar({}, { wallet: '<div id="wallet" />' })
    expect(wrapper.find('#wallet').exists()).toBe(false)
    const [create, connect] = wrapper
      .findAll('button')
      .filter(b => b.text().includes('Create') || b.text().includes('Connect'))
    expect(create.classes()).toEqual(
      expect.arrayContaining(['hidden', 'xl:inline-flex']),
    )
    expect(connect.classes()).not.toContain('hidden')
    await create.trigger('click')
    await connect.trigger('click')
    expect(wrapper.emitted('create-wallet')).toHaveLength(1)
    expect(wrapper.emitted('connect-wallet')).toHaveLength(1)
  })

  it('shortens the wallet CTAs only in the tight 1280-1440 band', () => {
    const create = mountNavbar()
      .findAll('button')
      .find(b => b.text().includes('Create'))!
    const [full, short] = create.findAll('span span')
    expect(full.text()).toBe('Create wallet')
    expect(full.classes()).toContain('xl:max-2xl:hidden')
    expect(short.text()).toBe('Create')
    expect(short.classes()).toEqual(
      expect.arrayContaining(['hidden', 'xl:max-2xl:inline']),
    )
  })

  it('with a saved wallet renders the wallet slot instead of the CTAs', () => {
    const wrapper = mountNavbar(
      { walletSaved: true },
      { wallet: '<div id="wallet" />' },
    )
    expect(wrapper.find('#wallet').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Connect')
  })

  it('renders the search and actions slots', () => {
    const wrapper = mountNavbar(
      {},
      { search: '<div id="search" />', actions: '<div id="actions" />' },
    )
    expect(wrapper.find('#search').exists()).toBe(true)
    expect(wrapper.find('#actions').exists()).toBe(true)
  })

  it('shows the bottom border only once the page is scrolled', async () => {
    const wrapper = mountNavbar()
    expect(wrapper.classes()).toContain('border-transparent')
    await wrapper.setProps({ scrolled: true })
    expect(wrapper.classes()).toContain('border-border-default')
    expect(wrapper.classes()).not.toContain('border-transparent')
  })

  it('uses the Figma geometry: 76 high, full width, 16/20 gutter, 8/16 right gap', () => {
    const wrapper = mountNavbar()
    // The 1px scrolled border is inside the 76 (border-box on the header).
    expect(wrapper.classes()).toContain('h-19')
    const bar = wrapper.get('header > div')
    expect(bar.classes()).toEqual(
      expect.arrayContaining(['h-full', 'w-full', 'px-4', 'sm:px-5']),
    )
    expect(bar.classes()).not.toContain('max-w-360')
    const right = bar.findAll(':scope > div')[1]
    expect(right.classes()).toEqual(
      expect.arrayContaining(['gap-2', 'sm:gap-4']),
    )
  })
})
