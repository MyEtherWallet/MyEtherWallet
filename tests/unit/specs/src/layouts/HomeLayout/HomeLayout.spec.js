import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import HomeLayout from '@/layouts/HomeLayout/HomeLayout.vue';
import { Tooling } from '@@/helpers';

const RouterLinkStub = {
  name: 'router-link',
  template: '<div class="routerlink"><slot> </slot></div>',
  props: ['to']
};
describe('HomeLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    const getters = {
      online: () => {
        return true;
      }
    };

    store = new Vuex.Store({
      getters
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
