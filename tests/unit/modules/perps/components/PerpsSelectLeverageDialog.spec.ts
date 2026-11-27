import { describe, it, expect, vi } from 'vitest'

// The perps modules pull the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'

// AppModal teleports and locks the page; render its slots and the primary
// footer button it would build from `buttons`.
vi.mock('@/components/modal/AppModal.vue', () => ({
  default: {
    name: 'AppModal',
    props: ['modelValue', 'title', 'buttons'],
    template: `<div>
      <slot name="header" />
      <slot />
      <button
        data-test="modal-primary"
        :disabled="buttons.primary.disabled"
        @click="buttons.primary.onClick()"
      >{{ buttons.primary.label }}</button>
    </div>`,
  },
}))

import PerpsSelectLeverageDialog from '@/modules/perps/components/PerpsSelectLeverageDialog.vue'
import AppSlider from '@/components/slider/AppSlider.vue'
import AppChip from '@/components/chip/AppChip.vue'

const mountDialog = (props: Record<string, unknown> = {}) =>
  mount(PerpsSelectLeverageDialog, {
    props: {
      isOpen: true,
      symbol: 'ETH',
      modelValue: 3,
      leverageError: '',
      isSaving: false,
      mode: 'create' as const,
      maxLeverage: 10,
      ...props,
    },
    global: { plugins: [i18n] },
  })

describe('PerpsSelectLeverageDialog', () => {
  it('steps, slides and picks presets through update:modelValue', async () => {
    const wrapper = mountDialog()
    await wrapper.get('[data-test="leverage-decrease"]').trigger('click')
    await wrapper.get('[data-test="leverage-increase"]').trigger('click')
    wrapper.getComponent(AppSlider).vm.$emit('update:modelValue', 7)
    const chips = wrapper.findAllComponents(AppChip)
    expect(chips.map(c => c.props('label'))).toEqual([
      '1×',
      '3×',
      '6×',
      '8×',
      '10×',
    ])
    await chips[4].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2], [4], [7], [10]])
  })

  it('disables the stepper at the bounds', () => {
    const atMin = mountDialog({ modelValue: 1 })
    expect(
      atMin.get('[data-test="leverage-decrease"]').attributes('disabled'),
    ).toBeDefined()
    const atMax = mountDialog({ modelValue: 10 })
    expect(
      atMax.get('[data-test="leverage-increase"]').attributes('disabled'),
    ).toBeDefined()
  })

  it('saves from the modal footer and blocks it while saving', async () => {
    const wrapper = mountDialog()
    const save = wrapper.get('[data-test="modal-primary"]')
    expect(save.text()).toBe('Save')
    await save.trigger('click')
    expect(wrapper.emitted('save')).toHaveLength(1)

    const saving = mountDialog({ isSaving: true, mode: 'submit' })
    const submit = saving.get('[data-test="modal-primary"]')
    expect(submit.text()).toBe('Submitting...')
    expect(submit.attributes('disabled')).toBeDefined()
  })

  it('shows the leverage-change warning only when adding', () => {
    expect(mountDialog().text()).not.toContain('Position leverage will change')
    expect(mountDialog({ mode: 'add' }).text()).toContain(
      'Position leverage will change',
    )
  })
})
