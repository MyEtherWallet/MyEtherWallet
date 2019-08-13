import { shallowMount } from '@vue/test-utils';
import VerifyMessageContainer from '@/layouts/InterfaceLayout/containers/VerifyMessageContainer/VerifyMessageContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import Vue from 'vue';
import { Tooling } from '@@/helpers';

describe('VerifyMessageContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    store.replaceState({
      account: {
        balance: {
          result: ''
        }
      },
      wallet: {
        getAddressString: function() {}
      }
    });
    wrapper = shallowMount(VerifyMessageContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-bottom-text': InterfaceBottomText,
        'interface-container-title': InterfaceContainerTitle,
        popover: PopOver
      }
    });
  });

  it('should render correct content', () => {
    console.log(wrapper.html());
  });
  xit('[7-2-19 NOT TEST PRESENT] should render correct content', () => {
    console.log(wrapper.html());
  });
});
