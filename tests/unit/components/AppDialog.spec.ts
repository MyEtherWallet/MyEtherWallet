import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import { useDialogStore } from '@/stores/dialogStore'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

describe('AppDialog inert / isAreaHidden lifecycle (MEW-2094 overlay bug)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // AppDialog teleports to #app.
    document.body.innerHTML = '<div id="app"></div>'
  })

  const mountOpen = () =>
    mount(AppDialog, {
      props: { isOpen: true },
      attachTo: '#app',
      global: { plugins: [i18n], stubs: { AppBtnIconClose: true } },
    })

  it('marks the background as hidden while open', async () => {
    mountOpen()
    await nextTick()
    expect(useDialogStore().isAreaHidden).toBe(true)
  })

  it('releases the background inert flag when unmounted while still open', async () => {
    const wrapper = mountOpen()
    await nextTick()
    expect(useDialogStore().isAreaHidden).toBe(true)

    // Simulates a dialog torn down via a parent v-if while open (e.g.
    // TheAddressMenuDialog when the wallet is removed) — the isOpen watcher
    // never runs a closing pass, so the global inert flag must be released on
    // unmount or the whole app stays non-interactive.
    wrapper.unmount()
    await nextTick()
    expect(useDialogStore().isAreaHidden).toBe(false)
  })

  it('clears the flag on normal close too', async () => {
    const wrapper = mountOpen()
    await nextTick()
    await wrapper.setProps({ isOpen: false })
    await nextTick()
    expect(useDialogStore().isAreaHidden).toBe(false)
  })
})
