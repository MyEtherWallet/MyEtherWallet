import { describe, it, expect } from 'vitest'
import { sanitizeAmount } from '@/components/input_naked/sanitizeAmount'

describe('sanitizeAmount', () => {
  it('passes empty and clean values through', () => {
    expect(sanitizeAmount('')).toBe('')
    expect(sanitizeAmount('24')).toBe('24')
    expect(sanitizeAmount('0.')).toBe('0.')
    expect(sanitizeAmount('1.50')).toBe('1.50')
  })

  it('strips letters and symbols', () => {
    expect(sanitizeAmount('abc')).toBe('')
    expect(sanitizeAmount('12a3')).toBe('123')
    expect(sanitizeAmount('-5')).toBe('5')
  })

  it('treats a lone comma as the decimal separator', () => {
    expect(sanitizeAmount('1,5')).toBe('1.5')
  })

  it('keeps only the first separator while typing', () => {
    expect(sanitizeAmount('1.2.3')).toBe('1.23')
    expect(sanitizeAmount('1,2,')).toBe('1.2')
  })

  it('reads the last separator as decimal when both are pasted', () => {
    expect(sanitizeAmount('$1,234.50')).toBe('1234.50')
    expect(sanitizeAmount('1.234,50 €')).toBe('1234.50')
  })

  it('drops leading zeros but keeps a single zero before the decimal', () => {
    expect(sanitizeAmount('007')).toBe('7')
    expect(sanitizeAmount('000')).toBe('0')
    expect(sanitizeAmount('00.5')).toBe('0.5')
    expect(sanitizeAmount('.5')).toBe('0.5')
  })

  it('caps the decimals', () => {
    expect(sanitizeAmount('1.123456789', 6)).toBe('1.123456')
    expect(sanitizeAmount('1.5', 0)).toBe('1')
    expect(sanitizeAmount(`1.${'9'.repeat(20)}`)).toBe(`1.${'9'.repeat(18)}`)
  })
})
