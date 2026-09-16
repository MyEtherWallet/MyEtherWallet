import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ToastLayout from '@/modules/toast/components/ToastLayout.vue'
import {
  hasLegacyToastContent,
  mapToastToAppToast,
} from '@/modules/toast/toastAdapter'
import { useToastStore } from '@/stores/toastStore'
import { ToastType, type Toast } from '@/types/notification'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('toast adapter', () => {
  it('maps legacy fields to the AppToast API and opens legacy links', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const legacy: Toast = {
      type: ToastType.Warning,
      text: 'Legacy title',
      textSecondary: 'Legacy description',
      link: { title: 'Install', url: 'https://example.test/install' },
      duration: 2500,
      isInfinite: true,
    }

    const mapped = mapToastToAppToast(legacy)

    expect(mapped).toMatchObject({
      type: ToastType.Warning,
      title: 'Legacy title',
      description: 'Legacy description',
      duration: 2500,
      isInfinite: true,
      button: { label: 'Install' },
    })
    mapped.button?.onClick()
    expect(open).toHaveBeenCalledWith(
      'https://example.test/install',
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('prefers the new fields and preserves the default host values', () => {
    const onClick = vi.fn()
    const mapped = mapToastToAppToast({
      title: 'New title',
      description: 'New description',
      button: { label: 'New CTA', onClick },
      asset: { symbol: 'ETH' },
      text: 'Legacy title',
      textSecondary: 'Legacy description',
    })

    expect(mapped).toEqual({
      type: ToastType.Info,
      title: 'New title',
      description: 'New description',
      button: { label: 'New CTA', onClick },
      asset: { symbol: 'ETH' },
      duration: 6000,
      isInfinite: false,
    })
  })

  it('detects legacy hash and trade-info slot content', () => {
    expect(hasLegacyToastContent({ text: 'Hash', hash: '0x123' })).toBe(true)
    expect(
      hasLegacyToastContent({
        text: 'Trade',
        tradeInfo: {
          fromToken: 'ETH',
          fromtTokenIcon: '',
          fromTokenIsStock: false,
          fromAmount: '1',
          toToken: 'USDC',
          toTokenIcon: '',
          toTokenIsStock: false,
          toAmount: '1000',
        },
      }),
    ).toBe(true)
    expect(hasLegacyToastContent({ text: 'Plain' })).toBe(false)
  })

  it('forwards legacy hash content through the AppToast default slot only when present', () => {
    setActivePinia(createPinia())
    const mountLayout = (toast: Toast) =>
      mount(ToastLayout, {
        props: { toast },
        global: {
          mocks: { $t: (key: string) => key },
          directives: { ripple: {} },
          stubs: {
            AppTokenLogo: true,
            AppTokenSymbol: true,
          },
        },
      })

    const plain = mountLayout({ text: 'Plain', isInfinite: true })
    const withHash = mountLayout({
      text: 'Transaction',
      hash: '0x123',
      isInfinite: true,
    })

    expect(plain.find('[data-testid="toast-slot"]').exists()).toBe(false)
    expect(withHash.get('[data-testid="toast-slot"]').text()).toContain('0x123')
  })

  it('keeps duration-based removal behavior in the host adapter', async () => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    const toastStore = useToastStore()
    const toast: Toast = { text: 'Timed', duration: 1200 }
    toastStore.addToastMessage(toast)

    mount(ToastLayout, {
      props: { toast },
      global: {
        stubs: {
          AppToast: {
            props: [
              'type',
              'title',
              'description',
              'duration',
              'isInfinite',
            ],
            template: '<div><slot /></div>',
          },
        },
      },
    })

    await vi.advanceTimersByTimeAsync(1199)
    expect(toastStore.messages).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(toastStore.messages).toHaveLength(0)
  })

  it('removes the intended toast after an earlier toast leaves the stack', async () => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    const toastStore = useToastStore()
    const firstToast: Toast = {
      type: ToastType.Processing,
      text: 'First',
      duration: 800,
    }
    const secondToast: Toast = { text: 'Second', duration: 1200 }
    toastStore.addToastMessage(firstToast)
    toastStore.addToastMessage(secondToast)

    const mountLayout = (toast: Toast) =>
      mount(ToastLayout, {
        props: { toast },
        global: {
          mocks: { $t: (key: string) => key },
          directives: { ripple: {} },
          stubs: {
            AppTokenLogo: true,
            AppTokenSymbol: true,
          },
        },
      })

    mountLayout(firstToast)
    mountLayout(secondToast)

    await vi.advanceTimersByTimeAsync(800)
    expect(toastStore.messages).toEqual([secondToast])
    await vi.advanceTimersByTimeAsync(400)
    expect(toastStore.messages).toHaveLength(0)
  })

  it('removes an infinite processing toast after its duration', async () => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    const toastStore = useToastStore()
    const toast: Toast = {
      type: ToastType.Processing,
      text: 'Processing',
      duration: 800,
      isInfinite: true,
    }
    toastStore.addToastMessage(toast)

    mount(ToastLayout, {
      props: { toast },
      global: {
        mocks: { $t: (key: string) => key },
        directives: { ripple: {} },
        stubs: {
          AppTokenLogo: true,
          AppTokenSymbol: true,
        },
      },
    })

    await vi.advanceTimersByTimeAsync(799)
    expect(toastStore.messages).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(toastStore.messages).toHaveLength(0)
  })

  it('keeps infinite toasts mounted', async () => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    const toastStore = useToastStore()
    const toast: Toast = { text: 'Infinite', isInfinite: true }
    toastStore.addToastMessage(toast)

    mount(ToastLayout, {
      props: { toast },
      global: {
        stubs: {
          AppToast: { template: '<div />' },
        },
      },
    })

    await vi.advanceTimersByTimeAsync(6000)
    expect(toastStore.messages).toHaveLength(1)
  })
})
