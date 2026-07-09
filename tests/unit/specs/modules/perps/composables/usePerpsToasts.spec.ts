import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// `usePerpsToasts` calls `useI18n()` synchronously in setup context. Mock it
// so tests assert on the i18n *keys* + params passed to `t`, not on
// hardcoded English sentences (those now live in `perps/en.json`).
// The mock echoes `key` when there are no params, or `key::<json params>`
// when there are, so assertions can check the resolved string without
// depending on real vue-i18n message resolution.
function mockT(key: string, params?: Record<string, unknown>): string {
  return params ? `${key}::${JSON.stringify(params)}` : key
}

const t = vi.fn(mockT)

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t }),
}))

describe('usePerpsToasts', () => {
  let store: ReturnType<typeof useToastStore>
  let toasts: ReturnType<typeof usePerpsToasts>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useToastStore()
    toasts = usePerpsToasts()
    t.mockClear()
  })

  const lastCall = () => {
    const idx = t.mock.calls.length - 1
    return { key: t.mock.calls[idx][0], params: t.mock.calls[idx][1] }
  }

  it('toastDepositComplete includes size and coin', () => {
    toasts.toastDepositComplete('100', 'USDC')
    expect(store.messages).toHaveLength(1)
    expect(t).toHaveBeenCalledWith('perps.toast.deposit-complete-title')
    expect(t).toHaveBeenCalledWith('perps.toast.deposit-complete-detail', {
      size: '100',
      coin: 'USDC',
    })
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'perps.toast.deposit-complete-title',
      textSecondary: mockT('perps.toast.deposit-complete-detail', {
        size: '100',
        coin: 'USDC',
      }),
    })
  })

  it('toastWithdrawalComplete has no secondary text', () => {
    toasts.toastWithdrawalComplete()
    expect(t).toHaveBeenCalledWith('perps.toast.withdrawal-complete-title')
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'perps.toast.withdrawal-complete-title',
    })
    expect(store.messages[0].textSecondary).toBeUndefined()
  })

  it('toastLiquidationInitiated is warning and infinite', () => {
    toasts.toastLiquidationInitiated()
    expect(t).toHaveBeenCalledWith('perps.toast.liquidation-initiated')
    expect(t).toHaveBeenCalledWith('perps.toast.liquidation-initiated-detail')
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Warning,
      text: 'perps.toast.liquidation-initiated',
      textSecondary: 'perps.toast.liquidation-initiated-detail',
      isInfinite: true,
    })
  })

  it('toastStopLossAdded resolves the sl-tp-line key with LONG upper-cased side + formatted price', () => {
    toasts.toastStopLossAdded({
      direction: 'long',
      netQuantity: '0.5',
      base: 'ETH',
      quote: 'USD',
      triggerPrice: '1800',
    })
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'perps.toast.stop-loss-added-title',
    })
    const { key, params } = lastCall()
    expect(key).toBe('perps.toast.sl-tp-line')
    expect(params).toMatchObject({
      side: 'LONG',
      netQuantity: '0.5',
      base: 'ETH',
      quote: 'USD',
    })
    expect(params?.price).toMatch(/^\$1,800\.00$/)
    expect(store.messages[0].textSecondary).toBe(mockT(key, params))
  })

  it('toastOrderPlaced resolves the price-less order-line key for market orders', () => {
    toasts.toastOrderPlaced({
      side: 'buy',
      size: '1',
      category: 'market',
      market: 'ETH-USD',
    })
    const { key, params } = lastCall()
    expect(key).toBe('perps.toast.order-line')
    expect(params).toEqual({
      side: 'Long',
      size: '1',
      category: 'Market',
      market: 'ETH-USD',
    })
    expect(store.messages[0].textSecondary).toBe(mockT(key, params))
  })

  it('toastOrderPlaced resolves the order-line-with-price key for limit orders', () => {
    toasts.toastOrderPlaced({
      side: 'sell',
      size: '2',
      category: 'limit',
      market: 'BTC-USD',
      price: '65000',
    })
    const { key, params } = lastCall()
    expect(key).toBe('perps.toast.order-line-with-price')
    expect(params).toMatchObject({
      side: 'Short',
      size: '2',
      category: 'Limit',
      market: 'BTC-USD',
    })
    expect(params?.price).toMatch(/^\$65,000\.00$/)
    expect(store.messages[0].textSecondary).toBe(mockT(key, params))
  })

  it('toastOrderFilled resolves the fill-line key with "Bought" verb for long side', () => {
    toasts.toastOrderFilled({
      side: 'buy',
      filledSize: '1',
      size: '1',
      category: 'market',
      market: 'ETH-USD',
      fillPrice: '1800',
    })
    const { key, params } = lastCall()
    expect(key).toBe('perps.toast.fill-line')
    expect(params).toMatchObject({
      verb: 'Bought',
      filledSize: '1',
      size: '1',
      category: 'Market',
      market: 'ETH-USD',
    })
    expect(params?.price).toMatch(/^\$1,800\.00$/)
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'perps.toast.order-filled-title',
      textSecondary: mockT(key, params),
    })
  })

  it('toastCancelFailedInvalidOrderId resolves the canonical title + detail keys', () => {
    toasts.toastCancelFailedInvalidOrderId()
    expect(t).toHaveBeenCalledWith('perps.toast.cancel-failed-title')
    expect(t).toHaveBeenCalledWith('perps.toast.cancel-failed-invalid-id')
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Error,
      text: 'perps.toast.cancel-failed-title',
      textSecondary: 'perps.toast.cancel-failed-invalid-id',
    })
  })
})
