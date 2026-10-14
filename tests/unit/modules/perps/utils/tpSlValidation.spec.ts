import { describe, it, expect } from 'vitest'
import {
  takeProfitError,
  stopLossError,
} from '@/modules/perps/utils/tpSlValidation'

const MARK = 100
const DEC = 2

describe('takeProfitError (MEW-1912)', () => {
  it('returns no error when price is null (not set)', () => {
    expect(takeProfitError(null, MARK, true, DEC)).toBeNull()
  })

  describe('long position (TP must be above mark)', () => {
    it('accepts a price above mark', () => {
      expect(takeProfitError(110, MARK, true, DEC)).toBeNull()
    })
    it('rejects a price at or below mark', () => {
      expect(takeProfitError(100, MARK, true, DEC)).toEqual({
        key: 'perps.errors.tp-above-mark',
      })
      expect(takeProfitError(90, MARK, true, DEC)).toEqual({
        key: 'perps.errors.tp-above-mark',
      })
    })
    it('rejects zero as non-positive (backend rejects it for either side)', () => {
      expect(takeProfitError(0, MARK, true, DEC)).toEqual({
        key: 'perps.errors.tp-above-zero',
      })
    })
  })

  describe('short position (TP must be below mark and positive)', () => {
    it('accepts a positive price below mark', () => {
      expect(takeProfitError(90, MARK, false, DEC)).toBeNull()
    })
    it('rejects zero as non-positive (the HOOD +100% case)', () => {
      expect(takeProfitError(0, MARK, false, DEC)).toEqual({
        key: 'perps.errors.tp-above-zero',
      })
    })
    it('rejects a price at or above mark', () => {
      expect(takeProfitError(100, MARK, false, DEC)).toEqual({
        key: 'perps.errors.tp-below-mark',
      })
      expect(takeProfitError(110, MARK, false, DEC)).toEqual({
        key: 'perps.errors.tp-below-mark',
      })
    })
  })

  it('rejects prices at or above $10,000,000', () => {
    expect(takeProfitError(10_000_000, MARK, true, DEC)).toEqual({
      key: 'perps.errors.tp-max',
      params: { max: '$10,000,000' },
    })
  })

  it('reports precision errors first', () => {
    expect(takeProfitError(110.123, MARK, true, 2)).toEqual({
      key: 'perps.errors.price-precision-decimals',
      params: { decimals: 2 },
      plural: 2,
    })
    expect(takeProfitError(110.1, MARK, true, 0)).toEqual({
      key: 'perps.errors.price-whole',
    })
  })
})

describe('stopLossError (MEW-1912)', () => {
  it('returns no error when price is null (not set)', () => {
    expect(stopLossError(null, MARK, true, DEC)).toBeNull()
  })

  it('rejects a non-positive price', () => {
    expect(stopLossError(0, MARK, true, DEC)).toEqual({
      key: 'perps.errors.sl-above-zero',
    })
    expect(stopLossError(0, MARK, false, DEC)).toEqual({
      key: 'perps.errors.sl-above-zero',
    })
  })

  describe('long position (SL must be below mark)', () => {
    it('accepts a positive price below mark', () => {
      expect(stopLossError(90, MARK, true, DEC)).toBeNull()
    })
    it('rejects a price at or above mark', () => {
      expect(stopLossError(100, MARK, true, DEC)).toEqual({
        key: 'perps.errors.sl-below-mark',
      })
      expect(stopLossError(110, MARK, true, DEC)).toEqual({
        key: 'perps.errors.sl-below-mark',
      })
    })
  })

  describe('short position (SL must be above mark)', () => {
    it('accepts a price above mark', () => {
      expect(stopLossError(110, MARK, false, DEC)).toBeNull()
    })
    it('rejects a price at or below mark', () => {
      expect(stopLossError(100, MARK, false, DEC)).toEqual({
        key: 'perps.errors.sl-above-mark',
      })
      expect(stopLossError(90, MARK, false, DEC)).toEqual({
        key: 'perps.errors.sl-above-mark',
      })
    })
  })

  it('reports precision errors first', () => {
    expect(stopLossError(90.123, MARK, true, 2)).toEqual({
      key: 'perps.errors.price-precision-decimals',
      params: { decimals: 2 },
      plural: 2,
    })
  })
})
