import { shallowMount } from '@vue/test-utils';
import SignedTxModal from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/SignedTxModal/SignedTxModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
// import Vue from 'vue';

describe('SignedTxModal.vue', () => {
  let localVue, i18n, wrapper, store;

  const signedTx =
    '{"rawTransaction":"","tx":{"nonce":"","gasPrice":"","gas":"","to":"","value":"","input":"","v":"","r":"","s":"","hash":""}}';
  const rawTx = { data: 'rawTx' };
  const spy = sinon.stub();

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(SignedTxModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        signedTx: signedTx,
        rawTx: rawTx,
        pathUpdate: spy()
      }
    });

    wrapper.setData({
      showRaw: true,
      jsonFile: '',
      jsonFileName: `signedTransactionObject-${+new Date()}.json`
    });
  });

  it('should render correct content', () => {
    const txContainer = wrapper.find('.signed-tx-container code');
    expect(txContainer.exists()).toBe(true);
    expect(txContainer.text()).toEqual(JSON.parse(signedTx).rawTransaction);
    const closeButton = wrapper.find('.close-button');
    closeButton.trigger('click');
    expect(spy.calledOnce).toBe(true);
  });

  describe('SignedTxModal.vue Methods', () => {});
});
