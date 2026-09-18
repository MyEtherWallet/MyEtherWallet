import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import i18n from '@/i18n'
import ToastTradeStatus from '@/modules/toast/components/ToastTradeStatus.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import { useToastStore } from '@/stores/toastStore'
import type { Toast } from '@/types/notification'

const processingToast: Toast = {
  id: 'trade-processing-0xabc',
  variant: 'dark',
  text: 'Processing trade',
  textSecondary: 'This can take a few minutes',
  isInfinite: true,
  tradeStatus: { kind: 'processing' },
}

const completedToast: Toast = {
  id: 'trade-completed-0xabc',
  variant: 'dark',
  text: 'Trade completed',
  textSecondary: 'You received a total of 0.8952 AALON',
  duration: 10000,
  tradeStatus: {
    kind: 'completed',
    toTokenIcon: '',
    toSymbol: 'AALON',
    toTokenIsStock: true,
  },
  link: {
    title: 'Explore in Etherscan',
    url: 'https://etherscan.io/tx/0xdef',
    isButton: true,
  },
}

let pinia: Pinia

const mountToast = (toast: Toast) =>
  mount(ToastTradeStatus, {
    props: { toast, index: 0 },
    global: { plugins: [i18n, pinia] },
  })

describe('ToastTradeStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the processing variant with a spinner and no close button', () => {
    const toast = mountToast(processingToast)
    expect(toast.text()).toContain('Processing trade')
    expect(toast.text()).toContain('This can take a few minutes')
    expect(toast.findComponent(AppSpinner).exists()).toBe(true)
    expect(toast.find('button').exists()).toBe(false)
    expect(toast.find('a').exists()).toBe(false)
  })

  it('renders the completed variant with the explorer button', () => {
    const toast = mountToast(completedToast)
    expect(toast.text()).toContain('Trade completed')
    expect(toast.text()).toContain('You received a total of 0.8952 AALON')
    const link = toast.find('a')
    expect(link.attributes('href')).toBe('https://etherscan.io/tx/0xdef')
    expect(link.text()).toBe('Explore in Etherscan')
  })

  it('removes itself from the store when dismissed', async () => {
    const toastStore = useToastStore()
    toastStore.addToastMessage(completedToast)
    const toast = mountToast(completedToast)

    await toast.find('button').trigger('click')

    expect(toastStore.messages).toHaveLength(0)
  })

  it('auto-dismisses after its duration', () => {
    const toastStore = useToastStore()
    toastStore.addToastMessage(completedToast)
    mountToast(completedToast)

    vi.advanceTimersByTime(10001)

    expect(toastStore.messages).toHaveLength(0)
  })

  it('never auto-dismisses the infinite processing toast', () => {
    const toastStore = useToastStore()
    toastStore.addToastMessage(processingToast)
    mountToast(processingToast)

    vi.advanceTimersByTime(60000)

    expect(toastStore.messages).toHaveLength(1)
  })
})
