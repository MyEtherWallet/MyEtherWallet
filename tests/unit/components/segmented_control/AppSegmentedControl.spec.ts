import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import AppSegmentedControl from '@/components/segmented_control/AppSegmentedControl.vue'

const items = [
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
]

let wrapper: VueWrapper | undefined

const mountControl = (props = {}, slots = {}) => {
  wrapper = mount(AppSegmentedControl, {
    props: {
      items,
      modelValue: '1w',
      label: 'Chart range',
      'onUpdate:modelValue': (value: string) =>
        wrapper!.setProps({ modelValue: value }),
      ...props,
    },
    slots,
    attachTo: document.body,
  })
  return wrapper
}

const radios = (w: VueWrapper) => w.findAll('[role="radio"]')
const emitted = (w: VueWrapper) =>
  (w.emitted('update:modelValue') ?? []).map(([value]) => value)

afterEach(() => wrapper?.unmount())

describe('AppSegmentedControl', () => {
  it('is a labelled radiogroup with one radio per item', () => {
    const w = mountControl()
    const group = w.get('[role="radiogroup"]')
    expect(group.attributes('aria-label')).toBe('Chart range')
    expect(radios(w).map(r => r.text())).toEqual(['1D', '1W', '1M'])
  })

  it('checks the v-model item and makes only it tabbable', () => {
    const w = mountControl()
    expect(radios(w).map(r => r.attributes('aria-checked'))).toEqual([
      'false',
      'true',
      'false',
    ])
    expect(radios(w).map(r => r.attributes('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
    ])
  })

  it('falls back to the first segment as the tab stop when nothing matches', () => {
    const w = mountControl({ modelValue: 'nope' })
    expect(radios(w)[0].attributes('tabindex')).toBe('0')
  })

  it('emits the clicked value', async () => {
    const w = mountControl()
    await radios(w)[2].trigger('click')
    expect(emitted(w)).toEqual(['1m'])
  })

  it('arrow keys, Home and End move focus and select (wrapping)', async () => {
    const w = mountControl()
    const group = w.get('[role="radiogroup"]')

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(emitted(w).at(-1)).toBe('1m')
    expect(document.activeElement).toBe(radios(w)[2].element)

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(emitted(w).at(-1)).toBe('1d')
    expect(document.activeElement).toBe(radios(w)[0].element)

    await group.trigger('keydown', { key: 'ArrowLeft' })
    expect(emitted(w).at(-1)).toBe('1m')

    await group.trigger('keydown', { key: 'Home' })
    expect(emitted(w).at(-1)).toBe('1d')

    await group.trigger('keydown', { key: 'End' })
    expect(emitted(w).at(-1)).toBe('1m')
    expect(document.activeElement).toBe(radios(w)[2].element)
  })

  it('ignores unrelated keys', async () => {
    const w = mountControl()
    await w.get('[role="radiogroup"]').trigger('keydown', { key: 'a' })
    expect(emitted(w)).toEqual([])
  })

  it('passes the size to every segment', () => {
    const w = mountControl({ size: 'small' })
    expect(radios(w).every(r => r.classes().includes('h-7'))).toBe(true)
  })

  it('renders custom segment content through the label slot', () => {
    const w = mountControl(
      {},
      { label: '<template #label="{ item }">{{ item.label }}!</template>' },
    )
    expect(radios(w).map(r => r.text())).toEqual(['1D!', '1W!', '1M!'])
  })

  it('hands the avatar slot each item and the size-mapped avatar size', () => {
    const w = mountControl(
      { size: 'small' },
      {
        avatar:
          '<template #avatar="{ item, size }"><i class="av">{{ item.value }}-{{ size }}</i></template>',
      },
    )
    expect(w.findAll('.av').map(a => a.text())).toEqual([
      '1d-xs',
      '1w-xs',
      '1m-xs',
    ])
  })

  it('puts default-slot content in the track but outside the radiogroup', () => {
    const w = mountControl(
      {},
      { default: '<button class="more">More</button>' },
    )
    expect(w.find('.more').exists()).toBe(true)
    expect(w.find('[role="radiogroup"] .more').exists()).toBe(false)
  })

  it('stretches the track and segments when fullWidth', () => {
    const w = mountControl({ fullWidth: true })
    expect(w.get('[data-testid="segmented-control"]').classes()).toContain(
      'w-full',
    )
    expect(radios(w).every(r => r.classes().includes('flex-1'))).toBe(true)
  })

  it('scrolls the segments sideways when fullWidth content overflows', () => {
    const w = mountControl({ fullWidth: true })
    expect(w.get('[role="radiogroup"]').classes()).toEqual(
      expect.arrayContaining(['min-w-0', 'overflow-x-auto']),
    )
    const fit = mountControl()
    expect(fit.get('[role="radiogroup"]').classes()).not.toContain(
      'overflow-x-auto',
    )
  })
})
