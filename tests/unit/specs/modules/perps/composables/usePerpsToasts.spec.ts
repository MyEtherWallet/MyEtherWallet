import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import { describe, it, expect, beforeEach } from 'vitest'

describe('usePerpsToasts', () => {
  let store: ReturnType<typeof useToastStore>
  let toasts: ReturnType<typeof usePerpsToasts>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useToastStore()
    toasts = usePerpsToasts()
  })

  it('toastDepositComplete includes size and coin', () => {
    toasts.toastDepositComplete('100', 'USDC')
    expect(store.messages).toHaveLength(1)
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'Deposit Complete',
      textSecondary: '100 USDC added to your Trading Account',
    })
  })

  it('toastWithdrawalComplete has no secondary text', () => {
    toasts.toastWithdrawalComplete()
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'Withdrawal Complete',
    })
    expect(store.messages[0].textSecondary).toBeUndefined()
  })

  it('toastLiquidationInitiated is warning and infinite', () => {
    toasts.toastLiquidationInitiated()
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Warning,
      text: 'Liquidation Initiated',
      isInfinite: true,
    })
    expect(store.messages[0].textSecondary).toContain('temporarily locked')
  })

  it('toastStopLossAdded formats LONG/SHORT upper-case with PERPS line', () => {
    toasts.toastStopLossAdded({
      direction: 'long',
      netQuantity: '0.5',
      base: 'ETH',
      quote: 'USD',
      triggerPrice: '1800',
    })
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'Stop Loss Added',
    })
    expect(store.messages[0].textSecondary).toMatch(/^LONG 0\.5 PERPS: ETHUSD at \$1,800\.00$/)
  })

  it('toastOrderPlaced omits " at {price}" when market order', () => {
    toasts.toastOrderPlaced({
      side: 'buy',
      size: '1',
      category: 'market',
      market: 'ETH-USD',
    })
    expect(store.messages[0].textSecondary).toBe('Long 1 Market: ETH-USD')
  })

  it('toastOrderPlaced includes formatted price for limit orders', () => {
    toasts.toastOrderPlaced({
      side: 'sell',
      size: '2',
      category: 'limit',
      market: 'BTC-USD',
      price: '65000',
    })
    expect(store.messages[0].textSecondary).toBe('Short 2 Limit: BTC-USD at $65,000.00')
  })

  it('toastOrderFilled uses Bought for long side', () => {
    toasts.toastOrderFilled({
      side: 'buy',
      filledSize: '1',
      size: '1',
      category: 'market',
      market: 'ETH-USD',
      fillPrice: '1800',
    })
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Success,
      text: 'Order Filled',
      textSecondary: 'Bought 1/1 Market: ETH-USD at $1,800.00',
    })
  })

  it('toastCancelFailedInvalidOrderId has the canonical secondary text', () => {
    toasts.toastCancelFailedInvalidOrderId()
    expect(store.messages[0]).toMatchObject({
      type: ToastType.Error,
      text: 'Cancel Failed',
      textSecondary: 'Invalid order ID',
    })
  })
})
