import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppChip from '@/components/chip/AppChip.vue'

const root = () => '[data-testid="chip"]'
const avatarSlot = () => '[data-testid="chip-avatar"]'
const icon = () => '[data-testid="chip-icon"]'

describe('AppChip', () => {
  it('renders the label', () => {
    const wrapper = mount(AppChip, { props: { label: 'ETH' } })
    expect(wrapper.text()).toContain('ETH')
  })

  it('renders as a button, forwards disabled and reflects selected in aria-pressed', () => {
    const wrapper = mount(AppChip, {
      props: { label: 'ETH', selected: true, disabled: true },
    })
    const el = wrapper.get(root()).element as HTMLButtonElement
    expect(el.tagName).toBe('BUTTON')
    expect(el.disabled).toBe(true)
    expect(el.getAttribute('aria-pressed')).toBe('true')
  })

  it('announces a menu chip as a menu button, not a toggle', () => {
    const wrapper = mount(AppChip, {
      props: { label: 'All networks', showIcon: true, selected: true },
    })
    const el = wrapper.get(root()).element
    expect(el.getAttribute('aria-haspopup')).toBe('menu')
    expect(el.hasAttribute('aria-pressed')).toBe(false)
  })

  it('fills white on the default surface and grey on the alternative surface', () => {
    const base = mount(AppChip, { props: { label: 'ETH', surface: 'default' } })
    expect(base.get(root()).classes()).toContain('bg-white')

    const surface = mount(AppChip, {
      props: { label: 'ETH', surface: 'alternative' },
    })
    expect(surface.get(root()).classes()).toContain('bg-bgBase')
  })

  it('outlines a selected chip and stays borderless otherwise', () => {
    const selected = mount(AppChip, { props: { label: 'ETH', selected: true } })
    expect(selected.get(root()).classes()).toContain('border-black')

    const resting = mount(AppChip, { props: { label: 'ETH' } })
    expect(resting.get(root()).classes()).toContain('border-transparent')
  })

  it('shows the trailing chevron only when showIcon is set', () => {
    const withIcon = mount(AppChip, { props: { label: 'ETH', showIcon: true } })
    expect(withIcon.find(icon()).exists()).toBe(true)

    const without = mount(AppChip, { props: { label: 'ETH' } })
    expect(without.find(icon()).exists()).toBe(false)
  })

  it('renders the avatar slot only when provided', () => {
    const withAvatar = mount(AppChip, {
      props: { label: 'ETH' },
      slots: { avatar: '<i data-testid="av" />' },
    })
    expect(withAvatar.find(avatarSlot()).exists()).toBe(true)
    expect(withAvatar.find('[data-testid="av"]').exists()).toBe(true)

    const noAvatar = mount(AppChip, { props: { label: 'ETH' } })
    expect(noAvatar.find(avatarSlot()).exists()).toBe(false)
  })

  it('emits click when pressed', async () => {
    const wrapper = mount(AppChip, { props: { label: 'ETH' } })
    await wrapper.get(root()).trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
