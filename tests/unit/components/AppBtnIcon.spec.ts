import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBtnIcon from '@/components/AppBtnIcon.vue'

const LABEL = { label: 'Close' }

describe('AppBtnIcon', () => {
  it('renders a type="button" with the required aria-label', () => {
    const el = mount(AppBtnIcon, { props: { ...LABEL, icon: 'x-mark' } }).get(
      'button',
    ).element
    expect(el.getAttribute('type')).toBe('button')
    expect(el.getAttribute('aria-label')).toBe('Close')
  })

  it('sizes the box and the glyph together per size (S 22/16, M 32/24, L 40/32)', () => {
    const cases = [
      ['s', 'size-[22px]', 'size-4'],
      ['m', 'size-8', 'size-6'],
      ['l', 'size-10', 'size-8'],
    ] as const
    for (const [size, box, glyph] of cases) {
      const wrapper = mount(AppBtnIcon, {
        props: { ...LABEL, icon: 'x-mark', size },
      })
      expect(wrapper.get('button').classes()).toContain(box)
      expect(wrapper.get('svg').classes()).toContain(glyph)
    }
  })

  it('defaults to naked + m', () => {
    const btn = mount(AppBtnIcon, { props: { ...LABEL, icon: 'x-mark' } }).get(
      'button',
    )
    expect(btn.classes()).toContain('size-8')
    expect(btn.classes()).toContain(
      'not-disabled:hover:bg-background-alternative-hover',
    )
  })

  it('applies each variant fill', () => {
    const cls = (variant: string) =>
      mount(AppBtnIcon, {
        props: { ...LABEL, icon: 'x-mark', variant: variant as never },
      })
        .get('button')
        .classes()
    expect(cls('filled')).toContain('bg-background-default')
    expect(cls('filled-contrast')).toContain('bg-background-contrast-default')
    expect(cls('filled-contrast')).toContain('text-icon-inverted')
    expect(cls('naked-contrast')).toContain('text-icon-inverted')
    expect(cls('naked-contrast')).toContain(
      'not-disabled:hover:bg-background-contrast-hover',
    )
  })

  it('passes the icon variant through to the glyph', () => {
    const stroke = mount(AppBtnIcon, { props: { ...LABEL, icon: 'star' } })
    const filled = mount(AppBtnIcon, {
      props: { ...LABEL, icon: 'star', iconVariant: 'filled' },
    })
    expect(stroke.html()).not.toBe(filled.html())
  })

  it('disabled sets the native attribute and swallows clicks', async () => {
    const onClick = vi.fn()
    const wrapper = mount(AppBtnIcon, {
      props: { ...LABEL, icon: 'x-mark', disabled: true },
      attrs: { onClick },
    })
    expect(wrapper.get('button').element.disabled).toBe(true)
    await wrapper.get('button').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('forwards click as a native listener when enabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(AppBtnIcon, {
      props: { ...LABEL, icon: 'x-mark' },
      attrs: { onClick },
    })
    await wrapper.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders the default slot when no icon is given', () => {
    const wrapper = mount(AppBtnIcon, {
      props: LABEL,
      slots: { default: '<img data-testid="custom" />' },
    })
    expect(wrapper.find('[data-testid="custom"]').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('renders a safe external link when href is set', () => {
    const el = mount(AppBtnIcon, {
      props: { ...LABEL, icon: 'x-mark', href: 'https://etherscan.io' },
    }).get('a').element
    expect(el.getAttribute('href')).toBe('https://etherscan.io')
    expect(el.getAttribute('target')).toBe('_blank')
    expect(el.getAttribute('rel')).toBe('noopener noreferrer')
    expect(el.hasAttribute('type')).toBe(false)
    expect(el.hasAttribute('disabled')).toBe(false)
  })
})
