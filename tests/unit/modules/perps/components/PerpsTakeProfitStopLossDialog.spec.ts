import { describe, it, expect, vi } from 'vitest'

vi.mock('@/analytics', () => ({
  analytics: { trackPerpsTpSlEvent: vi.fn() },
  PerpsTpSlEvent: {},
}))
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import PerpsTakeProfitStopLossDialog from '@/modules/perps/components/PerpsTakeProfitStopLossDialog.vue'
import AppChip from '@/components/chip/AppChip.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'

// AppModal teleports; render its body and footer inline instead.
const AppModal = {
  name: 'AppModal',
  props: ['modelValue', 'title'],
  template: '<div><slot /><slot name="footer" /></div>',
}

const mountDialog = async (props = {}) => {
  const wrapper = mount(PerpsTakeProfitStopLossDialog, {
    props: {
      isOpen: false,
      takeProfitPrice: 230.75,
      stopLossPrice: 172.17,
      displaySymbol: 'SMSN',
      currentPrice: 177.5,
      tempProjectedProfit: 75.09,
      tempProjectedLoss: -7.52,
      activeTpPill: 30,
      activeSlPill: null,
      isLong: true,
      maxShortTakeProfitPct: 0,
      hasEdits: true,
      ...props,
    },
    global: {
      plugins: [i18n],
      stubs: { AppModal },
      directives: { ripple: {} },
    },
  })
  // The cards follow the prices when the dialog opens.
  await wrapper.setProps({ isOpen: true })
  await nextTick()
  return wrapper
}

const chipLabels = (wrapper: Awaited<ReturnType<typeof mountDialog>>) =>
  wrapper.findAllComponents(AppChip).map(c => c.props('label'))

const button = (
  wrapper: Awaited<ReturnType<typeof mountDialog>>,
  label: string,
) => wrapper.findAllComponents(AppBaseButton).find(b => b.text() === label)!

describe('PerpsTakeProfitStopLossDialog', () => {
  it('signs the presets by side and marks the active one', async () => {
    const wrapper = await mountDialog()
    expect(chipLabels(wrapper)).toEqual([
      '+10%',
      '+20%',
      '+30%',
      '+50%',
      '+100%',
      '-1%',
      '-2%',
      '-3%',
      '-4%',
      '-5%',
    ])
    const selected = wrapper
      .findAllComponents(AppChip)
      .filter(c => c.props('selected'))
      .map(c => c.props('label'))
    expect(selected).toEqual(['+30%'])

    await wrapper.setProps({ isLong: false, maxShortTakeProfitPct: 99.5 })
    expect(chipLabels(wrapper)).toEqual([
      '-10%',
      '-20%',
      '-30%',
      '-50%',
      '-99.5%',
      '+1%',
      '+2%',
      '+3%',
      '+4%',
      '+5%',
    ])
  })

  it('emits the preset percentage on chip click', async () => {
    const wrapper = await mountDialog()
    const chips = wrapper.findAllComponents(AppChip)
    await chips[1].trigger('click')
    await chips[7].trigger('click')
    expect(wrapper.emitted('setTakeProfitPct')).toEqual([[20]])
    expect(wrapper.emitted('setStopLossPct')).toEqual([[3]])
  })

  it('shows the projected profit and loss', async () => {
    const wrapper = await mountDialog()
    expect(wrapper.text()).toContain('+$75.09')
    expect(wrapper.text()).toContain('-$7.52')
  })

  it('removes a trigger and clears it upstream', async () => {
    const wrapper = await mountDialog()
    await wrapper.findAllComponents(AppBaseButton)[0].trigger('click')
    expect(wrapper.emitted('clearTakeProfit')).toHaveLength(1)
    expect(wrapper.text()).toContain('Add Take Profit')
  })

  it('saves only with edits and no errors, and cancel closes', async () => {
    const wrapper = await mountDialog()
    const save = () => button(wrapper, 'Save')
    expect(save().props('disabled')).toBe(false)
    await save().trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)

    await wrapper.setProps({ takeProfitError: 'Too low' })
    expect(save().props('disabled')).toBe(true)
    await wrapper.setProps({ takeProfitError: undefined, hasEdits: false })
    expect(save().props('disabled')).toBe(true)

    await button(wrapper, 'Cancel').trigger('click')
    expect(wrapper.emitted('update:isOpen')?.at(-1)).toEqual([false])
  })
})
