import { describe, it, expect } from 'vitest'
import {
  formatProviderName,
  getProviderIcon,
} from '@/modules/purchase/helpers/purchaseProviders'

describe('purchaseProviders', () => {
  it('formats a provider code as a display name', () => {
    expect(formatProviderName('MOONPAY')).toBe('Moonpay')
  })

  it('maps known providers to their brand mark', () => {
    const icons = ['MOONPAY', 'SIMPLEX', 'TOPPER', 'COINBASE'].map(
      getProviderIcon,
    )
    for (const icon of icons) expect(icon).toBeTruthy()
    expect(new Set(icons).size).toBe(icons.length)
  })

  it('returns no icon for unknown or missing providers (initials fallback)', () => {
    expect(getProviderIcon('UNKNOWN')).toBeUndefined()
    expect(getProviderIcon(undefined)).toBeUndefined()
  })
})
