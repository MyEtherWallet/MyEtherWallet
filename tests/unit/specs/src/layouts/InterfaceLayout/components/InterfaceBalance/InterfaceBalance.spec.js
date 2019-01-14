import { shallowMount } from '@vue/test-utils';
import InterfaceBalance from '@/layouts/InterfaceLayout/components/InterfaceBalance/InterfaceBalance.vue';

import { Tooling } from '@@/helpers';

describe('InterfaceBalance.vue', () => {
  let localVue, i18n, wrapper, store;
  const balance = '100';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    store.replaceState({
      network: {
        type: {
          name: 'ETH',
          symbol: 'ETH'
        }
      }
    });
    wrapper = shallowMount(InterfaceBalance, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        balance: balance
      }
    });
  });

  it('should render correct contents', () => {
    expect(
      wrapper.vm.$el.querySelector('.balance-text p').textContent.trim()
    ).toEqual(balance);
  });

  describe('InterfaceBalance.vue Methods', () => {});
});
