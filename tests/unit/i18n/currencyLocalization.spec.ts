import { describe, it, expect, vi } from 'vitest'

// currencyStore pulls in purchaseStore -> walletStore (Ledger) and the eager
// analytics/Sentry instances at import time; none of that is needed to read the
// SUPPORTED_CURRENCIES constant, so stub the heavy deps out.
vi.mock('@/stores/purchaseStore', () => ({ usePurchaseStore: () => ({}) }))
vi.mock('@/analytics', () => ({ analytics: {} }))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))

import { SUPPORTED_CURRENCIES } from '@/stores/currencyStore'
import enSettings from '@/i18n/locales/settings/en.json'
import esSettings from '@/i18n/locales/settings/es.json'
import zhSettings from '@/i18n/locales/settings/zh.json'

type Dict = Record<string, unknown>

const countryNames = (settings: Dict) =>
  ((settings.settings as Dict).currency_country ?? {}) as Record<string, string>

const codes = SUPPORTED_CURRENCIES.map(c => c.code)

/**
 * MEW-2391 — the "Select currency" popup (TheSettingsPopup.vue) renders the
 * title, the description and each currency's country/region label. All three
 * pieces are localized via i18n; the country label comes from
 * `settings.currency_country.<code>`, derived from the currency code. This
 * guards the store <-> i18n contract that vue-tsc cannot see (t() takes any
 * string), so a currency added to the store without its translation — or a
 * stale country key — fails here instead of shipping a raw key to the popup.
 */
describe('currency selector localization (MEW-2391)', () => {
  const locales = [
    ['en', enSettings],
    ['es', esSettings],
    ['zh', zhSettings],
  ] as const

  it.each(locales)('%s has the popup title and description', (_lang, s) => {
    const settings = (s as Dict).settings as Dict
    expect(typeof settings.select_currency).toBe('string')
    expect((settings.select_currency as string).trim()).not.toBe('')
    expect(typeof settings.currency_description).toBe('string')
    expect((settings.currency_description as string).trim()).not.toBe('')
  })

  it.each(locales)(
    '%s has a non-empty country label for every supported currency',
    (_lang, s) => {
      const names = countryNames(s as Dict)
      for (const code of codes) {
        expect(typeof names[code], `${_lang}.currency_country.${code}`).toBe(
          'string',
        )
        expect(
          (names[code] ?? '').trim(),
          `${_lang}.currency_country.${code}`,
        ).not.toBe('')
      }
    },
  )

  it('country label key set matches the supported currency codes exactly', () => {
    expect(Object.keys(countryNames(enSettings as Dict)).sort()).toEqual(
      [...codes].sort(),
    )
  })

  it('title and description are actually translated (not English copies)', () => {
    const en = (enSettings as Dict).settings as Dict
    for (const [, s] of locales.filter(([lang]) => lang !== 'en')) {
      const t = (s as Dict).settings as Dict
      expect(t.select_currency).not.toBe(en.select_currency)
      expect(t.currency_description).not.toBe(en.currency_description)
    }
    // Country names can legitimately coincide with English (e.g. "Australia"),
    // but a translated locale like zh must not mirror English verbatim.
    expect(countryNames(zhSettings as Dict).USD).not.toBe(
      countryNames(enSettings as Dict).USD,
    )
  })
})
