import languages from '@/translations';
import VueI18n from 'vue-i18n';
import Vue from 'vue';
import axios from 'axios';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});

Vue.$i18n = i18n;

export default i18n;

// our default language that is preloaded
const loadedLanguages = ['en_US'];

const setI18nLanguage = lang => {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
  return lang;
};

export const loadLanguageAsync = lang => {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language hasn't been loaded yet
  return import(
    /* webpackChunkName: "lang-[request]" */ `@/translations/${lang}.js`
  ).then(messages => {
    i18n.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setI18nLanguage(lang);
  });
};
