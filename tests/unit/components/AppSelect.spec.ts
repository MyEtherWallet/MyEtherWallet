import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppSelect from '@/components/AppSelect.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: { common: { select_an_option: 'Select an option' } } },
})

const options = [
  { label: 'Verify message', value: 'verify' },
  { label: 'Sign message', value: 'sign' },
]

const mountSelect = () =>
  mount(AppSelect, {
    props: { options },
    global: { plugins: [i18n], stubs: { RouterLink: true } },
  })

// The header (MEW-2113) relies on `v-model:open` to know when a dropdown is
// open so it can lift its z-index above the trade drawer. Guard that contract.
describe('AppSelect open model (MEW-2113)', () => {
  it('emits update:open(true) when the dropdown is toggled open', async () => {
    const wrapper = mountSelect()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
  })

  it('emits update:open(false) when an option is selected', async () => {
    const wrapper = mountSelect()
    await wrapper.find('button').trigger('click') // open
    await wrapper.findAll('[role="option"]')[0].trigger('click') // pick
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })
})
