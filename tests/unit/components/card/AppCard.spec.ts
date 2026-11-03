import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import AppCard from '@/components/card/AppCard.vue'

const root = '[data-testid="card"]'
const hit = '[data-testid="card-hit"]'
const header = '[data-testid="card-header"]'
const avatarSkeleton = '[data-testid="card-avatar-skeleton"]'
const buttons = '[data-testid="card-buttons"]'

describe('AppCard', () => {
  it('renders a plain div with no hit area when not interactive', () => {
    const wrapper = mount(AppCard, { props: { title: 'Ethereum' } })
    expect(wrapper.get(root).element.tagName).toBe('DIV')
    expect(wrapper.find(hit).exists()).toBe(false)
    expect(wrapper.text()).toContain('Ethereum')
  })

  it('maps each surface to its fill token', () => {
    const def = mount(AppCard, { props: { title: 'T' } })
    expect(def.get(root).classes()).toContain('bg-background-alternative')

    const alt = mount(AppCard, {
      props: { title: 'T', surface: 'alternative' },
    })
    expect(alt.get(root).classes()).toContain('bg-background-default')
  })

  it('emits click from the hit button only, named after the title', async () => {
    const wrapper = mount(AppCard, {
      props: { title: 'Ethereum', interactive: true },
      slots: { action: '<button data-testid="act">x</button>' },
    })
    const btn = wrapper.get(hit)
    expect(btn.element.tagName).toBe('BUTTON')
    expect(btn.attributes('type')).toBe('button')
    expect(btn.attributes('aria-label')).toBe('Ethereum')

    await wrapper.get(root).trigger('click')
    await wrapper.get('[data-testid="act"]').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()

    await btn.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('prefers label over title for the hit button name', () => {
    const wrapper = mount(AppCard, {
      props: { interactive: true, label: 'Stocks' },
    })
    expect(wrapper.get(hit).attributes('aria-label')).toBe('Stocks')
  })

  it('exposes aria-pressed only when selected is bound', () => {
    const plain = mount(AppCard, { props: { title: 'T', interactive: true } })
    expect(plain.get(hit).attributes('aria-pressed')).toBeUndefined()

    const off = mount(AppCard, {
      props: { title: 'T', interactive: true, selected: false },
    })
    expect(off.get(hit).attributes('aria-pressed')).toBe('false')

    const on = mount(AppCard, {
      props: { title: 'T', interactive: true, selected: true },
    })
    expect(on.get(hit).attributes('aria-pressed')).toBe('true')
    expect(on.get(hit).classes()).toContain('ring-border-selected')
  })

  it('loading disables the hit area and swaps avatar + text for skeletons', () => {
    const wrapper = mount(AppCard, {
      props: { title: 'T', description: 'D', interactive: true, loading: true },
      slots: {
        avatar: '<i data-testid="av" />',
        action: '<i data-testid="act" />',
        buttons: '<i data-testid="btn" />',
      },
    })
    expect((wrapper.get(hit).element as HTMLButtonElement).disabled).toBe(true)
    expect(wrapper.get(root).attributes('aria-busy')).toBe('true')
    expect(wrapper.find(avatarSkeleton).exists()).toBe(true)
    expect(wrapper.find('[data-testid="av"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="cg-title"]').exists()).toBe(false)
    // Figma keeps the actions visible while loading.
    expect(wrapper.find('[data-testid="act"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn"]').exists()).toBe(true)
  })

  it('disabled blocks the hit area and dims the card', () => {
    const wrapper = mount(AppCard, {
      props: { title: 'T', interactive: true, disabled: true },
    })
    expect((wrapper.get(hit).element as HTMLButtonElement).disabled).toBe(true)
    expect(wrapper.get(root).classes()).toContain('opacity-40')
  })

  it('passes the 32px avatar size to the avatar slot', () => {
    const wrapper = mount(AppCard, {
      props: { title: 'T' },
      slots: {
        avatar: (p: { size: string }) => h('i', { 'data-size': p.size }),
      },
    })
    expect(wrapper.get('[data-size]').attributes('data-size')).toBe('m')
  })

  it('omits the header without title, avatar or action', () => {
    const wrapper = mount(AppCard, { slots: { default: '<p>body</p>' } })
    expect(wrapper.find(header).exists()).toBe(false)
    expect(wrapper.text()).toBe('body')

    const actionOnly = mount(AppCard, { slots: { action: '<i />' } })
    expect(actionOnly.find(header).exists()).toBe(true)
  })

  it('renders the button group only when the buttons slot is used', () => {
    const none = mount(AppCard, { props: { title: 'T' } })
    expect(none.find(buttons).exists()).toBe(false)

    const some = mount(AppCard, {
      props: { title: 'T' },
      slots: { buttons: '<button>Go</button>' },
    })
    expect(some.get(buttons).text()).toBe('Go')
  })
})
