import SwitchInterestModal from '@/dapps/Aave/components/SwitchInterestModal/SwitchInterestModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

describe('SwitchInterestModal.vue', () => {
  let localVue, wrapper, i18n, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = new VueX.Store({
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
    wrapper = shallowMount(SwitchInterestModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        token: {}
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should trigger emit on button click', async () => {
    wrapper.setProps({
      token: { symbol: 'ICX', user: { id: '123' } }
    });
    wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().emitTakeAction).toBeTruthy();
  });

  it('should get the right icon', async () => {
    wrapper.setProps({
      token: { symbol: 'ABC', user: { id: '123' } }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('img').exists()).toBe(true);
  });
});
