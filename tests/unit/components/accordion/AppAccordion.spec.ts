import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import AppAccordion from '@/components/accordion/AppAccordion.vue'
import AppAccordionGroup from '@/components/accordion/AppAccordionGroup.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { CELL_SURFACE_BG_CLASS } from '@/components/cell/cellSizes'

const body = { default: '<p data-test="body">Details</p>' }

// The height animation is ExpandTransition's job; stubbed, v-show flips at
// once. Attached because jsdom caches computed styles of detached nodes, which
// leaves isVisible() stuck on its first answer.
const opts = {
  global: {
    stubs: {
      ExpandTransition: defineComponent(
        (_, { slots }) =>
          () =>
            slots.default?.(),
      ),
    },
  },
  attachTo: document.body,
}

enableAutoUnmount(afterEach)

const mountAccordion = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(AppAccordion, {
    props: { title: 'Title', description: 'Information', ...props },
    slots: { ...body, ...slots },
    ...opts,
  })

const header = (w: ReturnType<typeof mount>) => w.get('[data-testid="cell"]')
const panel = (w: ReturnType<typeof mount>) => w.get('[role="region"]')
const chevron = (w: ReturnType<typeof mount>) =>
  w.findComponent(AppIcon).props('name')

describe('AppAccordion — design-library Accordion (MEW-2465)', () => {
  it('starts closed: body hidden, chevron down, aria-expanded false', () => {
    const w = mountAccordion()
    expect(panel(w).isVisible()).toBe(false)
    expect(chevron(w)).toBe('chevron-down')
    expect(header(w).attributes('aria-expanded')).toBe('false')
  })

  it('opens on header click when uncontrolled and emits update:open + toggle', async () => {
    const w = mountAccordion()
    await header(w).trigger('click')
    expect(panel(w).isVisible()).toBe(true)
    expect(chevron(w)).toBe('chevron-up')
    expect(header(w).attributes('aria-expanded')).toBe('true')
    expect(w.emitted('update:open')).toEqual([[true]])
    expect(w.emitted('toggle')).toEqual([[true]])
  })

  it('toggles on Enter and Space through the Cell keyboard handling', async () => {
    const w = mountAccordion()
    await header(w).trigger('keydown.enter')
    expect(panel(w).isVisible()).toBe(true)
    await header(w).trigger('keydown.space')
    expect(panel(w).isVisible()).toBe(false)
  })

  it('stays put under v-model until the parent updates open', async () => {
    const w = mountAccordion({ open: false, 'onUpdate:open': () => {} })
    await header(w).trigger('click')
    expect(w.emitted('update:open')).toEqual([[true]])
    expect(panel(w).isVisible()).toBe(false)
    await w.setProps({ open: true })
    expect(panel(w).isVisible()).toBe(true)
  })

  it('opens when the chevron itself is clicked', async () => {
    const w = mountAccordion()
    await w.findComponent(AppIcon).trigger('click')
    expect(panel(w).isVisible()).toBe(true)
  })

  it('wires the disclosure: aria-controls → body id, body labelled by the header', () => {
    const w = mountAccordion()
    const headerId = header(w).attributes('id')
    expect(headerId).toBeTruthy()
    expect(header(w).attributes('aria-controls')).toBe(
      panel(w).attributes('id'),
    )
    expect(panel(w).attributes('aria-labelledby')).toBe(headerId)
  })

  it('builds the header / body ids from the id prop when given', () => {
    const w = mountAccordion({ id: 'fees' })
    expect(header(w).attributes('id')).toBe('fees-header')
    expect(panel(w).attributes('id')).toBe('fees-body')
  })

  it('gives each instance its own ids', () => {
    // useId is unique per app tree, so both live under one parent.
    const w = mount(
      {
        render: () => [
          h(AppAccordion, { title: 'A' }),
          h(AppAccordion, { title: 'B' }),
        ],
      },
      opts,
    )
    const ids = w.findAll('[data-testid="cell"]').map(c => c.attributes('id'))
    expect(new Set(ids).size).toBe(2)
  })

  it.each([
    ['disabled', 'aria-disabled'],
    ['loading', 'aria-busy'],
  ])('blocks toggling when %s and the Cell sets %s', async (prop, aria) => {
    const w = mountAccordion({ [prop]: true })
    await header(w).trigger('click')
    expect(panel(w).isVisible()).toBe(false)
    expect(w.emitted('update:open')).toBeUndefined()
    expect(header(w).attributes(aria)).toBe('true')
  })

  it('keeps the chevron visible while loading', () => {
    expect(
      mountAccordion({ loading: true }).findComponent(AppIcon).exists(),
    ).toBe(true)
  })

  it.each([['default'], ['alternative']] as const)(
    'forwards surface="%s" to the Cell and paints the root with the same token',
    surface => {
      const w = mountAccordion({ surface })
      expect(w.findComponent(AppCell).props('surface')).toBe(surface)
      expect(w.classes()).toContain(CELL_SURFACE_BG_CLASS[surface])
    },
  )

  it('forwards header content props to the Cell', () => {
    const rightAccessory = { kind: 'balance', primary: '$1' }
    const cell = mountAccordion({ rightAccessory }).findComponent(AppCell)
    expect(cell.props('title')).toBe('Title')
    expect(cell.props('description')).toBe('Information')
    expect(cell.props('rightAccessory')).toEqual(rightAccessory)
  })

  it('renders the default slot in the body and named slots in the header', () => {
    const w = mountAccordion(
      {},
      {
        avatar: (scope: { size: string }) =>
          h('i', { 'data-test': 'avatar', 'data-size': scope.size }),
      },
    )
    expect(panel(w).find('[data-test="body"]').exists()).toBe(true)
    expect(header(w).get('[data-test="avatar"]').attributes('data-size')).toBe(
      'l',
    )
  })

  it('forwards a named slot the consumer adds after mount', async () => {
    const late = ref(false)
    const w = mount(
      defineComponent(
        () => () =>
          h(
            AppAccordion,
            { title: 'Title' },
            late.value ? { avatar: () => h('b', { 'data-test': 'late' }) } : {},
          ),
      ),
      opts,
    )
    late.value = true
    await nextTick()
    expect(w.find('[data-test="late"]').exists()).toBe(true)
  })

  it('lands fallthrough attrs on the root, not the header', () => {
    const w = mountAccordion({ class: 'mt-4', 'data-foo': 'bar' })
    expect(w.classes()).toContain('mt-4')
    expect(w.attributes('data-foo')).toBe('bar')
    expect(header(w).attributes('data-foo')).toBeUndefined()
  })
})

