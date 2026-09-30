import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTag from '@/components/tag/AppTag.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { TAG_CLASSES, TAG_TYPES, TAG_VARIANTS } from '@/components/tag/types'

describe('AppTag', () => {
  it('renders a non-interactive span with the label', () => {
    const wrapper = mount(AppTag, { props: { label: 'Completed' } })
    const el = wrapper.element as HTMLElement
    expect(el.tagName).toBe('SPAN')
    expect(el.hasAttribute('tabindex')).toBe(false)
    expect(el.hasAttribute('role')).toBe(false)
    expect(wrapper.text()).toBe('Completed')
  })

  it('defaults to neutral strong', () => {
    const wrapper = mount(AppTag, { props: { label: 'Tag' } })
    for (const cls of TAG_CLASSES.neutral.strong.split(' ')) {
      expect(wrapper.classes()).toContain(cls)
    }
  })

  for (const type of TAG_TYPES) {
    for (const variant of TAG_VARIANTS) {
      it(`applies the ${type} × ${variant} classes`, () => {
        const wrapper = mount(AppTag, { props: { label: 'Tag', type, variant } })
        for (const cls of TAG_CLASSES[type][variant].split(' ')) {
          expect(wrapper.classes()).toContain(cls)
        }
      })
    }
  }

  it('renders 18px icons only for the icon props that are set', () => {
    const none = mount(AppTag, { props: { label: 'Tag' } })
    expect(none.findAllComponents(AppIcon)).toHaveLength(0)

    const both = mount(AppTag, {
      props: { label: 'Tag', leadingIcon: 'check', trailingIcon: 'x-mark' },
    })
    const icons = both.findAllComponents(AppIcon)
    expect(icons.map((i) => i.props('name'))).toEqual(['check', 'x-mark'])
    expect(icons.every((i) => i.props('size') === 'xs')).toBe(true)

    const trailingOnly = mount(AppTag, {
      props: { label: 'Tag', trailingIcon: 'x-mark' },
    })
    expect(
      trailingOnly.findAllComponents(AppIcon).map((i) => i.props('name')),
    ).toEqual(['x-mark'])
  })

  it('lets the leading/trailing slots and default slot override the props', () => {
    const wrapper = mount(AppTag, {
      props: { label: 'Tag', leadingIcon: 'check', trailingIcon: 'x-mark' },
      slots: {
        leading: '<i data-testid="lead" />',
        trailing: '<i data-testid="trail" />',
        default: 'Slotted',
      },
    })
    expect(wrapper.findAllComponents(AppIcon)).toHaveLength(0)
    expect(wrapper.find('[data-testid="lead"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trail"]').exists()).toBe(true)
    expect(wrapper.text()).toBe('Slotted')
  })

  it('falls attrs through to the root span', () => {
    const wrapper = mount(AppTag, {
      props: { label: 'Tag' },
      attrs: { title: 'Full status', 'data-testid': 'status-tag' },
    })
    expect(wrapper.attributes('title')).toBe('Full status')
    expect(wrapper.attributes('data-testid')).toBe('status-tag')
  })
})
