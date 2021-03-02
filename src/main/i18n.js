import languages from '@/translations';
import VueI18n from 'vue-i18n';
import Vue from 'vue';
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});
Vue.$i18n = i18n;
export default i18n;
