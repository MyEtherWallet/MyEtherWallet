import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/solid'
import AppToast from '@/components/AppToast.vue'
import { ToastType } from '@/types/notification'

const button = {
  label: 'View details',
  onClick: vi.fn(),
}

const mountToast = (
  type: ToastType,
  extraProps: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) =>
  mount(AppToast, {
    props: {
      type,
      title: 'Toast title',
      description: 'Toast description',
      ...extraProps,
    },
    slots,
    global: {
      mocks: { $t: (key: string) => key },
      directives: { ripple: {} },
      stubs: {
        AppTokenLogo: {
          props: ['url', 'symbol', 'isStock'],
          template: '<div data-testid="token-logo" />',
        },
      },
    },
  })

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('AppToast', () => {
  it('preserves centered fluid sizing below the xs breakpoint', () => {
    const wrapper = mountToast(ToastType.Info)

    expect(wrapper.get('[data-testid="app-toast"].w-\\[95\\%\\]')).toBeTruthy()
    expect(wrapper.get('[data-testid="app-toast"].mx-auto')).toBeTruthy()
    expect(wrapper.get('[data-testid="app-toast"].xs\\:w-\\[360px\\]')).toBeTruthy()
  })

  it.each([
    [ToastType.Warning, ExclamationCircleIcon],
    [ToastType.Error, ExclamationCircleIcon],
    [ToastType.Success, CheckCircleIcon],
    [ToastType.Info, InformationCircleIcon],
  ])('renders the correct status icon for %s', (type, expectedIcon) => {
    const wrapper = mountToast(type)

    expect(wrapper.findComponent(expectedIcon).exists()).toBe(true)
    expect(wrapper.find('[data-testid="toast-spinner"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="toast-asset"]').exists()).toBe(false)
  })

  it('renders a spinner for processing', () => {
    const wrapper = mountToast(ToastType.Processing)

    expect(wrapper.get('[data-testid="toast-spinner"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="toast-status-icon"]').exists()).toBe(false)
  })

  it('renders the asset avatar and inline filled check for a completed transaction', () => {
    const wrapper = mountToast(ToastType.TransactionCompleted, {
      asset: { url: 'https://example.test/eth.png', symbol: 'ETH' },
    })

    expect(wrapper.get('[data-testid="toast-asset"]').exists()).toBe(true)
    expect(wrapper.find('svg.h-4.w-4.text-success').exists()).toBe(true)
  })

  it.each([
    ToastType.Warning,
    ToastType.Success,
    ToastType.Error,
    ToastType.TransactionCompleted,
  ])('renders and invokes the CTA for %s', async type => {
    const wrapper = mountToast(type, { button })

    await wrapper.get('[data-testid="toast-cta"]').trigger('click')
    expect(button.onClick).toHaveBeenCalledOnce()
  })

  it.each([ToastType.Processing, ToastType.Info])(
    'does not render a CTA for %s',
    type => {
      const wrapper = mountToast(type, { button })

      expect(wrapper.find('[data-testid="toast-cta"]').exists()).toBe(false)
    },
  )

  it('hides dismiss and auto-dismisses processing even when marked infinite', async () => {
    vi.useFakeTimers()
    const wrapper = mountToast(ToastType.Processing, { isInfinite: true })

    expect(wrapper.find('[data-testid="toast-dismiss"]').exists()).toBe(false)
    await vi.advanceTimersByTimeAsync(5999)
    expect(wrapper.emitted('dismiss')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(1)
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it.each([
    ToastType.TransactionCompleted,
    ToastType.Warning,
    ToastType.Success,
    ToastType.Error,
    ToastType.Info,
  ])('emits dismiss from the dismiss button for %s', async type => {
    const wrapper = mountToast(type)

    await wrapper.get('[data-testid="toast-dismiss"]').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('renders default slot content below the body only when supplied', () => {
    const withoutSlot = mountToast(ToastType.Info)
    const withSlot = mountToast(
      ToastType.Info,
      {},
      { default: '<div data-testid="custom-content">Details</div>' },
    )

    expect(withoutSlot.find('[data-testid="toast-slot"]').exists()).toBe(false)
    expect(withSlot.get('[data-testid="toast-slot"]').text()).toContain(
      'Details',
    )
  })
})
