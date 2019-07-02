import { shallowMount } from '@vue/test-utils';
import InterfaceTokensModal from '@/layouts/InterfaceLayout/components/InterfaceTokensModal/InterfaceTokensModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

describe('InterfaceTokensModal.vue', () => {
  let localVue, i18n, wrapper, store;
  const tokenDecimal = '100';
  const tokenAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
  const tokenSymbol = 'tokenSy';
  const addToken = sinon.stub();
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    store.replaceState({
      web3: {
        utils: {
          isAddress: () => {}
        }
      }
    });
    wrapper = shallowMount(InterfaceTokensModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { addToken }
    });

    wrapper.setData({
      tokenSymbol,
      tokenAddress,
      tokenDecimal,
      validAddress: true
    });
  });

  it('should render correct tokenAddress', () => {
    const inputElements = wrapper.vm.$el.querySelectorAll(
      '.tokens-modal-body input'
    );
    expect(inputElements[0].value).toEqual(tokenAddress.toLowerCase());
  });

  it('should render correct tokenSymbol', () => {
    const inputElements = wrapper.vm.$el.querySelectorAll(
      '.tokens-modal-body input'
    );
    expect(inputElements[1].value).toEqual(wrapper.vm.$data.tokenSymbol);
  });

  it('should render correct tokenDecimal', () => {
    const inputElements = wrapper.vm.$el.querySelectorAll(
      '.tokens-modal-body input'
    );
    expect(inputElements[2].value).toEqual(tokenDecimal);
  });

  describe('InterfaceTokensModal.vue Methods', () => {
    it('should add token when button click', () => {
      wrapper.find('.save-button').trigger('click');
      expect(addToken.called).toBe(true);
    });
  });
});
