import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBtnGroup from '@/components/AppBtnGroup.vue'

const mountIt = (
  props = {},
  slot = '<button>A</button><button>B</button>',
  attrs = {},
) =>
  mount(AppBtnGroup, {
    props,
    attrs,
    slots: { default: slot },
  })

describe('AppBtnGroup', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('lays out horizontally by default, splitting the row evenly', () => {
    const cls = mountIt().classes()
    expect(cls).toContain('justify-end')
    expect(cls).toContain('items-start')
    expect(cls).toContain('[&>*]:flex-1')
    expect(cls).toContain('[&>*]:min-w-0')
    expect(cls).not.toContain('flex-col')
  })

  it('stacks full-width when vertical', () => {
    const cls = mountIt({ orientation: 'vertical' }).classes()
    expect(cls).toContain('flex-col')
    expect(cls).toContain('[&>*]:w-full')
    expect(cls).not.toContain('[&>*]:flex-1')
  })

  it('uses the 16px design gap in both orientations', () => {
    expect(mountIt().classes()).toContain('gap-4')
    expect(mountIt({ orientation: 'vertical' }).classes()).toContain('gap-4')
  })

  it('pads by default like the Figma component, and can opt out', () => {
    expect(mountIt().classes()).toContain('p-4')
    expect(mountIt({ hasPadding: false }).classes()).not.toContain('p-4')
  })

  it('renders two or three buttons without warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(mountIt().findAll('button')).toHaveLength(2)
    expect(
      mountIt(
        {},
        '<button>A</button><button>B</button><button>C</button>',
      ).findAll('button'),
    ).toHaveLength(3)
    expect(warn).not.toHaveBeenCalled()
  })

  it('warns when given fewer than 2 or more than 3 buttons', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mountIt({}, '<button>A</button>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('got 1')

    mountIt(
      {},
      '<button>A</button><button>B</button><button>C</button><button>D</button>',
    )
    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn.mock.calls[1][0]).toContain('got 4')
  })

  it('falls through attrs to the root', () => {
    const wrapper = mountIt({}, undefined, {
      role: 'group',
      'aria-label': 'Confirm actions',
      class: 'mt-6',
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Confirm actions')
    expect(wrapper.classes()).toContain('mt-6')
  })
})
