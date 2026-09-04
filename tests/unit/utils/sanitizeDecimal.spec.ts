import { describe, it, expect } from 'vitest'
import { sanitizeDecimal } from '@/utils/sanitizeDecimal'

describe('sanitizeDecimal', () => {
  it.each([
    ['1.5', '1.5'],
    ['0.0001', '0.0001'],
    ['12947536', '12947536'],
    ['1.', '1.'],
    ['.5', '.5'],
  ])('keeps a plain decimal %s intact', (input, expected) => {
    expect(sanitizeDecimal(input)).toBe(expected)
  })

  it('treats a single comma as the decimal separator only when it cannot be a 3-digit thousands group', () => {
    expect(sanitizeDecimal('1,5')).toBe('1.5')
    expect(sanitizeDecimal('0,0001')).toBe('0.0001')
    expect(sanitizeDecimal('1,25')).toBe('1.25')
  })

  it('treats a single comma followed by exactly 3 digits as a thousands separator', () => {
    expect(sanitizeDecimal('1,234')).toBe('1234')
    expect(sanitizeDecimal('12,345')).toBe('12345')
  })

  it('treats commas as thousands separators when a dot is present', () => {
    expect(sanitizeDecimal('1,234.56')).toBe('1234.56')
    expect(sanitizeDecimal('12,947,536.12')).toBe('12947536.12')
  })

  it('treats multiple commas without a dot as thousands separators', () => {
    expect(sanitizeDecimal('1,234,567')).toBe('1234567')
  })

  it('collapses extra dots into the first one', () => {
    expect(sanitizeDecimal('1.2.3')).toBe('1.23')
  })

  it('strips every other non-numeric character', () => {
    expect(sanitizeDecimal('$1a2b3!')).toBe('123')
    expect(sanitizeDecimal('1 000.5')).toBe('1000.5')
  })
})
