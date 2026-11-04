import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppScrollFade from '@/components/scroll_fade/AppScrollFade.vue'

const LABEL = { label: 'Scroll right' }
const root = '[data-testid="scroll-fade"]'

describe('AppScrollFade', () => {
  it('positions and sizes the fade per side (114 wide on x, 118 tall on y)', () => {
    const cases = [
      ['left', ['inset-y-0', 'left-0', 'w-[114px]'], 'bg-gradient-to-r'],
      ['right', ['inset-y-0', 'right-0', 'w-[114px]'], 'bg-gradient-to-l'],
      ['top', ['inset-x-0', 'top-0', 'h-[118px]'], 'bg-gradient-to-b'],
      ['bottom', ['inset-x-0', 'bottom-0', 'h-[118px]'], 'bg-gradient-to-t'],
    ] as const
    for (const [side, position, gradient] of cases) {
      const wrapper = mount(AppScrollFade, { props: { ...LABEL, side } })
      expect(wrapper.get(root).classes()).toEqual(
        expect.arrayContaining([
          'absolute',
          'pointer-events-none',
          ...position,
        ]),
      )
      expect(wrapper.get('[aria-hidden="true"]').classes()).toContain(gradient)
    }
  })

  it('fades from background/default on base and background/alternative on surface', () => {
    const gradient = (variant: 'base' | 'surface') =>
      mount(AppScrollFade, { props: { ...LABEL, side: 'right', variant } })
        .get('[aria-hidden="true"]')
        .classes()
    expect(gradient('base')).toEqual(
      expect.arrayContaining(['from-background-default', 'to-transparent']),
    )
    expect(gradient('surface')).toEqual(
      expect.arrayContaining(['from-background-alternative', 'to-transparent']),
    )
  })

  it('renders a labelled M button on a white fill with the button shadow', () => {
    const button = mount(AppScrollFade, {
      props: { ...LABEL, side: 'right' },
    }).get('button')
    expect(button.attributes('aria-label')).toBe('Scroll right')
    expect(button.attributes('aria-hidden')).toBeUndefined()
    expect(button.classes()).toEqual(
      expect.arrayContaining([
        'size-8',
        'pointer-events-auto',
        'bg-background-alternative',
        'shadow-button',
        'right-0',
      ]),
    )
  })

  it('emits click from the button', async () => {
    const wrapper = mount(AppScrollFade, { props: { ...LABEL, side: 'left' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('drops the button from the DOM when showButton is false', () => {
    const wrapper = mount(AppScrollFade, {
      props: { ...LABEL, side: 'top', showButton: false },
    })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })
})
