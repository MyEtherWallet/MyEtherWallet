import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'

const title = () => '[data-testid="cg-title"]'
const description = () => '[data-testid="cg-description"]'

describe('AppContentGroup', () => {
  it('renders title and description text', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'Balance', description: 'Total value' },
    })
    expect(wrapper.text()).toContain('Balance')
    expect(wrapper.text()).toContain('Total value')
  })

  it('omits the description block when no description is given', () => {
    const wrapper = mount(AppContentGroup, { props: { title: 'Only title' } })
    expect(wrapper.find(description()).exists()).toBe(false)
  })

  it('size "m" uses label/base (16) title and text/sm (14) description', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', size: 'm' },
    })
    expect(wrapper.get(title()).classes()).toContain('text-s-16')
    expect(wrapper.get(description()).classes()).toContain('text-s-14')
  })

  it('size "l" uses heading/base (20) title and text/base (16) description', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', size: 'l' },
    })
    expect(wrapper.get(title()).classes()).toContain('text-s-20')
    expect(wrapper.get(description()).classes()).toContain('text-s-16')
  })

  it('default weights: title emphasized, description regular', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', size: 'm' },
    })
    expect(wrapper.get(title()).classes()).toContain('font-medium')
    expect(wrapper.get(description()).classes()).toContain('font-normal')
  })

  it('inverted swaps weights: title regular, description semibold', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', inverted: true },
    })
    expect(wrapper.get(title()).classes()).toContain('font-normal')
    expect(wrapper.get(description()).classes()).toContain('font-semibold')
  })

  it('align "right" right-aligns both lines', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', align: 'right' },
    })
    expect(wrapper.get('[data-testid="cg-root"]').classes()).toContain(
      'text-right',
    )
  })

  it('title is single-line (truncates) by default; description wraps', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D' },
    })
    expect(wrapper.get(title()).classes()).toContain('truncate')
    expect(wrapper.get(description()).classes()).not.toContain('truncate')
  })

  it('noWrap makes the description single-line', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', noWrap: true },
    })
    expect(wrapper.get(description()).classes()).toContain('truncate')
  })

  it('loading replaces text with skeletons', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'Secret', description: 'Hidden', loading: true },
    })
    expect(wrapper.text()).not.toContain('Secret')
    expect(wrapper.text()).not.toContain('Hidden')
    expect(wrapper.html()).toContain('animate-pulse')
    expect(wrapper.find(title()).exists()).toBe(false)
  })

  it('renders title-icon and description-icon slots', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D' },
      slots: {
        'title-icon': '<svg data-testid="ti" />',
        'description-icon': '<svg data-testid="di" />',
      },
    })
    expect(wrapper.find('[data-testid="ti"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="di"]').exists()).toBe(true)
  })
})
