import { shallowMount } from '@vue/test-utils';
import ConfirmationContainer from '@/containers/ConfirmationContainer/ConfirmationContainer.vue';
import AddressBlock from '@/containers/ConfirmationContainer/components/AddressBlock/AddressBlock.vue';
import ConfirmModal from '@/containers/ConfirmationContainer/components/ConfirmModal/ConfirmModal.vue';
import ConfirmSignModal from '@/containers/ConfirmationContainer/components/ConfirmSignModal/ConfirmSignModal.vue';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import ConfirmCollectionModal from '@/containers/ConfirmationContainer/components/ConfirmCollectionModal/ConfirmCollectionModal.vue';
import VueQrcode from '@xkeshi/vue-qrcode';
import sinon from 'sinon';
import Web3 from 'web3';

import { Tooling } from '@@/helpers';

const showModal = sinon.stub();
const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal,
    hide: hideModal
  }
};

const eventHub = {
  $on: sinon.stub()
};

describe('ConfirmationContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    initWrapper();
  });

  function initWrapper() {
    wrapper = shallowMount(ConfirmationContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        qrcode: VueQrcode,
        'b-modal': BModalStub,
        'address-block': AddressBlock,
        'confirm-modal': ConfirmModal,
        'confirm-collection-modal': ConfirmCollectionModal,
        'success-modal': SuccessModal,
        'confirm-sign-modal': ConfirmSignModal
      },
      mocks: {
        $eventHub: eventHub
      }
    });
  }

  it('should render correct transactionFee data', () => {
    const checkboxElement = wrapper.find('.sliding-switch-white .switch input');
    checkboxElement.trigger('click');
    wrapper.setData({ transactionFee: new String(100) });
    expect(
      wrapper.vm.$el
        .querySelectorAll('.expended-info .grid-block')[3]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.vm.$data.transactionFee + ' ETH');
  });

  it('should render correct fromAddress data', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.address-container .address')
        .textContent.trim()
    ).toEqual(wrapper.vm.fromAddress);
  });

  it('should render correct successMessage data', () => {
    expect(
      wrapper.vm.$el.querySelector('.d-block p').textContent.trim()
    ).toEqual(wrapper.vm.$data.successMessage);
  });

  it('should render correct gasLimit data', () => {
    const checkboxElement = wrapper.find('.sliding-switch-white .switch input');
    checkboxElement.trigger('click');
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[1]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.vm.$data.gasLimit + ' wei');
  });

  it('should render correct gasPrice data', () => {
    const checkboxElement = wrapper.find('.sliding-switch-white .switch input');
    checkboxElement.trigger('click');
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[2]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.vm.gasPrice + ' gwei');
  });

  it('should render correct nonce data', () => {
    const checkboxElement = wrapper.find('.sliding-switch-white .switch input');
    checkboxElement.trigger('click');
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[4]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(String(wrapper.vm.$data.nonce));
  });

  it('should render correct data data', () => {
    const checkboxElement = wrapper.find('.sliding-switch-white .switch input');
    checkboxElement.trigger('click');
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[5]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.vm.$data.data);
  });

  it('should render correct amount data', () => {
    const eth = Web3.utils.fromWei(String(wrapper.vm.$data.amount), 'ether');
    expect(
      wrapper.vm.$el
        .querySelector('.currency-amt')
        .textContent.trim()
        .indexOf(eth)
    ).toBeGreaterThan(-1);
  });

  it('should render correct toAddress data', () => {
    wrapper.setData({
      toAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
    });
    expect(
      wrapper.vm.$el.querySelectorAll('.address')[1].textContent.trim()
    ).toEqual(wrapper.vm.toAddress);
  });

  // describe('ConfirmationContainer.vue Methods', () => {
  //   it('should render correct messageReturn method', () => {
  //     initWrapper();
  //     wrapper.setData({responseFunction:sinon.stub()})
  //     wrapper.vm.messageReturn();
  //     expect(showModal.called).toBe(true);
  //     expect(hideModal.called).toBe(true);
  //   });

  //   it('should render correct sendTx method', () => {
  //     initWrapper();
  //     wrapper.setData({responseFunction:sinon.stub()})
  //     wrapper.vm.sendTx();
  //     expect(showModal.called).toBe(true);
  //     expect(hideModal.called).toBe(true);
  //   });

  //   it('should render correct confirmationModalOpen method', () => {
  //     initWrapper();
  //     window.pageXOffset = 100;
  //     window.pageYOffset = 100;
  //     wrapper.vm.confirmationModalOpen();
  //     expect(window.pageXOffset).toBe(0);
  //     expect(window.pageYOffset).toBe(0);
  //     expect(showModal.called).toBe(true);
  //   });

  //   it('should render correct confirmationCollectionModalOpen method', () => {
  //     initWrapper();
  //     window.pageXOffset = 100;
  //     window.pageYOffset = 100;
  //     wrapper.vm.confirmationCollectionModalOpen();
  //     expect(window.pageXOffset).toBe(0);
  //     expect(window.pageYOffset).toBe(0);
  //     expect(showModal.called).toBe(true);
  //   });

  //   it('should render correct confirmationOfflineGenerateModalOpen method', () => {
  //     initWrapper();
  //     window.pageXOffset = 100;
  //     window.pageYOffset = 100;
  //     wrapper.vm.confirmationOfflineGenerateModalOpen();
  //     expect(window.pageXOffset).toBe(0);
  //     expect(window.pageYOffset).toBe(0);
  //     expect(showModal.called).toBe(true);
  //   });

  //   it('should render correct signConfirmationModalOpen method', () => {
  //     initWrapper();
  //     window.pageXOffset = 100;
  //     window.pageYOffset = 100;
  //     wrapper.vm.signConfirmationModalOpen();
  //     expect(window.pageXOffset).toBe(0);
  //     expect(window.pageYOffset).toBe(0);
  //     expect(showModal.called).toBe(true);
  //   });

  //   it('should render correct generateTx method', () => {
  //     initWrapper();
  //     wrapper.setData({responseFunction:sinon.stub()})
  //     wrapper.vm.generateTx();
  //     expect(hideModal.called).toBe(true);
  //   });

  //   it('should render correct showSuccessModal method', () => {
  //     initWrapper();
  //     wrapper.vm.showSuccessModal();
  //     expect(showModal.called).toBe(true);
  //     expect(wrapper.vm.$data.advancedExpand).toBe(false);
  //     expect(wrapper.vm.$data.addressValid).toBe(true);
  //     expect(wrapper.vm.$data.amountValid).toBe(true);
  //     expect(wrapper.vm.$data.amount).toBe(0);
  //     expect(wrapper.vm.$data.nonce).toBe(0);
  //     expect(wrapper.vm.$data.transactionFee).toBe(0);
  //     expect(wrapper.vm.$data.gasLimit).toBe(21000);
  //     expect(wrapper.vm.$data.parsedBalance).toBe(0);
  //     expect(wrapper.vm.$data.signedTx).toBe('');
  //     expect(wrapper.vm.$data.messageToSign).toBe('');
  //     expect(wrapper.vm.$data.signedMessage).toBe('');
  //     expect(wrapper.vm.$data.messageToSign).toBe('');
  //     expect(wrapper.vm.$data.web3WalletHash).toBe('');
  //     expect(wrapper.vm.$data.web3WalletRes).toBe('');
  //     expect(wrapper.vm.$data.toAddress).toBe('');
  //     expect(wrapper.vm.$data.data).toBe('0x');
  //     expect(wrapper.vm.$data.signedArray).toEqual([]);
  //     expect(wrapper.vm.$data.raw).toEqual({});
  //     expect(wrapper.vm.$data.responseFunction).toEqual(null);
  //     expect(wrapper.vm.$data.selectedCurrency.symbol).toEqual('ETH');
  //     expect(wrapper.vm.$data.selectedCurrency.name).toEqual('Ethereum');
  //   });

  //   it('should render correct reset method', () => {
  //     wrapper.vm.reset();
  //     expect(wrapper.vm.$data.advancedExpand).toBe(false);
  //     expect(wrapper.vm.$data.addressValid).toBe(true);
  //     expect(wrapper.vm.$data.amountValid).toBe(true);
  //     expect(wrapper.vm.$data.amount).toBe(0);
  //     expect(wrapper.vm.$data.nonce).toBe(0);
  //     expect(wrapper.vm.$data.transactionFee).toBe(0);
  //     expect(wrapper.vm.$data.gasLimit).toBe(21000);
  //     expect(wrapper.vm.$data.parsedBalance).toBe(0);
  //     expect(wrapper.vm.$data.signedTx).toBe('');
  //     expect(wrapper.vm.$data.messageToSign).toBe('');
  //     expect(wrapper.vm.$data.signedMessage).toBe('');
  //     expect(wrapper.vm.$data.messageToSign).toBe('');
  //     expect(wrapper.vm.$data.web3WalletHash).toBe('');
  //     expect(wrapper.vm.$data.web3WalletRes).toBe('');
  //     expect(wrapper.vm.$data.toAddress).toBe('');
  //     expect(wrapper.vm.$data.data).toBe('0x');
  //     expect(wrapper.vm.$data.signedArray).toEqual([]);
  //     expect(wrapper.vm.$data.raw).toEqual({});
  //     expect(wrapper.vm.$data.responseFunction).toEqual(null);
  //     expect(wrapper.vm.$data.selectedCurrency.symbol).toEqual('ETH');
  //     expect(wrapper.vm.$data.selectedCurrency.name).toEqual('Ethereum');
  //   });
  // });
});
