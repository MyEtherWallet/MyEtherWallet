import { createLocalVue } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import veeValidate from 'vee-validate';
import VueX from 'vuex';

import ClickOutside from '@/directives/ClickOutside';
import EnsResolver from '@/directives/EnsResolver';
import en_US from '@/translations/en_US';

function createLocalVueInstance() {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(BootstrapVue);
  localVue.use(VueX);
  localVue.directive('click-outside', ClickOutside);
  localVue.directive('ens-resolver', EnsResolver);
  localVue.use(veeValidate);
  localVue.filter('capitalize', function(value) {
    if (!value) return '';
    value = value.toString().toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  });
  const i18n = new VueI18n({
    locale: 'en_US',
    fallbackLocale: 'en_US',
    messages: { en_US: en_US },
    silentTranslationWarn: true
  });

  const store = new VueX.Store();
  return {
    localVue,
    i18n,
    store
  };
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
};
