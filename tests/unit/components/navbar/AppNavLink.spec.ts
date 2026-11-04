import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import AppNavLink from '@/components/navbar/AppNavLink.vue'

const Blank = defineComponent({ template: '<div />' })

let router: Router

beforeEach(async () => {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Blank },
      {
        path: '/stocks',
        name: 'stocks',
        component: Blank,
        children: [{ path: ':id', name: 'stock', component: Blank }],
      },
    ],
  })
  await router.push('/stocks/aapl')
  await router.isReady()
})

const mountLink = (props: Record<string, unknown> = {}, attrs = {}) =>
  mount(AppNavLink, {
    props: { label: 'Stocks', ...props },
    attrs,
    global: { plugins: [router] },
  })

const link = (wrapper: ReturnType<typeof mountLink>) =>
  wrapper.get('[data-testid="nav-link"]')

describe('AppNavLink — design-library NavLink (MEW-2461)', () => {
  it('renders a router link with `to` and a type="button" without it', () => {
    const anchor = link(mountLink({ to: '/' }))
    expect(anchor.element.tagName).toBe('A')
    expect(anchor.attributes('href')).toBe('/')

    const button = link(mountLink())
    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('type')).toBe('button')
  })

  it('applies the Figma box: 32 tall pill, label/sm, label px-1', () => {
    const wrapper = mountLink()
    expect(link(wrapper).classes()).toEqual(
      expect.arrayContaining([
        'rounded-16',
        'px-2',
        'py-1.5',
        'text-label-sm',
        'text-text-default',
      ]),
    )
    expect(wrapper.get('span').classes()).toContain('px-1')
    expect(wrapper.text()).toBe('Stocks')
  })

  it('is selected while its route is active, including nested routes', () => {
    const active = link(mountLink({ to: '/stocks' }))
    expect(active.classes()).toContain('bg-background-default-hover')
    expect(active.classes()).not.toContain(
      'hover:bg-background-alternative-hover',
    )
    // An ancestor section is selected but is not the current page.
    expect(active.attributes('aria-current')).toBeUndefined()

    const inactive = link(mountLink({ to: '/' }))
    expect(inactive.classes()).toContain(
      'hover:bg-background-alternative-hover',
    )
    expect(inactive.classes()).not.toContain('bg-background-default-hover')
    expect(inactive.attributes('aria-current')).toBeUndefined()
  })

  it('marks only the exact current page with aria-current', () => {
    expect(
      link(mountLink({ to: '/stocks/aapl' })).attributes('aria-current'),
    ).toBe('page')
    expect(
      link(mountLink({ to: '/', selected: true })).attributes('aria-current'),
    ).toBeUndefined()
    expect(
      link(mountLink({ selected: true })).attributes('aria-current'),
    ).toBeUndefined()
  })

  it('matches the route exactly with `exact`', () => {
    const anchor = link(mountLink({ to: '/stocks', exact: true }))
    expect(anchor.classes()).not.toContain('bg-background-default-hover')
  })

  it('lets an explicit `selected` override the route match', () => {
    expect(
      link(mountLink({ to: '/stocks', selected: false })).classes(),
    ).not.toContain('bg-background-default-hover')
    expect(link(mountLink({ to: '/', selected: true })).classes()).toContain(
      'bg-background-default-hover',
    )
    expect(link(mountLink({ selected: true })).classes()).toContain(
      'bg-background-default-hover',
    )
  })

  it('shows the filled chevron and menu semantics only with `dropdown`', () => {
    const plain = mountLink()
    expect(plain.find('svg').exists()).toBe(false)
    expect(link(plain).attributes('aria-haspopup')).toBeUndefined()
    expect(link(plain).attributes('aria-expanded')).toBeUndefined()

    const trigger = mountLink({ dropdown: true, expanded: true })
    expect(trigger.get('svg').classes()).toContain('size-5')
    expect(link(trigger).attributes('aria-haspopup')).toBe('menu')
    expect(link(trigger).attributes('aria-expanded')).toBe('true')
  })

  it('navigates on click', async () => {
    const wrapper = mountLink({ to: '/' })
    await link(wrapper).trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('passes attrs and listeners through to the item', async () => {
    let clicks = 0
    const wrapper = mountLink(
      { dropdown: true },
      { 'data-test': 'more', onClick: () => clicks++ },
    )
    expect(link(wrapper).attributes('data-test')).toBe('more')
    await link(wrapper).trigger('click')
    expect(clicks).toBe(1)
  })
})
