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

  it('treats an empty-string description as absent', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'Only title', description: '' },
    })
    expect(wrapper.find(description()).exists()).toBe(false)
  })

  it('colours text for the surface via tone', () => {
    const light = mount(AppContentGroup, {
      props: { title: 'T', description: 'D' },
    })
    expect(light.get(title()).classes()).toContain('text-text-default')
    expect(light.get(description()).classes()).toContain('text-text-subtle')

    const dark = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', tone: 'inverse' },
    })
    expect(dark.get(title()).classes()).toContain('text-white')
    expect(dark.get(title()).classes()).not.toContain('text-text-default')
    expect(dark.get(description()).classes()).toContain('text-white/70')
  })

  it('size "m" uses label/base title and text/sm description', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', size: 'm' },
    })
    expect(wrapper.get(title()).classes()).toContain('text-label-base')
    expect(wrapper.get(description()).classes()).toContain('text-text-sm')
  })

  it('size "l" uses heading/base title and text/base description', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', size: 'l' },
    })
    expect(wrapper.get(title()).classes()).toContain('text-heading-base')
    expect(wrapper.get(description()).classes()).toContain('text-text-base')
  })

  it('takes weights from the typography tokens, never a font-* override', () => {
    for (const size of ['m', 'l'] as const) {
      for (const inverted of [false, true]) {
        const wrapper = mount(AppContentGroup, {
          props: { title: 'T', description: 'D', size, inverted },
        })
        const classes = [
          ...wrapper.get(title()).classes(),
          ...wrapper.get(description()).classes(),
        ]
        expect(classes.filter(c => c.startsWith('font-'))).toEqual([])
      }
    }
  })

  it('inverted swaps the two line styles (typography and colour)', () => {
    const m = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', inverted: true },
    })
    expect(m.get(title()).classes()).toEqual(
      expect.arrayContaining(['text-text-sm', 'text-text-subtle']),
    )
    expect(m.get(description()).classes()).toEqual(
      expect.arrayContaining(['text-label-base', 'text-text-default']),
    )

    const l = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', size: 'l', inverted: true },
    })
    expect(l.get(title()).classes()).toContain('text-text-base')
    expect(l.get(description()).classes()).toContain('text-heading-base')
  })

  it('size "m" stacks the lines with no gap; "l" with a 4px gap', () => {
    for (const loading of [false, true]) {
      const m = mount(AppContentGroup, {
        props: { title: 'T', description: 'D', loading },
      })
      expect(m.get('[data-testid="cg-root"]').classes()).not.toContain('gap-1')

      const l = mount(AppContentGroup, {
        props: { title: 'T', description: 'D', size: 'l', loading },
      })
      expect(l.get('[data-testid="cg-root"]').classes()).toContain('gap-1')
    }
  })

  it('align "right" right-aligns both lines', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D', align: 'right' },
    })
    const rootClasses = wrapper.get('[data-testid="cg-root"]').classes()
    expect(rootClasses).toContain('text-right')
    // Aligning via items-start/end would shrink the rows to content width and
    // break the title ellipsis — rows must stay full-width. Guard against it.
    expect(rootClasses).not.toContain('items-end')
    expect(rootClasses).not.toContain('items-start')
  })

  it('title is single-line (truncates) by default; description wraps', () => {
    const wrapper = mount(AppContentGroup, {
      props: { title: 'T', description: 'D' },
    })
    expect(wrapper.get(title()).classes()).toContain('truncate')
    // min-w-0 lets the flex item shrink so the ellipsis actually clips.
    expect(wrapper.get(title()).classes()).toContain('min-w-0')
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
    expect(wrapper.html()).toContain('bg-background-skeleton')
    expect(wrapper.find(title()).exists()).toBe(false)
  })

  it('renders the icon/avatar slots after the text (trailing only)', () => {
    for (const align of ['left', 'right'] as const) {
      const wrapper = mount(AppContentGroup, {
        props: { title: 'T', description: 'D', align },
        slots: {
          'title-icon': '<svg data-testid="ti" />',
          'description-icon': '<svg data-testid="di" />',
        },
      })
      const titleRow = wrapper.get(title()).element.parentElement!
      const descriptionRow = wrapper.get(description()).element.parentElement!
      expect(titleRow.firstElementChild).toBe(wrapper.get(title()).element)
      expect(
        titleRow.lastElementChild!.querySelector('[data-testid="ti"]'),
      ).not.toBeNull()
      expect(descriptionRow.firstElementChild).toBe(
        wrapper.get(description()).element,
      )
      expect(
        descriptionRow.lastElementChild!.querySelector('[data-testid="di"]'),
      ).not.toBeNull()
    }
  })
})
