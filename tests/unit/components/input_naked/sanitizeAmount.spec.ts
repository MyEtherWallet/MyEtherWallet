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

  it('keeps only the first separator when the rest is not a grouping', () => {
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

  describe('a pasted value', () => {
    it.each([
      ['1,234', '1234'],
      ['12,345', '12345'],
      ['10,000', '10000'],
      ['1,234,567', '1234567'],
      ['1.234.567', '1234567'],
      // Lakh grouping: twos, then a final three.
      ['1,00,000', '100000'],
      ['12,34,567', '1234567'],
      ['1,23,45,678', '12345678'],
    ])('reads %s as a thousands-grouped whole number', (raw, want) => {
      expect(sanitizeAmount(raw)).toBe(want)
    })

    it.each([
      ['1,234.56', '1234.56'],
      ['12,947,536.12', '12947536.12'],
      ['1.234,56', '1234.56'],
      ['12.947.536,12', '12947536.12'],
      ['01,234.50', '1234.50'],
      // Groups are not always threes (Indian numbering).
      ['1,23,456.78', '123456.78'],
      ['10,00,000.00', '1000000.00'],
      ['1.23.456,78', '123456.78'],
    ])('reads %s as a grouped amount with a decimal part', (raw, want) => {
      expect(sanitizeAmount(raw)).toBe(want)
    })

    it.each([
      ['1,5', '1.5'],
      ['0,0001', '0.0001'],
      ['1,25', '1.25'],
      ['0,123', '0.123'],
      ['1,2345', '1.2345'],
    ])('reads the comma in %s as the decimal point', (raw, want) => {
      expect(sanitizeAmount(raw)).toBe(want)
    })

    it.each([
      ['1.5,', '1.5'],
      ['12.34,', '12.34'],
      ['0.05,', '0.05'],
      ['0.25,3', '0.253'],
      ['1.5,0', '1.50'],
    ])(
      'keeps the first separator of %s as the decimal point when the rest is not a grouping',
      (raw, want) => {
        expect(sanitizeAmount(raw)).toBe(want)
      },
    )

    it.each([
      ['0.125,', '0.125'],
      ['0,125.', '0.125'],
      ['0.005,', '0.005'],
      ['1.234,', '1.234'],
      ['1,234.', '1234'],
      ['1,234.56,', '1234.56'],
    ])(
      'reads the last character of %s as punctuation, not a decimal point',
      (raw, want) => {
        expect(sanitizeAmount(raw)).toBe(want)
      },
    )

    it('does not take a lone zero for a thousands group', () => {
      expect(sanitizeAmount('0,125.5')).toBe('0.1255')
    })

    it.each(['1e5', '1e-7', '2.5E-05', '1.5e3', '251e-7'])(
      'rejects exponent notation %s instead of collapsing it into digits',
      raw => {
        expect(sanitizeAmount(raw)).toBeNull()
      },
    )
  })

  describe('a typed character', () => {
    const typed = (raw: string, separatorAt?: number, maxDecimals = 18) =>
      sanitizeAmount(raw, maxDecimals, { kind: 'typing', separatorAt })

    it.each([
      ['12.34,', 5, '12.34'],
      ['0.05,', 4, '0.05'],
      ['1.5.', 3, '1.5'],
      // Each of these would read as a grouped amount if it were a paste.
      ['1.234,', 5, '1.234'],
      ['1.234,5', 5, '1.2345'],
      ['1,234.5', 1, '1234.5'],
      // Typed over a selected digit.
      ['1,34.5', 1, '134.5'],
      ['1.234.678', 5, '1.234678'],
    ])(
      'ignores the separator typed into %s, which already has a decimal point',
      (raw, separatorAt, want) => {
        expect(typed(raw, separatorAt)).toBe(want)
      },
    )

    it.each([
      ['1,', 1, '1.'],
      [',5', 0, '0.5'],
      ['.', 0, '0.'],
      // Three digits from the end, where a pasted comma is a thousands mark.
      // Also what typing a comma over the dot of "1.234" leaves behind.
      ['1,234', 1, '1.234'],
      ['12,345', 2, '12.345'],
      ['123,567', 3, '123.567'],
    ])(
      'takes the separator typed into %s as the decimal point',
      (raw, separatorAt, want) => {
        expect(typed(raw, separatorAt)).toBe(want)
      },
    )

    it('ignores a separator typed into a whole-number field', () => {
      expect(typed('1,5', 1, 0)).toBe('15')
    })

    it.each([
      ['1e', '1'],
      ['1e5', '15'],
      ['12a3', '123'],
    ])(
      'strips the letter typed into %s without clearing the field',
      (raw, want) => {
        expect(typed(raw)).toBe(want)
      },
    )

    it('never reads a separator already in the field as a thousands mark', () => {
      // A keyboard re-committing its composing text hands back the comma.
      expect(typed('1,500')).toBe('1.500')
      expect(typed('1.2.3')).toBe('1.23')
    })

    it('drops a comma that was not located when the value has a decimal point', () => {
      expect(typed('1,2.34')).toBe('12.34')
    })
  })
})
