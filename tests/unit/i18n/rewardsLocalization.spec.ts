import { describe, it, expect } from 'vitest'

// rewards module locales
import enRewards from '@/i18n/locales/rewards/en.json'
import esRewards from '@/i18n/locales/rewards/es.json'
import zhRewards from '@/i18n/locales/rewards/zh.json'
// rwaRewards module locales
import enRwa from '@/i18n/locales/rwaRewards/en.json'
import esRwa from '@/i18n/locales/rwaRewards/es.json'
import zhRwa from '@/i18n/locales/rwaRewards/zh.json'

type Dict = Record<string, unknown>

/** Flatten a nested translation object into dot-notation keys. */
const flatten = (obj: Dict, prefix = '', acc: Record<string, string> = {}) => {
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    const nextKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value as Dict, nextKey, acc)
    } else {
      acc[nextKey] = String(value)
    }
  }
  return acc
}

/** Extract the set of {named} interpolation placeholders from a string. */
const placeholders = (value: string) =>
  [...value.matchAll(/\{[a-zA-Z0-9_]+\}/g)].map(m => m[0]).sort()

/** Number of pluralization branches (vue-i18n uses `|` as the separator). */
const pluralForms = (value: string) => value.split('|').length

const suites = [
  { name: 'rewards', en: enRewards, es: esRewards, zh: zhRewards },
  { name: 'rwaRewards', en: enRwa, es: esRwa, zh: zhRwa },
] as const

describe.each(suites)('$name localization parity', ({ en, es, zh }) => {
  const enFlat = flatten(en as Dict)
  const esFlat = flatten(es as Dict)
  const zhFlat = flatten(zh as Dict)
  const enKeys = Object.keys(enFlat).sort()

  it('English source has keys', () => {
    expect(enKeys.length).toBeGreaterThan(0)
  })

  it('Spanish has exactly the same keys as English', () => {
    expect(Object.keys(esFlat).sort()).toEqual(enKeys)
  })

  it('Chinese has exactly the same keys as English', () => {
    expect(Object.keys(zhFlat).sort()).toEqual(enKeys)
  })

  it('every key resolves to a non-empty string in all locales', () => {
    for (const key of enKeys) {
      expect(enFlat[key].trim(), `en.${key}`).not.toBe('')
      expect(esFlat[key].trim(), `es.${key}`).not.toBe('')
      expect(zhFlat[key].trim(), `zh.${key}`).not.toBe('')
    }
  })

  it('interpolation placeholders match English in every locale', () => {
    for (const key of enKeys) {
      const expected = placeholders(enFlat[key])
      expect(placeholders(esFlat[key]), `es.${key}`).toEqual(expected)
      expect(placeholders(zhFlat[key]), `zh.${key}`).toEqual(expected)
    }
  })

  it('Spanish preserves the same number of pluralization branches', () => {
    for (const key of enKeys) {
      expect(pluralForms(esFlat[key]), `es.${key}`).toBe(
        pluralForms(enFlat[key]),
      )
    }
  })
})

describe('translations are actually translated (not English copies)', () => {
  it('rewards: newly extracted keys are localized', () => {
    const es = flatten(esRewards as Dict)
    const zh = flatten(zhRewards as Dict)
    const en = flatten(enRewards as Dict)
    for (const key of ['rewards.coming_soon_title', 'rewards.get_ready']) {
      expect(es[key]).not.toBe(en[key])
      expect(zh[key]).not.toBe(en[key])
    }
  })

  it('rwaRewards: es/zh differ from English for representative keys', () => {
    const es = flatten(esRwa as Dict)
    const zh = flatten(zhRwa as Dict)
    const en = flatten(enRwa as Dict)
    for (const key of ['rwaRewards.section_title', 'rwaRewards.claim']) {
      expect(es[key]).not.toBe(en[key])
      expect(zh[key]).not.toBe(en[key])
    }
  })
})
