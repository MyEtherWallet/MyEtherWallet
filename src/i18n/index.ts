import { createI18n } from 'vue-i18n'
import messages, { type MessagesSchema } from './locales'

const savedLocale = localStorage.getItem('mew-locale') || 'en'

const i18n = createI18n({
  locale: savedLocale,
  fallbackLocale: 'en',
  legacy: false,
  messages: messages as MessagesSchema,
})

export default i18n
