import { shallowMount } from '@vue/test-utils';
import InterfaceAddress from '@/layouts/InterfaceLayout/components/InterfaceAddress/InterfaceAddress.vue';

import { Tooling } from '@@/helpers';

describe('InterfaceAddress.vue', () => {
  let localVue, i18n, wrapper, store;
  const address = 'InterfaceAddress address';
  const triggerAlert = () => {
    console.log('I got clicked');
  };
  const print = () => {
    console.log('I got clicked');
  };
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(InterfaceAddress, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        address: address,
        triggerAlert: triggerAlert,
        print: print
      }
    });
  });

  it('should render correct content', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.information-container p.address')
        .textContent.trim()
    ).toEqual(address);
  });

  describe('InterfaceAddress.vue Methods', () => {});
});
