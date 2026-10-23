import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppModal from '@/components/modal/AppModal.vue'
import { useDialogStore } from '@/stores/dialogStore'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: { common: { close: 'close', back: 'Back' } } },
})

const mounted: VueWrapper[] = []

// The modal teleports to #app, so queries go through the document.
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')
const dialogs = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'))
const closeBtn = () =>
  document.querySelector<HTMLButtonElement>('button[aria-label="close"]')
const backBtn = () =>
  document.querySelector<HTMLButtonElement>('button[aria-label="Back"]')
const backdrop = (el = dialog()) => el!.parentElement!

const mountModal = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(AppModal, {
    props: {
      modelValue: true,
      title: 'Title',
      // Behave like a real v-model parent so closing actually closes.
      'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v }),
      ...props,
    },
    slots,
    attachTo: '#app',
    global: { plugins: [i18n] },
  })
  mounted.push(wrapper)
  return wrapper
}

describe('AppModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.body.innerHTML = '<div id="app"></div>'
    document.body.style.overflow = ''
  })

  afterEach(() => {
    mounted.splice(0).forEach(w => w.unmount())
  })

  describe('rendering', () => {
    it('renders nothing while closed', async () => {
      mountModal({ modelValue: false })
      await nextTick()
      expect(dialog()).toBeNull()
    })

    it('teleports an aria-modal dialog labelled by its header when open', async () => {
      mountModal({ subtitle: 'Sub' })
      await nextTick()
      const el = dialog()!
      expect(el.closest('#app')).not.toBeNull()
      expect(el.getAttribute('aria-modal')).toBe('true')
      const labelId = el.getAttribute('aria-labelledby')!
      expect(document.getElementById(labelId)!.textContent).toContain('Title')
      expect(el.textContent).toContain('Sub')
    })

    it('falls back to aria-label when the header is hidden', async () => {
      mountModal({ showHeader: false, ariaLabel: 'Pick one' })
      await nextTick()
      expect(dialog()!.hasAttribute('aria-labelledby')).toBe(false)
      expect(dialog()!.getAttribute('aria-label')).toBe('Pick one')
      expect(dialog()!.querySelector('header')).toBeNull()
    })

    it('uses the title as aria-label when a custom #header replaces it', async () => {
      mountModal({}, { header: '<span data-test="custom">Custom</span>' })
      await nextTick()
      expect(dialog()!.querySelector('[data-test="custom"]')).not.toBeNull()
      expect(dialog()!.getAttribute('aria-label')).toBe('Title')
    })

    it('hides the header when there is no title and no #header slot', async () => {
      mountModal({ title: undefined, ariaLabel: 'x' })
      await nextTick()
      expect(dialog()!.querySelector('header')).toBeNull()
    })

    it('renders the default slot', async () => {
      mountModal({}, { default: '<p data-test="body">Body</p>' })
      await nextTick()
      expect(dialog()!.querySelector('[data-test="body"]')).not.toBeNull()
    })

    it('forwards attrs (class, data-test) to the panel', async () => {
      mountModal({ class: 'sm:w-200', 'data-test': 'my-modal' })
      await nextTick()
      expect(dialog()!.classList).toContain('sm:w-200')
      expect(dialog()!.getAttribute('data-test')).toBe('my-modal')
    })

    it('stacks a modal opened later above the earlier one', async () => {
      mountModal({ title: 'First' })
      await nextTick()
      mountModal({ title: 'Second' })
      await nextTick()
      const [first, second] = dialogs().map(d =>
        Number(backdrop(d).style.zIndex),
      )
      expect(second).toBeGreaterThan(first)
    })
  })

  describe('stacking', () => {
    const zOf = (title: string) =>
      Number(
        backdrop(dialogs().find(d => d.textContent!.includes(title))).style
          .zIndex,
      )

    it('a child reopened over an open base keeps the same layer', async () => {
      mountModal({ title: 'Base' })
      const child = mountModal({ title: 'Child', modelValue: false })
      await nextTick()

      const layers: number[] = []
      for (let i = 0; i < 3; i++) {
        await child.setProps({ modelValue: true })
        layers.push(zOf('Child'))
        await child.setProps({ modelValue: false })
      }
      expect(new Set(layers).size).toBe(1)
      expect(layers[0]).toBeGreaterThan(zOf('Base'))
    })
  })

  describe('back / close', () => {
    it('shows close and hides back by default', async () => {
      mountModal()
      await nextTick()
      expect(closeBtn()).not.toBeNull()
      expect(backBtn()).toBeNull()
    })

    it('close button closes and emits close', async () => {
      const wrapper = mountModal()
      await nextTick()
      closeBtn()!.click()
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(dialog()).toBeNull()
    })

    it('hides the close button with showCloseButton=false', async () => {
      mountModal({ showCloseButton: false })
      await nextTick()
      expect(closeBtn()).toBeNull()
    })

    it('back emits back without closing', async () => {
      const wrapper = mountModal({ showBackButton: true })
      await nextTick()
      backBtn()!.click()
      await nextTick()
      expect(wrapper.emitted('back')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(dialog()).not.toBeNull()
    })
  })

  describe('dismissal', () => {
    const pressEsc = () =>
      dialog()!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      )

    it('Esc closes', async () => {
      const wrapper = mountModal()
      await nextTick()
      pressEsc()
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('backdrop click closes, a click inside the panel does not', async () => {
      const wrapper = mountModal({}, { default: '<p data-test="body">x</p>' })
      await nextTick()
      dialog()!.querySelector<HTMLElement>('[data-test="body"]')!.click()
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      backdrop().click()
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })

    it('closeOnEsc=false / closeOnBackdrop=false keep it open', async () => {
      const wrapper = mountModal({ closeOnEsc: false, closeOnBackdrop: false })
      await nextTick()
      pressEsc()
      backdrop().click()
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('persistent blocks Esc and backdrop and hides close', async () => {
      const wrapper = mountModal({ persistent: true })
      await nextTick()
      expect(closeBtn()).toBeNull()
      pressEsc()
      backdrop().click()
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('a parent closing it does not emit close', async () => {
      const wrapper = mountModal()
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('footer', () => {
    it('renders buttons tertiary → secondary → primary and calls onClick', async () => {
      const clicked: string[] = []
      mountModal({
        buttons: {
          primary: { label: 'OK', onClick: () => clicked.push('primary') },
          secondary: { label: 'Cancel', onClick: () => clicked.push('sec') },
          tertiary: { label: 'More', onClick: () => clicked.push('ter') },
        },
      })
      await nextTick()
      const labels = Array.from(
        dialog()!.querySelectorAll<HTMLButtonElement>('footer button'),
      )
      expect(labels.map(b => b.textContent!.trim())).toEqual([
        'More',
        'Cancel',
        'OK',
      ])
      labels[2].click()
      expect(clicked).toEqual(['primary'])
    })

    it('omits the footer without buttons or #footer', async () => {
      mountModal()
      await nextTick()
      expect(dialog()!.querySelector('footer')).toBeNull()
    })

    it('#footer overrides the buttons config', async () => {
      mountModal(
        { buttons: { primary: { label: 'OK', onClick: () => {} } } },
        { footer: '<span data-test="own-footer">mine</span>' },
      )
      await nextTick()
      const footer = dialog()!.querySelector('footer')!
      expect(footer.querySelector('[data-test="own-footer"]')).not.toBeNull()
      expect(footer.textContent).not.toContain('OK')
    })
  })

  describe('focus', () => {
    it('moves focus to the first focusable inside on open', async () => {
      mountModal({}, { default: '<input data-test="first" />' })
      await flushPromises()
      expect(document.activeElement).toBe(
        dialog()!.querySelector('[data-test="first"]'),
      )
    })

    it('returns focus to the opener on close', async () => {
      const opener = document.createElement('button')
      document.body.appendChild(opener)
      opener.focus()
      const wrapper = mountModal({ modelValue: false })
      await wrapper.setProps({ modelValue: true })
      await flushPromises()
      expect(document.activeElement).not.toBe(opener)
      await wrapper.setProps({ modelValue: false })
      await flushPromises()
      expect(document.activeElement).toBe(opener)
    })

    it('never lands on a footer action or close when the content has no control', async () => {
      mountModal({
        buttons: { primary: { label: 'Delete', onClick: () => {} } },
      })
      await flushPromises()
      expect(document.activeElement).toBe(dialog())
    })

    it('skips inert controls on open and in the Tab loop', async () => {
      mountModal(
        {},
        {
          default:
            '<div inert><input data-test="inert-first" /></div>' +
            '<input data-test="real" />' +
            '<div inert><button data-test="inert-last">x</button></div>',
        },
      )
      await flushPromises()
      const real = dialog()!.querySelector<HTMLElement>('[data-test="real"]')!
      expect(document.activeElement).toBe(real)

      const tab = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      })
      real.dispatchEvent(tab)
      expect(tab.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(closeBtn())

      const shiftTab = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
      closeBtn()!.dispatchEvent(shiftTab)
      expect(document.activeElement).toBe(real)
    })

    it('Tab wraps from the last focusable to the first and back', async () => {
      // Close is first in the DOM (top of the panel), the content input last.
      mountModal({}, { default: '<input data-test="last" />' })
      await flushPromises()
      const first = closeBtn()!
      const last = dialog()!.querySelector<HTMLElement>('[data-test="last"]')!

      last.focus()
      const tab = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      })
      last.dispatchEvent(tab)
      expect(tab.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(first)

      const shiftTab = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
      first.dispatchEvent(shiftTab)
      expect(shiftTab.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(last)
    })
  })

  describe('background lock', () => {
    it('marks the background inert and locks body scroll while open', async () => {
      const wrapper = mountModal()
      await nextTick()
      expect(useDialogStore().isAreaHidden).toBe(true)
      expect(document.body.style.overflow).toBe('hidden')
      await wrapper.setProps({ modelValue: false })
      await nextTick()
      expect(useDialogStore().isAreaHidden).toBe(false)
      expect(document.body.style.overflow).toBe('')
    })

    it('keeps the lock until the last of two stacked modals closes', async () => {
      const a = mountModal({ title: 'A' })
      const b = mountModal({ title: 'B' })
      await nextTick()
      await b.setProps({ modelValue: false })
      await nextTick()
      expect(useDialogStore().isAreaHidden).toBe(true)
      expect(document.body.style.overflow).toBe('hidden')
      await a.setProps({ modelValue: false })
      await nextTick()
      expect(useDialogStore().isAreaHidden).toBe(false)
      expect(document.body.style.overflow).toBe('')
    })

    // MEW-2094: a modal torn down by a parent v-if while open must release the
    // inert flag, or the whole app stays non-interactive.
    it('releases the lock when unmounted while still open', async () => {
      const wrapper = mountModal()
      await nextTick()
      wrapper.unmount()
      mounted.splice(mounted.indexOf(wrapper), 1)
      await nextTick()
      expect(useDialogStore().isAreaHidden).toBe(false)
    })

    it('mounting a closed modal does not lock anything', async () => {
      mountModal({ modelValue: false })
      await nextTick()
      expect(useDialogStore().isAreaHidden).toBe(false)
    })
  })

  describe('transitions', () => {
    it('emits opened after enter and closed after leave', async () => {
      const wrapper = mount(AppModal, {
        props: { modelValue: false, title: 'T' },
        attachTo: '#app',
        global: { plugins: [i18n], stubs: { transition: false } },
      })
      mounted.push(wrapper)
      await wrapper.setProps({ modelValue: true })
      await new Promise(r => setTimeout(r, 50))
      expect(wrapper.emitted('opened')).toHaveLength(1)
      await wrapper.setProps({ modelValue: false })
      await new Promise(r => setTimeout(r, 50))
      expect(wrapper.emitted('closed')).toHaveLength(1)
    })
  })
})
