import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ allChains: [] }),
}))

import AppToast from '@/components/toast/AppToast.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppSpinner from '@/components/spinner/AppSpinner.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import {
  TOAST_TYPES,
  TOAST_TYPES_WITH_BUTTON,
  type ToastType,
} from '@/components/toast/types'

const i18n = createI18n({ legacy: false, locale: 'en', missingWarn: false })

const mountToast = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) =>
  mount(AppToast, {
    props: {
      type: 'info',
      title: 'Title',
      description: 'Information',
      ...props,
    },
    slots,
    global: { plugins: [i18n] },
  })

describe('AppToast — design-library Toast (MEW-1975)', () => {
  it('draws the Figma box: dark info surface, 360 wide, radius 16, padding 12', () => {
    expect(mountToast().get('[data-testid="toast"]').classes()).toEqual(
      expect.arrayContaining([
        'bg-background-info',
        'w-90',
        'max-w-full',
        'rounded-16',
        'p-3',
        'gap-3',
      ]),
    )
  })

  it('leads with a spinner while processing', () => {
    const wrapper = mountToast({ type: 'processing' })
    const spinner = wrapper.findComponent(AppSpinner)
    expect(spinner.props()).toMatchObject({ size: 24, color: 'inverted' })
    expect(wrapper.findComponent(AppAvatar).exists()).toBe(false)
  })

  it('leads with the received asset and a green check after the title when completed', () => {
    const crypto = mountToast({
      type: 'transaction-completed',
      asset: { symbol: 'ETH', url: 'eth.png' },
    })
    expect(crypto.findComponent(AppAvatar).props()).toMatchObject({
      type: 'cryptoAsset',
      size: 's',
      symbol: 'ETH',
      url: 'eth.png',
    })
    expect(crypto.find('.text-icon-success').exists()).toBe(true)

    const stock = mountToast({
      type: 'transaction-completed',
      asset: { symbol: 'AAPL', isStock: true },
    })
    expect(stock.findComponent(AppAvatar).props('type')).toBe('stocks')
  })

  it('leads the status types with a toned Avatar Icon', () => {
    const tones: Record<string, string> = {
      warning: 'warning',
      success: 'success',
      error: 'error',
      info: 'info',
    }
    for (const [type, tone] of Object.entries(tones)) {
      const avatar = mountToast({ type }).findComponent(AppAvatar)
      expect(avatar.props()).toMatchObject({ type: 'icon', size: 's', tone })
    }
  })

  it('renders title and description through the inverse Content Group', () => {
    const wrapper = mountToast()
    expect(wrapper.get('[data-testid="cg-title"]').text()).toBe('Title')
    expect(wrapper.get('[data-testid="cg-title"]').classes()).toContain(
      'text-text-inverted',
    )
    expect(wrapper.get('[data-testid="cg-description"]').text()).toBe(
      'Information',
    )
  })

  it('shows the CTA only on the four Figma types and emits action', async () => {
    for (const type of TOAST_TYPES) {
      const wrapper = mountToast({ type, buttonLabel: 'Open' })
      const hasButton = TOAST_TYPES_WITH_BUTTON.includes(type as ToastType)
      expect(wrapper.findComponent(AppBaseButton).exists()).toBe(hasButton)
    }
    const wrapper = mountToast({ type: 'success', buttonLabel: 'Open' })
    const button = wrapper.findComponent(AppBaseButton)
    expect(button.props()).toMatchObject({ size: 'small', type: 'primary' })
    await button.trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('renders the default slot below the body', () => {
    const wrapper = mountToast({}, { default: '<i data-test="slot" />' })
    expect(wrapper.find('[data-test="slot"]').exists()).toBe(true)
  })

  it('always offers a contrast dismiss button that emits dismiss', async () => {
    for (const type of TOAST_TYPES) {
      expect(mountToast({ type }).find('button[aria-label]').exists()).toBe(
        true,
      )
    }
    const wrapper = mountToast({ type: 'processing' })
    const dismiss = wrapper.get('button[aria-label]')
    expect(dismiss.classes()).toContain('size-[22px]')
    expect(dismiss.classes()).toContain('text-icon-inverted')
    await dismiss.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('announces warnings and errors as alerts, the rest politely', () => {
    expect(mountToast({ type: 'error' }).attributes('role')).toBe('alert')
    expect(mountToast({ type: 'warning' }).attributes('aria-live')).toBe(
      'assertive',
    )
    expect(mountToast({ type: 'success' }).attributes('role')).toBe('status')
    expect(mountToast({ type: 'processing' }).attributes('aria-live')).toBe(
      'polite',
    )
  })
})
