import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import BootstrapVue from "bootstrap-vue";
import languages from '@/translations';

function createLocalVueInstance(){
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(BootstrapVue);
  const i18n = new VueI18n({
    locale: 'en_US',
    fallbackLocale: 'en_US',
    messages: languages,
    silentTranslationWarn: true
  });
  return {
    localVue,
    i18n
  }
}

// likely will remove this function
// function createShallowMountWrapper(component, suppliedOptions, baseOptions = {}){
//   if(typeof baseOptions === 'boolean' && baseOptions){
//     baseOptions = baseOptions || createLocalVueInstance();
//   }
//
//   return shallowMount(component, {baseOptions, ...suppliedOptions});
// }

export default {
  createLocalVueInstance
}
