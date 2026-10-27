import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ allChains: [] }),
}))
vi.mock('@/composables/useAppBreakpoints', () => ({
  useAppBreakpoints: () => ({ isXS: { value: false } }),
}))

import ToastMessage from '@/modules/toast/components/ToastMessage.vue'
import AppToast from '@/components/toast/AppToast.vue'
import { useToastStore } from '@/stores/toastStore'
import { ToastType, type Toast } from '@/types/notification'

const i18n = createI18n({ legacy: false, locale: 'en', missingWarn: false })

let store: ReturnType<typeof useToastStore>

const showToast = (toast: Toast) => {
  store.addToastMessage(toast)
  const stored = store.messages[store.messages.length - 1]
  return mount(ToastMessage, {
    props: { toast: stored },
    global: { plugins: [i18n] },
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
  store = useToastStore()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ToastMessage — store toast through AppToast', () => {
  it('passes the mapped toast to AppToast', () => {
    const wrapper = showToast({
      type: ToastType.Warning,
      text: 'Wallet not detected',
      textSecondary: 'Install it',
      link: { title: 'Install', url: 'https://enkrypt.com' },
    })
    expect(wrapper.findComponent(AppToast).props()).toMatchObject({
      type: 'warning',
      title: 'Wallet not detected',
      description: 'Install it',
      buttonLabel: 'Install',
    })
  })

  it('auto-dismisses after the duration', () => {
    showToast({ text: 'Saved', duration: 3000 })
    vi.advanceTimersByTime(2999)
    expect(store.messages).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(store.messages).toHaveLength(0)
  })

  it('keeps processing and infinite toasts until removed', () => {
    showToast({ text: 'Processing', tradeStatus: { kind: 'processing' } })
    showToast({ text: 'Sticky', isInfinite: true })
    vi.advanceTimersByTime(60_000)
    expect(store.messages).toHaveLength(2)
  })

  it('pauses the timer while hovered and resumes with the time left', async () => {
    const wrapper = showToast({ text: 'Saved', duration: 3000 })
    vi.advanceTimersByTime(1000)
    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(10_000)
    expect(store.messages).toHaveLength(1)
    await wrapper.trigger('mouseleave')
    vi.advanceTimersByTime(1999)
    expect(store.messages).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(store.messages).toHaveLength(0)
  })

  it('pauses while focus is inside the toast', async () => {
    const wrapper = showToast({ text: 'Saved', duration: 3000 })
    await wrapper.trigger('focusin')
    vi.advanceTimersByTime(10_000)
    expect(store.messages).toHaveLength(1)
  })

  it('removes itself on dismiss and opens the link on action', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const wrapper = showToast({
      type: ToastType.Success,
      text: 'Done',
      isInfinite: true,
      link: { title: 'View', url: 'https://etherscan.io' },
    })
    wrapper.findComponent(AppToast).vm.$emit('action')
    expect(open).toHaveBeenCalledWith(
      'https://etherscan.io',
      '_blank',
      'noopener,noreferrer',
    )
    wrapper.findComponent(AppToast).vm.$emit('dismiss')
    expect(store.messages).toHaveLength(0)
    open.mockRestore()
  })
})
