import { createLocalVue } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
// import languages from '@/translations';
import VueX from 'vuex';
import VueToast from 'vue-toasted';
import veeValidate from 'vee-validate';
import ClickOutside from '@/directives/ClickOutside';
import EnsResolver from '@/directives/EnsResolver';
import en_US from '@/translations/en_US';
import { state, getters } from '@@/helpers/mockStore';
function createLocalVueInstance() {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(BootstrapVue);
  localVue.use(VueX);
  localVue.use(veeValidate);
  localVue.use(VueToast);
  localVue.directive('click-outside', ClickOutside);
  localVue.directive('ens-resolver', EnsResolver);

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

  const actions = {
    clearWallet: jest.fn(),
    decryptWallet: jest.fn(),
    setGasPrice: jest.fn(),
    addSwapNotification: jest.fn()
  };

  const store = new VueX.Store({
    actions,
    getters,
    state
  });

  return {
    localVue,
    i18n,
    store
  };
}

const RouterLinkStub = {
  name: 'router-link',
  template: '<div class="routerlink"><slot></slot></div>',
  props: ['to']
};

// likely will remove this function
// function createShallowMountWrapper(component, suppliedOptions, baseOptions = {}){
//   if(typeof baseOptions === 'boolean' && baseOptions){
//     baseOptions = baseOptions || createLocalVueInstance();
//   }
//
//   return shallowMount(component, {baseOptions, ...suppliedOptions});
// }
export { RouterLinkStub };
export default {
  createLocalVueInstance
};
