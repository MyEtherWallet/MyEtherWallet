import { describe, it, expect } from 'vitest'
import {
  formatOrderStatus,
  formatOrderType,
} from '@/modules/perps/utils/formatters'

// `formatOrderStatus`/`formatOrderType` now return i18n *keys* for mapped
// enum values (resolved via `$t(...)` at the call site) instead of raw
// English text — see src/modules/perps/utils/formatters.ts. For an unmapped
// value they must keep returning the raw enum unchanged, byte-identically,
// since `$t()` returns its argument verbatim when the key doesn't resolve.
describe('formatOrderStatus', () => {
  it('maps known statuses to their i18n keys', () => {
    expect(formatOrderStatus('open')).toBe('perps.order-status.open')
    expect(formatOrderStatus('fullyfilled')).toBe(
      'perps.order-status.fully-filled',
    )
    expect(formatOrderStatus('canceled')).toBe('perps.order-status.canceled')
    expect(formatOrderStatus('pending')).toBe('perps.order-status.pending')
    expect(formatOrderStatus('untriggered')).toBe(
      'perps.order-status.untriggered',
    )
  })

  it('passes through an unmapped status unchanged (raw-enum fallback)', () => {
    expect(formatOrderStatus('someNewStatus')).toBe('someNewStatus')
  })
})

describe('formatOrderType', () => {
  it('maps known types to their i18n keys', () => {
    expect(formatOrderType('limit')).toBe('perps.order-type.limit')
    expect(formatOrderType('market')).toBe('perps.order-type.market')
    expect(formatOrderType('stopMarket')).toBe('perps.order-type.stop-loss')
    expect(formatOrderType('takeProfitMarket')).toBe(
      'perps.order-type.take-profit',
    )
  })

  it('passes through an unmapped type unchanged (raw-enum fallback)', () => {
    expect(formatOrderType('someNewType')).toBe('someNewType')
  })
})
