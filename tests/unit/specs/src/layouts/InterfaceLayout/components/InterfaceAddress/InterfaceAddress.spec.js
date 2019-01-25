import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import InterfaceAddress from '@/layouts/InterfaceLayout/components/InterfaceAddress/InterfaceAddress.vue';
import { state, getters } from '@@/helpers/mockStore';
import { Tooling } from '@@/helpers';

describe('InterfaceAddress.vue', () => {
  let localVue, i18n, wrapper, store;
  const address = 'InterfaceAddress address';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    store = new Vuex.Store({
      getters,
      state
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(InterfaceAddress, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        address: address
      }
    });
  });

  xit('should render correct address props', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.information-container p.address')
        .textContent.trim()
    ).toEqual(address);
  });

  xit('should render correct hasMultipleAddr data', () => {
    expect(wrapper.vm.$data.hasMultipleAddr).toBe(false);
  });

  describe('InterfaceAddress.vue Methods', () => {});
});