describe('AppAccordionGroup', () => {
  const mountGroup = (props: Record<string, unknown> = {}) =>
    mount(AppAccordionGroup, {
      props,
      ...opts,
      slots: {
        default: () =>
          ['a', 'b'].map(value =>
            h(
              AppAccordion,
              { value, title: value, open: value === 'b' },
              { default: () => h('p', value) },
            ),
          ),
      },
    })

  const panels = (w: ReturnType<typeof mount>) => w.findAll('[role="region"]')
  const headers = (w: ReturnType<typeof mount>) =>
    w.findAll('[data-testid="cell"]')

  it('keeps one panel open at a time by default', async () => {
    const w = mountGroup()
    await headers(w)[0].trigger('click')
    expect(panels(w).map(p => p.isVisible())).toEqual([true, false])
    await headers(w)[1].trigger('click')
    expect(panels(w).map(p => p.isVisible())).toEqual([false, true])
    expect(w.emitted('update:modelValue')).toEqual([['a'], ['b']])
  })

  it('closes the open panel when its header is clicked again', async () => {
    const w = mountGroup({ modelValue: 'a', 'onUpdate:modelValue': () => {} })
    await headers(w)[0].trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[null]])
  })

  it('lets several stay open with multiple', async () => {
    const w = mountGroup({ multiple: true })
    await headers(w)[0].trigger('click')
    await headers(w)[1].trigger('click')
    expect(panels(w).map(p => p.isVisible())).toEqual([true, true])
    await headers(w)[0].trigger('click')
    expect(panels(w).map(p => p.isVisible())).toEqual([false, true])
  })

  it('follows the group v-model and ignores a child open prop', async () => {
    const model = ref<string | null>('a')
    const w = mountGroup({
      modelValue: model.value,
      'onUpdate:modelValue': (v: string | null) => (model.value = v),
    })
    // Child "b" was rendered with open=true, the group still decides.
    expect(panels(w).map(p => p.isVisible())).toEqual([true, false])
    await w.setProps({ modelValue: 'b' })
    expect(panels(w).map(p => p.isVisible())).toEqual([false, true])
  })
})
