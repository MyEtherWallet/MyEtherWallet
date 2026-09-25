import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppIcon from '@/components/icon/AppIcon.vue'
import { icons, ICON_NAMES } from '@/components/icon/icons'

const svg = (w: ReturnType<typeof mount>) => w.get('svg')

describe('AppIcon', () => {
  it('renders the named glyph as an svg', () => {
    const wrapper = mount(AppIcon, { props: { name: 'wallet' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('defaults to size m (size-6) and applies the size class per prop', () => {
    expect(
      svg(mount(AppIcon, { props: { name: 'wallet' } })).classes(),
    ).toContain('size-6')
    expect(
      svg(mount(AppIcon, { props: { name: 'wallet', size: 'l' } })).classes(),
    ).toContain('size-8')
    expect(
      svg(mount(AppIcon, { props: { name: 'wallet', size: 'xxs' } })).classes(),
    ).toContain('size-4')
  })

  it('is decorative by default: aria-hidden, no role', () => {
    const el = svg(mount(AppIcon, { props: { name: 'wallet' } })).element
    expect(el.getAttribute('aria-hidden')).toBe('true')
    expect(el.hasAttribute('role')).toBe(false)
  })

  it('exposes an accessible name via a role="img" wrapper, svg stays hidden', () => {
    const wrapper = mount(AppIcon, {
      props: { name: 'wallet', label: 'Wallet' },
    })
    const named = wrapper.get('[role="img"]').element
    expect(named.getAttribute('aria-label')).toBe('Wallet')
    // the glyph itself is hidden from AT so it isn't announced twice
    expect(svg(wrapper).element.getAttribute('aria-hidden')).toBe('true')
  })

  it('falls back to the available variant when the requested one is missing', () => {
    // perpetuals ships filled only — a stroke request must still render.
    expect(
      mount(AppIcon, { props: { name: 'perpetuals', variant: 'stroke' } })
        .find('svg')
        .exists(),
    ).toBe(true)
    // at-symbol ships stroke only — a filled request must still render.
    expect(
      mount(AppIcon, { props: { name: 'at-symbol', variant: 'filled' } })
        .find('svg')
        .exists(),
    ).toBe(true)
  })

  it('renders a custom (non-Heroicons) glyph', () => {
    expect(
      mount(AppIcon, { props: { name: 'copy' } })
        .find('svg')
        .exists(),
    ).toBe(true)
    expect(
      mount(AppIcon, { props: { name: 'watch-only' } })
        .find('svg')
        .exists(),
    ).toBe(true)
  })

  it('registers the full 156-icon inventory, each with at least one variant', () => {
    expect(ICON_NAMES).toHaveLength(156)
    for (const name of ICON_NAMES) {
      const entry = icons[name]
      expect(entry.stroke ?? entry.filled).toBeTruthy()
    }
  })
})
