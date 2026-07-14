import { describe, it, expect } from 'vitest'
import {
  takeProfitError,
  stopLossError,
} from '@/modules/perps/utils/tpSlValidation'

const MARK = 100
const DEC = 2

describe('takeProfitError (MEW-1912)', () => {
  it('returns no error when price is null (not set)', () => {
    expect(takeProfitError(null, MARK, true, DEC)).toBe('')
  })

  describe('long position (TP must be above mark)', () => {
    it('accepts a price above mark', () => {
      expect(takeProfitError(110, MARK, true, DEC)).toBe('')
    })
    it('rejects a price at or below mark', () => {
      expect(takeProfitError(100, MARK, true, DEC)).toBe(
        'Take Profit must be above mark price',
      )
      expect(takeProfitError(90, MARK, true, DEC)).toBe(
        'Take Profit must be above mark price',
      )
    })
    it('rejects zero as below mark', () => {
      expect(takeProfitError(0, MARK, true, DEC)).toBe(
        'Take Profit must be above mark price',
      )
    })
  })

  describe('short position (TP must be below mark and positive)', () => {
    it('accepts a positive price below mark', () => {
      expect(takeProfitError(90, MARK, false, DEC)).toBe('')
    })
    it('rejects zero as non-positive (the HOOD +100% case)', () => {
      expect(takeProfitError(0, MARK, false, DEC)).toBe(
        'Take Profit must be above 0',
      )
    })
    it('rejects a price at or above mark', () => {
      expect(takeProfitError(100, MARK, false, DEC)).toBe(
        'Take Profit must be below mark price',
      )
      expect(takeProfitError(110, MARK, false, DEC)).toBe(
        'Take Profit must be below mark price',
      )
    })
  })

  it('rejects prices at or above $10,000,000', () => {
    expect(takeProfitError(10_000_000, MARK, true, DEC)).toBe(
      'Take Profit must be less than $10,000,000',
    )
  })

  it('reports precision errors first', () => {
    expect(takeProfitError(110.123, MARK, true, 2)).toBe(
      'Price supports up to 2 decimal places',
    )
    expect(takeProfitError(110.1, MARK, true, 0)).toBe(
      'Price must be a whole number',
    )
  })
})

describe('stopLossError (MEW-1912)', () => {
  it('returns no error when price is null (not set)', () => {
    expect(stopLossError(null, MARK, true, DEC)).toBe('')
  })

  it('rejects a non-positive price', () => {
    expect(stopLossError(0, MARK, true, DEC)).toBe('Stop Loss must be above 0')
    expect(stopLossError(0, MARK, false, DEC)).toBe('Stop Loss must be above 0')
  })

  describe('long position (SL must be below mark)', () => {
    it('accepts a positive price below mark', () => {
      expect(stopLossError(90, MARK, true, DEC)).toBe('')
    })
    it('rejects a price at or above mark', () => {
      expect(stopLossError(100, MARK, true, DEC)).toBe(
        'Stop Loss must be below mark price',
      )
      expect(stopLossError(110, MARK, true, DEC)).toBe(
        'Stop Loss must be below mark price',
      )
    })
  })

  describe('short position (SL must be above mark)', () => {
    it('accepts a price above mark', () => {
      expect(stopLossError(110, MARK, false, DEC)).toBe('')
    })
    it('rejects a price at or below mark', () => {
      expect(stopLossError(100, MARK, false, DEC)).toBe(
        'Stop Loss must be above mark price',
      )
      expect(stopLossError(90, MARK, false, DEC)).toBe(
        'Stop Loss must be above mark price',
      )
    })
  })

  it('reports precision errors first', () => {
    expect(stopLossError(90.123, MARK, true, 2)).toBe(
      'Price supports up to 2 decimal places',
    )
  })
})
