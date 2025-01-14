const locales = import.meta.glob('./*/*.json', { eager: true })

export interface MessagesSchema {
  [key: string]: { [key: string]: object }
}

interface ModuleImportInterface {
  default: object
}
/**
 * List of supported languages.
 */
const languages = ['en']

/**
 * Generates a messages schema by merging locale data for each language.
 *
 * @param locales - A record where the key is the path to the locale file and the value is the module import interface.
 * @returns A messages schema object where each key is a language code and the value is the merged locale data for that language.
 */
const getLocales = (locales: Record<string, ModuleImportInterface>) => {
  return languages.reduce((messages, lang) => {
    messages[lang] = Object.keys(locales)
      .filter(path => path.includes(`/${lang}.json`))
      .reduce((localisedStrings, path) => {
        return Object.assign(localisedStrings, locales[path].default)
      }, {})
    return messages
  }, {} as MessagesSchema)
}

const messages = getLocales(locales as Record<string, ModuleImportInterface>)
export default messages
