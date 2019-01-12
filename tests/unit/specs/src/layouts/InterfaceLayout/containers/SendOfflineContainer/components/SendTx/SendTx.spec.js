import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import SendTx from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/SendTx/SendTx.vue';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import sinon from 'sinon'
import {
  Tooling
} from '@@/helpers';

xdescribe('SendTx.vue', () => {
  let localVue, i18n, wrapper, store;

  const signedTx = 'signedTx'
  const rawTx = { data: 'rawTx' }
  const spy = sinon.stub()

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.errorHandler = () => {};
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(SendTx, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        signedTx: signedTx,
        pathUpdate: spy()
      }
    });
  });

  it('should render correct rawTx props', () => {
  
  });

  describe('SendTx.vue Methods', () => {
    it('should clear signedTx when button clicked', () => {
      wrapper.findAll('.form-controller p').at(1).trigger('click');
      expect(wrapper.vm.signedTx).toEqual('');
    })
  });
});
