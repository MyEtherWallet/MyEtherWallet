import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ManageAccountsDeleteModal from '@/components/core_layouts/wallet/ManageAccountsDeleteModal.vue'

// AppModal teleports; stub it to render the title/subtitle props, the default
// slot and its footer `buttons` inline, and surface its v-model.
const stubs = {
  AppModal: {
    name: 'AppModal',
    props: ['modelValue', 'title', 'subtitle', 'buttons', 'headerAlign'],
    template: `<div :data-open="modelValue"><h1>{{ title }}</h1><p>{{ subtitle }}</p>
      <section data-test="body"><slot /></section>
      <button v-for="(b, slot) in buttons" :key="slot" :data-test="'modal-' + slot" @click="b.onClick">{{ b.label }}</button></div>`,
  },
}

const factory = (props = {}) =>
  mount(ManageAccountsDeleteModal, {
    props: { isOpen: true, accountName: 'Address 1', ...props },
    global: { stubs, mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsDeleteModal', () => {
  it('uses the modal footer buttons: a danger primary next to a secondary close', () => {
    const w = factory()
    const { primary, secondary } = w
      .findComponent({ name: 'AppModal' })
      .props('buttons')
    expect(primary).toMatchObject({
      label: 'multi_address.remove.confirm',
      tone: 'danger',
    })
    // A filled secondary, not a text-only tertiary that floats in its half.
    expect(secondary).toMatchObject({ label: 'multi_address.remove.cancel' })
    expect(
      w.findComponent({ name: 'AppModal' }).props('headerAlign'),
    ).toBe('left')
    // No hand-rolled buttons left in the body.
    expect(w.get('[data-test="body"]').findAll('button')).toHaveLength(0)
  })

  it('emits confirm and closes when the remove button is clicked', async () => {
    const w = factory()
    await w.get('[data-test="modal-primary"]').trigger('click')
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(w.emitted('update:isOpen')?.at(-1)).toEqual([false])
  })

  it('closes without confirming when cancel is clicked', async () => {
    const w = factory()
    await w.get('[data-test="modal-secondary"]').trigger('click')
    expect(w.emitted('confirm')).toBeUndefined()
    expect(w.emitted('update:isOpen')?.at(-1)).toEqual([false])
  })

  it('truncates a ridiculously long name so the modal cannot overflow', () => {
    const longName = 'a'.repeat(200)
    const w = mount(ManageAccountsDeleteModal, {
      props: { isOpen: true, accountName: longName },
      global: {
        stubs,
        // Echo the interpolated name so we can assert what reaches the template.
        mocks: { $t: (_k: string, p?: { name: string }) => p?.name ?? '' },
      },
    })
    expect(w.text()).toContain('a'.repeat(32) + '...')
    expect(w.text()).not.toContain(longName)
  })
})
