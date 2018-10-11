import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import languages from '@/translations';
import VueX from 'vuex';
import VueRouter from 'vue-router';

function createLocalVueInstance() {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(BootstrapVue);
  localVue.use(VueX);
  localVue.use(VueRouter);
  const i18n = new VueI18n({
    locale: 'en_US',
    fallbackLocale: 'en_US',
    messages: languages,
    silentTranslationWarn: true
  });

  const router = new VueRouter();
  const store = new VueX.Store();
  return {
    localVue,
    i18n,
    store,
    router
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
