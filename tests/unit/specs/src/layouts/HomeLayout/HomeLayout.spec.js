import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import HomeLayout from '@/layouts/HomeLayout/HomeLayout.vue';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';
import { state, getters } from '@@/helpers/mockStore';

describe('HomeLayout.vue', () => {
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
    wrapper = shallowMount(HomeLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'router-link': RouterLinkStub
      }
    });
  });

  it('should render correct contents', () => {
    expect(wrapper.vm.online).toBe(true);
  });
});
