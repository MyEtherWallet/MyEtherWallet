import { describe, it, expect } from 'vitest'

// Namespaces touched by the MEW-1993 "localize missing strings" sweep.
import enSettings from '@/i18n/locales/settings/en.json'
import esSettings from '@/i18n/locales/settings/es.json'
import zhSettings from '@/i18n/locales/settings/zh.json'
import enStocks from '@/i18n/locales/stocks/en.json'
import esStocks from '@/i18n/locales/stocks/es.json'
import zhStocks from '@/i18n/locales/stocks/zh.json'
import enPortfolio from '@/i18n/locales/portfolio/en.json'
import esPortfolio from '@/i18n/locales/portfolio/es.json'
import zhPortfolio from '@/i18n/locales/portfolio/zh.json'
import enSend from '@/i18n/locales/send/en.json'
import esSend from '@/i18n/locales/send/es.json'
import zhSend from '@/i18n/locales/send/zh.json'
import enSwap from '@/i18n/locales/swap/en.json'
import esSwap from '@/i18n/locales/swap/es.json'
import zhSwap from '@/i18n/locales/swap/zh.json'
import enPurchase from '@/i18n/locales/purchase/en.json'
import esPurchase from '@/i18n/locales/purchase/es.json'
import zhPurchase from '@/i18n/locales/purchase/zh.json'
import enAccess from '@/i18n/locales/access/en.json'
import esAccess from '@/i18n/locales/access/es.json'
import zhAccess from '@/i18n/locales/access/zh.json'
import enAccessWallet from '@/i18n/locales/access_wallet/en.json'
import esAccessWallet from '@/i18n/locales/access_wallet/es.json'
import zhAccessWallet from '@/i18n/locales/access_wallet/zh.json'
import enTrade from '@/i18n/locales/trade/en.json'
import esTrade from '@/i18n/locales/trade/es.json'
import zhTrade from '@/i18n/locales/trade/zh.json'
import enCommon from '@/i18n/locales/common/en.json'
import esCommon from '@/i18n/locales/common/es.json'
import zhCommon from '@/i18n/locales/common/zh.json'

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

/**
 * Keys that were ALREADY missing from es/zh on the base branch (verified via
 * `git show HEAD:.../common/{en,es,zh}.json`). Not introduced by this sweep;
 * `common.perps`/`common.perpetuals` belong to the perps feature, localized
 * en-only and separately. Logged in workspace FOLLOWUPS.md. Excluded here so
 * the guard asserts THIS branch introduced no new drift.
 */
const PREEXISTING_DRIFT: Record<string, Set<string>> = {
  common: new Set([
    'buy',
    'sell',
    'perps',
    'perpetuals',
    'select_token.recently_viewed',
  ]),
}

const suites = [
  { name: 'settings', en: enSettings, es: esSettings, zh: zhSettings },
  { name: 'stocks', en: enStocks, es: esStocks, zh: zhStocks },
  { name: 'portfolio', en: enPortfolio, es: esPortfolio, zh: zhPortfolio },
  { name: 'send', en: enSend, es: esSend, zh: zhSend },
  { name: 'swap', en: enSwap, es: esSwap, zh: zhSwap },
  { name: 'purchase', en: enPurchase, es: esPurchase, zh: zhPurchase },
  { name: 'access', en: enAccess, es: esAccess, zh: zhAccess },
  {
    name: 'access_wallet',
    en: enAccessWallet,
    es: esAccessWallet,
    zh: zhAccessWallet,
  },
  { name: 'trade', en: enTrade, es: esTrade, zh: zhTrade },
  { name: 'common', en: enCommon, es: esCommon, zh: zhCommon },
] as const

describe.each(suites)('$name localization parity', ({ name, en, es, zh }) => {
  const allow = PREEXISTING_DRIFT[name] ?? new Set<string>()
  const enFlat = flatten(en as Dict)
  const esFlat = flatten(es as Dict)
  const zhFlat = flatten(zh as Dict)
  // Compare against the source keys minus known pre-existing drift.
  const enKeys = Object.keys(enFlat)
    .filter(k => !allow.has(k))
    .sort()

  it('English source has keys', () => {
    expect(enKeys.length).toBeGreaterThan(0)
  })

  it('Spanish covers every English key', () => {
    for (const key of enKeys) {
      expect(esFlat, `es missing ${name}.${key}`).toHaveProperty([key])
    }
  })

  it('Chinese covers every English key', () => {
    for (const key of enKeys) {
      expect(zhFlat, `zh missing ${name}.${key}`).toHaveProperty([key])
    }
  })

  it('every key resolves to a non-empty string in all locales', () => {
    for (const key of enKeys) {
      expect(enFlat[key].trim(), `en.${key}`).not.toBe('')
      expect((esFlat[key] ?? '').trim(), `es.${key}`).not.toBe('')
      expect((zhFlat[key] ?? '').trim(), `zh.${key}`).not.toBe('')
    }
  })

  it('interpolation placeholders match English in every locale', () => {
    for (const key of enKeys) {
      if (esFlat[key] === undefined || zhFlat[key] === undefined) continue
      const expected = placeholders(enFlat[key])
      expect(placeholders(esFlat[key]), `es.${key}`).toEqual(expected)
      expect(placeholders(zhFlat[key]), `zh.${key}`).toEqual(expected)
    }
  })
})

describe('newly extracted strings are actually translated (not English copies)', () => {
  const cases: Array<[string, Dict, Dict, Dict]> = [
    ['settings.fee_option.economy.label', enSettings, esSettings, zhSettings],
    ['settings.fee_option.recommended.description', enSettings, esSettings, zhSettings],
    ['stocks.about', enStocks, esStocks, zhStocks],
    ['stocks.statistics', enStocks, esStocks, zhStocks],
    ['portfolio.no_balance.title', enPortfolio, esPortfolio, zhPortfolio],
    ['portfolio.welcome.title', enPortfolio, esPortfolio, zhPortfolio],
    ['purchase.min', enPurchase, esPurchase, zhPurchase],
    ['purchase.bank', enPurchase, esPurchase, zhPurchase],
  ]
  it.each(cases)('%s differs from English in es and zh', (key, en, es, zh) => {
    const enFlat = flatten(en as Dict)
    const esFlat = flatten(es as Dict)
    const zhFlat = flatten(zh as Dict)
    expect(esFlat[key], `es.${key}`).not.toBe(enFlat[key])
    expect(zhFlat[key], `zh.${key}`).not.toBe(enFlat[key])
  })
})
