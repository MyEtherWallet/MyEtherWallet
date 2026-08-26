import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ManageAccountsDeleteModal from '@/components/core_layouts/wallet/ManageAccountsDeleteModal.vue'

// AppDialog teleports; stub it to render the title + content slots inline and
// surface its is-open model so we can assert the modal closes.
const stubs = {
  AppDialog: {
    name: 'AppDialog',
    props: ['isOpen'],
    template: '<div :data-open="isOpen"><slot name="title" /><slot name="content" /></div>',
  },
}

const factory = (props = {}) =>
  mount(ManageAccountsDeleteModal, {
    props: { isOpen: true, accountName: 'Address 1', ...props },
    global: { stubs, mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsDeleteModal', () => {
  it('emits confirm and closes when the remove button is clicked', async () => {
    const w = factory()
    await w.get('[data-test="delete-modal-confirm"]').trigger('click')
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(w.emitted('update:isOpen')?.at(-1)).toEqual([false])
  })

  it('closes without confirming when cancel is clicked', async () => {
    const w = factory()
    await w.get('[data-test="delete-modal-cancel"]').trigger('click')
    expect(w.emitted('confirm')).toBeUndefined()
    expect(w.emitted('update:isOpen')?.at(-1)).toEqual([false])
  })
})
