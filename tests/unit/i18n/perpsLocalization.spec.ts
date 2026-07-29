import { describe, it, expect } from 'vitest'

// perps module locales (MEW-2012 es/zh pass)
import enPerps from '@/i18n/locales/perps/en.json'
import esPerps from '@/i18n/locales/perps/es.json'
import zhPerps from '@/i18n/locales/perps/zh.json'

type Dict = Record<string, unknown>

/** Flatten a nested translation object into dot-notation keys (preserve leaf type). */
const flatten = (obj: Dict, prefix = '', acc: Record<string, unknown> = {}) => {
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    const nextKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value as Dict, nextKey, acc)
    } else {
      acc[nextKey] = value
    }
  }
  return acc
}

const asString = (v: unknown): string => (typeof v === 'string' ? v : '')

/** {named} interpolation placeholders. */
const placeholders = (v: string) =>
  [...v.matchAll(/\{[a-zA-Z0-9_]+\}/g)].map(m => m[0]).sort()

/** Number of vue-i18n pluralization branches (separated by `|`). */
const pluralForms = (v: string) => v.split('|').length

const enFlat = flatten(enPerps as Dict)
const esFlat = flatten(esPerps as Dict)
const zhFlat = flatten(zhPerps as Dict)
const enKeys = Object.keys(enFlat).sort()

describe('perps localization parity (en/es/zh)', () => {
  it('English source has keys', () => {
    expect(enKeys.length).toBeGreaterThan(0)
  })

  it('Spanish key set matches English exactly (both directions)', () => {
    expect(Object.keys(esFlat).sort()).toEqual(enKeys)
  })

  it('Chinese key set matches English exactly (both directions)', () => {
    expect(Object.keys(zhFlat).sort()).toEqual(enKeys)
  })

  it('every key resolves to a non-empty string in all locales', () => {
    for (const key of enKeys) {
      expect(typeof enFlat[key], `en.${key}`).toBe('string')
      expect(asString(enFlat[key]).trim(), `en.${key}`).not.toBe('')
      expect(asString(esFlat[key]).trim(), `es.${key}`).not.toBe('')
      expect(asString(zhFlat[key]).trim(), `zh.${key}`).not.toBe('')
    }
  })

  it('interpolation placeholders match English in every locale', () => {
    for (const key of enKeys) {
      const expected = placeholders(asString(enFlat[key]))
      expect(placeholders(asString(esFlat[key])), `es.${key}`).toEqual(expected)
      expect(placeholders(asString(zhFlat[key])), `zh.${key}`).toEqual(expected)
    }
  })

  it('pluralization branch count matches English (es and zh)', () => {
    for (const key of enKeys) {
      const expected = pluralForms(asString(enFlat[key]))
      expect(pluralForms(asString(esFlat[key])), `es.${key}`).toBe(expected)
      expect(pluralForms(asString(zhFlat[key])), `zh.${key}`).toBe(expected)
    }
  })
})

describe('perps strings are actually translated (not English copies)', () => {
  const cases = [
    'errors.tp-above-mark',
    'errors.invalid-price',
    'confirm.title',
    'deposit.title',
    'market-list.title',
    'balance.title',
  ]
  it.each(cases)('perps.%s differs from English in es and zh', key => {
    const full = `perps.${key}`
    expect(esFlat[full], `es.${full}`).not.toBe(enFlat[full])
    expect(zhFlat[full], `zh.${full}`).not.toBe(enFlat[full])
  })
})
