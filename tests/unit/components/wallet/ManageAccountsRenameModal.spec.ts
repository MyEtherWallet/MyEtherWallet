import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ManageAccountsRenameModal from '@/components/core_layouts/wallet/ManageAccountsRenameModal.vue'

// AppDialog teleports; stub it to just render the title + content slots inline.
const stubs = {
  AppDialog: {
    name: 'AppDialog',
    template: '<div><slot name="title" /><slot name="content" /></div>',
  },
}

const factory = (props = {}) =>
  mount(ManageAccountsRenameModal, {
    props: { isOpen: true, currentName: 'Address 1', ...props },
    global: { stubs, mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsRenameModal', () => {
  it('disables Save when the name is empty', async () => {
    const w = factory({ currentName: '' })
    expect(w.get('[data-test="rename-modal-save"]').attributes('disabled')).toBeDefined()
    await w.get('[data-test="rename-modal-input"]').setValue('New name')
    expect(w.get('[data-test="rename-modal-save"]').attributes('disabled')).toBeUndefined()
  })

  it('shows the duplicate error while typing and disables Save (no emit on submit)', async () => {
    const w = factory({ nameTaken: (n: string) => n === 'Taken' })
    await w.get('[data-test="rename-modal-input"]').setValue('Taken')
    // Error surfaces live (on typing), before any Save click
    expect(w.find('[data-test="rename-modal-error"]').exists()).toBe(true)
    expect(w.get('[data-test="rename-modal-save"]').attributes('disabled')).toBeDefined()
    // Submit fallback: still does not emit even if triggered (e.g. via Enter)
    await w.get('[data-test="rename-modal-save"]').trigger('click')
    expect(w.emitted('save')).toBeUndefined()
  })

  it('clears the duplicate error once the name becomes unique again', async () => {
    const w = factory({ nameTaken: (n: string) => n === 'Taken' })
    await w.get('[data-test="rename-modal-input"]').setValue('Taken')
    expect(w.find('[data-test="rename-modal-error"]').exists()).toBe(true)
    await w.get('[data-test="rename-modal-input"]').setValue('Unique')
    expect(w.find('[data-test="rename-modal-error"]').exists()).toBe(false)
    expect(w.get('[data-test="rename-modal-save"]').attributes('disabled')).toBeUndefined()
  })

  it('emits save with the trimmed name when unique', async () => {
    const w = factory({ nameTaken: () => false })
    await w.get('[data-test="rename-modal-input"]').setValue('  Savings  ')
    await w.get('[data-test="rename-modal-save"]').trigger('click')
    expect(w.emitted('save')![0]).toEqual(['Savings'])
  })
})
