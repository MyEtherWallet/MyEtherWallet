import { describe, expect, it } from 'vitest'
import messages from '@/i18n/locales'

const LOCALES = ['en', 'es', 'zh'] as const

const flatten = (
  value: Record<string, unknown>,
  prefix = '',
): Record<string, string> =>
  Object.entries(value).reduce<Record<string, string>>((result, [key, item]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (item && typeof item === 'object') {
      Object.assign(result, flatten(item as Record<string, unknown>, path))
    } else if (typeof item === 'string') {
      result[path] = item
    }
    return result
  }, {})

const placeholders = (value: string): string[] =>
  [...value.matchAll(/\{[a-zA-Z0-9_]+\}/g)].map(match => match[0]).sort()

describe('development preview localization', () => {
  const localized = Object.fromEntries(
    LOCALES.map(locale => {
      const localeMessages = messages[locale] as Record<string, unknown>
      return [locale, flatten(localeMessages.dev as Record<string, unknown>)]
    }),
  ) as Record<(typeof LOCALES)[number], Record<string, string>>
  const englishKeys = Object.keys(localized.en).sort()

  it.each(LOCALES)('%s has every non-empty preview string', locale => {
    expect(Object.keys(localized[locale]).sort()).toEqual(englishKeys)
    for (const key of englishKeys) {
      expect(localized[locale][key]?.trim(), `${locale}.${key}`).not.toBe('')
    }
  })

  it.each(['es', 'zh'] as const)(
    '%s preserves interpolation placeholders',
    locale => {
      for (const key of englishKeys) {
        expect(placeholders(localized[locale][key]), key).toEqual(
          placeholders(localized.en[key]),
        )
      }
    },
  )
})
