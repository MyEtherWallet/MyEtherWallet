import { describe, it, expect } from 'vitest'
import {
  formatProviderName,
  getProviderIcon,
} from '@/modules/purchase/helpers/purchaseProviders'
import moonpayIcon from '@/assets/images/buy/providers/moonpay.svg'
import simplexIcon from '@/assets/images/buy/providers/simplex.svg'
import topperIcon from '@/assets/images/buy/providers/topper.svg'
import coinbaseIcon from '@/assets/images/buy/providers/coinbase.svg'

describe('purchaseProviders', () => {
  it('formats a provider code as a display name', () => {
    expect(formatProviderName('MOONPAY')).toBe('Moonpay')
  })

  it('maps known providers to their brand mark', () => {
    expect(getProviderIcon('MOONPAY')).toBe(moonpayIcon)
    expect(getProviderIcon('SIMPLEX')).toBe(simplexIcon)
    expect(getProviderIcon('TOPPER')).toBe(topperIcon)
    expect(getProviderIcon('COINBASE')).toBe(coinbaseIcon)
  })

  it('returns no icon for unknown or missing providers (initials fallback)', () => {
    expect(getProviderIcon('UNKNOWN')).toBeUndefined()
    expect(getProviderIcon(undefined)).toBeUndefined()
  })
})
