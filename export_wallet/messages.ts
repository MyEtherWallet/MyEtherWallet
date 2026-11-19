import en from '@/i18n/locales/settings/en.json'
import es from '@/i18n/locales/settings/es.json'
import zh from '@/i18n/locales/settings/zh.json'

/**
 * The export page's words. The page is not part of the Vue app, so it reads
 * the app's own locale files directly instead of going through vue-i18n.
 */
export type ExportPageMessages = typeof en.settings.export_page

// A Map, not an object: the saved value is whatever storage holds, and a
// name such as "constructor" must not find anything.
const BY_LOCALE = new Map<string, ExportPageMessages>([
  ['en', en.settings.export_page],
  ['es', es.settings.export_page],
  ['zh', zh.settings.export_page],
])

/** The language the user picked in the app (`mew-locale`), when it can be read. */
const savedLocale = (): string => {
  try {
    return localStorage.getItem('mew-locale') ?? 'en'
  } catch {
    return 'en'
  }
}

export const exportPageMessages = (
  locale: string = savedLocale(),
): ExportPageMessages => BY_LOCALE.get(locale) ?? en.settings.export_page
