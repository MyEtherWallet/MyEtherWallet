import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import AppPicker from '@/components/picker/AppPicker.vue'

const root = () => '[data-testid="picker"]'
const avatarSlot = () => '[data-testid="picker-avatar"]'
const chevron = () => '[data-testid="picker-chevron"]'
const description = () => '[data-testid="cg-description"]'

describe('AppPicker', () => {
  it('renders the title and the trailing chevron', () => {
    const wrapper = mount(AppPicker, { props: { title: 'Ethereum' } })
    expect(wrapper.text()).toContain('Ethereum')
    expect(wrapper.get(chevron()).classes()).toContain('text-icon-subtle')
  })

  it('renders a dialog-trigger button with a 1px inset brand focus ring', () => {
    const el = mount(AppPicker, { props: { title: 'T' } }).get(root())
    expect(el.attributes('type')).toBe('button')
    expect(el.attributes('aria-haspopup')).toBe('dialog')
    expect(el.classes()).toEqual(
      expect.arrayContaining([
        'focus-visible:ring-1',
        'focus-visible:ring-inset',
        'focus-visible:ring-border-brand',
      ]),
    )
    expect(el.classes()).not.toContain('border')
  })

  it('lets a fallthrough click and attrs reach the button, except when disabled or loading', async () => {
    const clicks = (props: Record<string, unknown>) => {
      let n = 0
      const wrapper = mount(AppPicker, {
        props: { title: 'T', ...props },
        attrs: { onClick: () => n++, 'aria-describedby': 'hint' },
      })
      return { wrapper, count: () => n }
    }

    const enabled = clicks({})
    expect(enabled.wrapper.get(root()).attributes('aria-describedby')).toBe(
      'hint',
    )
    await enabled.wrapper.get(root()).trigger('click')
    expect(enabled.count()).toBe(1)

    for (const state of [{ disabled: true }, { loading: true }]) {
      const blocked = clicks(state)
      await blocked.wrapper.get(root()).trigger('click')
      expect(blocked.count()).toBe(0)
    }
  })

  it('renders as a button and forwards disabled', () => {
    const wrapper = mount(AppPicker, {
      props: { title: 'T', disabled: true },
    })
    const el = wrapper.get(root()).element as HTMLButtonElement
    expect(el.tagName).toBe('BUTTON')
    expect(el.disabled).toBe(true)
    expect(wrapper.get(root()).classes()).toContain('opacity-40')
  })

  it('mirrors the modal state through aria-expanded only when bound', () => {
    const unbound = mount(AppPicker, { props: { title: 'T' } })
    expect(unbound.get(root()).attributes('aria-expanded')).toBeUndefined()

    const open = mount(AppPicker, { props: { title: 'T', expanded: true } })
    expect(open.get(root()).attributes('aria-expanded')).toBe('true')

    const closed = mount(AppPicker, { props: { title: 'T', expanded: false } })
    expect(closed.get(root()).attributes('aria-expanded')).toBe('false')
  })

  it('shows the description only at size L', () => {
    const atL = mount(AppPicker, {
      props: { title: 'T', description: 'Secured by PoS', size: 'l' },
    })
    expect(atL.find(description()).exists()).toBe(true)

    const atM = mount(AppPicker, {
      props: { title: 'T', description: 'Secured by PoS', size: 'm' },
    })
    expect(atM.find(description()).exists()).toBe(false)

    const atS = mount(AppPicker, {
      props: { title: 'T', description: 'Secured by PoS', size: 's' },
    })
    expect(atS.find(description()).exists()).toBe(false)
  })

  it('toggles the avatar slot region with the avatar prop', () => {
    const shown = mount(AppPicker, {
      props: { title: 'T', avatar: true },
      slots: { avatar: '<i data-testid="av" />' },
    })
    expect(shown.find(avatarSlot()).exists()).toBe(true)
    expect(shown.find('[data-testid="av"]').exists()).toBe(true)

    const hidden = mount(AppPicker, {
      props: { title: 'T', avatar: false },
      slots: { avatar: '<i data-testid="av" />' },
    })
    expect(hidden.find(avatarSlot()).exists()).toBe(false)
  })

  it('exposes the per-size avatar size to the slot (L→m, M/S→s)', () => {
    const sizeFor = (size: 's' | 'm' | 'l') =>
      mount(AppPicker, {
        props: { title: 'T', size },
        slots: {
          avatar: props =>
            h('i', { 'data-testid': 'av', 'data-size': props.size }),
        },
      })
        .get('[data-testid="av"]')
        .attributes('data-size')

    expect(sizeFor('l')).toBe('m')
    expect(sizeFor('m')).toBe('s')
    expect(sizeFor('s')).toBe('s')
  })

  it('applies the size geometry (L=64/rounded-16, S=pill)', () => {
    const l = mount(AppPicker, { props: { title: 'T', size: 'l' } })
    expect(l.get(root()).classes()).toEqual(
      expect.arrayContaining(['h-16', 'rounded-16', 'w-full']),
    )

    const s = mount(AppPicker, { props: { title: 'T', size: 's' } })
    expect(s.get(root()).classes()).toEqual(
      expect.arrayContaining(['h-8', 'rounded-full', 'inline-flex']),
    )
  })

  it('fills white on the default style and grey on the alternative style', () => {
    const def = mount(AppPicker, { props: { title: 'T', surface: 'default' } })
    expect(def.get(root()).classes()).toEqual(
      expect.arrayContaining([
        'bg-background-alternative',
        'hover:bg-background-alternative-hover',
      ]),
    )

    const alt = mount(AppPicker, {
      props: { title: 'T', surface: 'alternative' },
    })
    expect(alt.get(root()).classes()).toContain('bg-background-default')
  })

  it('shows the Content Group skeleton and blocks mouse + keyboard while loading', () => {
    const wrapper = mount(AppPicker, {
      props: { title: 'Ethereum', loading: true },
    })
    const root = wrapper.get('[data-testid="picker"]')
    expect(root.attributes('aria-busy')).toBe('true')
    // Native disabled is what stops Enter/Space too; loading isn't dimmed.
    expect((root.element as HTMLButtonElement).disabled).toBe(true)
    expect(root.classes()).not.toContain('opacity-40')
    expect(wrapper.find('[data-testid="cg-title"]').exists()).toBe(false)
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })
})
