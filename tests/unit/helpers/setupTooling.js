import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import BootstrapVue from "bootstrap-vue";
import languages from '@/translations';
import VueX from 'vuex'
import VueQrcode from '@xkeshi/vue-qrcode';

import ClickOutside from '@/directives/ClickOutside';
import EnsResolver from '@/directives/EnsResolver';


function createLocalVueInstance(){
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(BootstrapVue);
  localVue.use(VueX)
  localVue.directive('click-outside', ClickOutside);
  localVue.directive('ens-resolver', EnsResolver);
  localVue.component(VueQrcode.name, VueQrcode);
  localVue.filter('capitalize', function(value){
    if(!value) return ''
    value = value.toString().toLowerCase()
    return value.charAt(0).toUpperCase() + value.slice(1)
  });
  const i18n = new VueI18n({
    locale: 'en_US',
    fallbackLocale: 'en_US',
    messages: languages,
    silentTranslationWarn: true
  });

  const store = new VueX.Store()
  return {
    localVue,
    i18n,
    store
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
