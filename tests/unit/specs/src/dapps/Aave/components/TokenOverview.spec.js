import TokenOverview from '@/dapps/Aave/components/TokenOverview/TokenOverview.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

describe('TokenOverview.vue', () => {
  let localVue, wrapper, i18n, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;

    store = new VueX.Store({
      modules: {
        aave: {
          namespaced: true,
          state,
          getters
        }
      }
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(TokenOverview, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        token: state.token
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should call convertToFixed()', async () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.right-container p')[0]
        .textContent.trim()
    ).toEqual('65.42%');
  });

  it('should get the right icon', async () => {
    expect(wrapper.find('img').exists()).toBe(true);
  });
});
