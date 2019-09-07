import { shallowMount } from '@vue/test-utils';
import SignedTxModal from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/SignedTxModal/SignedTxModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

describe('SignedTxModal.vue', () => {
  let localVue, i18n, wrapper, store;

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
        rawTx: rawTx,
        pathUpdate: spy()
      }
    });

    wrapper.setData({
      showRaw: true
    });
  });

  xit('[Failing] should render correct content', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.signed-tx-container code')
        .textContent.trim()
    ).toEqual('');
    const closeButton = wrapper.find('.close-button');
    closeButton.trigger('click');
    expect(spy.calledOnce).toBe(true);
  });
});
