import Vue from 'vue';
import VueI18n from 'vue-i18n';
import languages from '@/translations';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});

export default i18n;
