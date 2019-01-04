import { shallowMount } from '@vue/test-utils';
import TxSpeedInput from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/TxSpeedInput/TxSpeedInput.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import { Tooling } from '@@/helpers';
import Vue from 'vue';

describe('TxSpeedInput.vue', () => {
  let localVue, i18n, wrapper, store;

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

    store.getters = {
      network: {
        type: {
          name: 'ETH',
          symbol: 'ETH'
        }
      }
    };

    wrapper = shallowMount(TxSpeedInput, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        popover: PopOver
      },
      propsData: {
        highestGas: 10,
        nonce: 0
      }
    });
  });

  it('should render correct content', () => {
    const speedButtons = wrapper.vm.$el.querySelectorAll(
      '.send-form .buttons div'
    );
    expect(speedButtons[0].textContent.trim()).toEqual('Economy');
    expect(speedButtons[1].textContent.trim()).toEqual('Regular');
    expect(speedButtons[2].textContent.trim()).toEqual('Fast');
    expect(wrapper.vm.nonce).toEqual(0);
  });

  it('should emit locNonce update when input changed', () => {
    const inputElement = wrapper.findAll('.gas-amount input').at(1);
    const inputText = 11;
    Vue.nextTick(() => {
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.emitted().nonceUpdate).toBeTruthy();
    });
  });

  describe('TxSpeedInput.vue Methods', () => {});
});
