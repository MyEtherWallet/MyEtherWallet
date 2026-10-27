import { describe, it, expect } from 'vitest'
import { ToastType } from '@/types/notification'
import {
  DEFAULT_TOAST_DURATION,
  isLegacyToast,
  toastAssetOf,
  toastDurationOf,
  toastTypeOf,
} from '@/modules/toast/toastMapping'

describe('toastMapping', () => {
  it('keeps only copied-value and swap-summary toasts on the legacy layout', () => {
    expect(isLegacyToast({ text: 'Copied', hash: '0xabc' })).toBe(true)
    expect(
      isLegacyToast({
        text: 'Swap done',
        tradeInfo: {
          fromToken: 'ETH',
          fromtTokenIcon: '',
          fromTokenIsStock: false,
          fromAmount: '1',
          toToken: 'USDC',
          toTokenIcon: '',
          toTokenIsStock: false,
          toAmount: '3000',
        },
      }),
    ).toBe(true)
    expect(isLegacyToast({ text: 'Plain', type: ToastType.Error })).toBe(false)
  })

  it('maps store types, defaulting to info', () => {
    expect(toastTypeOf({ text: 'a', type: ToastType.Success })).toBe('success')
    expect(toastTypeOf({ text: 'a', type: ToastType.Error })).toBe('error')
    expect(toastTypeOf({ text: 'a', type: ToastType.Warning })).toBe('warning')
    expect(toastTypeOf({ text: 'a' })).toBe('info')
  })

  it('maps trade status to processing / transaction-completed', () => {
    expect(
      toastTypeOf({ text: 'a', tradeStatus: { kind: 'processing' } }),
    ).toBe('processing')
    const completed = {
      text: 'a',
      tradeStatus: {
        kind: 'completed' as const,
        toTokenIcon: 'usdc.png',
        toSymbol: 'USDC',
        toTokenIsStock: false,
      },
    }
    expect(toastTypeOf(completed)).toBe('transaction-completed')
    expect(toastAssetOf(completed)).toEqual({
      url: 'usdc.png',
      symbol: 'USDC',
      isStock: false,
    })
    expect(toastAssetOf({ text: 'a' })).toBeUndefined()
  })

  it('keeps processing and infinite toasts until removed, others time out', () => {
    expect(
      toastDurationOf({
        text: 'a',
        duration: 1000,
        tradeStatus: { kind: 'processing' },
      }),
    ).toBeNull()
    expect(toastDurationOf({ text: 'a', isInfinite: true })).toBeNull()
    expect(toastDurationOf({ text: 'a', duration: 10000 })).toBe(10000)
    expect(toastDurationOf({ text: 'a' })).toBe(DEFAULT_TOAST_DURATION)
  })
})
