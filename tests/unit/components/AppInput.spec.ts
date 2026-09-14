import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '@/components/AppInput.vue'

const factory = (props: Record<string, unknown> = {}) =>
  mount(AppInput, {
    props: { placeholder: 'test', ...props },
    global: {
      stubs: { AppBtnIcon: { template: '<button><slot /></button>' } },
      mocks: { $t: (k: string) => k },
    },
  })

describe('AppInput submit-on-Enter gate (MEW-2185)', () => {
  it('emits `enter` on Enter when submitDisabled is false', async () => {
    const w = factory({ submitDisabled: false })
    await w.get('input').trigger('keyup', { key: 'Enter' })
    expect(w.emitted('enter')).toHaveLength(1)
  })

  it('does not emit `enter` on Enter when submitDisabled is true', async () => {
    const w = factory({ submitDisabled: true })
    await w.get('input').trigger('keyup', { key: 'Enter' })
    expect(w.emitted('enter')).toBeUndefined()
  })

  it('defaults submitDisabled to false (Enter emits)', async () => {
    const w = factory()
    await w.get('input').trigger('keyup', { key: 'Enter' })
    expect(w.emitted('enter')).toHaveLength(1)
  })
})
