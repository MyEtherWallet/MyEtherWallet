import MobileAddressBlock from '@/containers/HeaderContainer/components/MobileMenu/components/MobileAddressBlock/MobileAddressBlock.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import { state, getters } from '@@/helpers/mockStore';
import Vuex from 'vuex';

describe('MobileAddressBlock.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = new Vuex.Store({
      modules: {
        main: {
          namespaced: true,
          state,
          getters
        }
      }
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(MobileAddressBlock, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct account computed data', () => {
    expect(
      wrapper.vm.$el.querySelector('.the-address').textContent.trim()
    ).toEqual(wrapper.vm.account.address);
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
