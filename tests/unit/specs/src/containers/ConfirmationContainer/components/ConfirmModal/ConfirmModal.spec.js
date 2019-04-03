import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import ConfirmModal from '@/containers/ConfirmationContainer/components/ConfirmModal/ConfirmModal.vue';
import VueQrcode from '@xkeshi/vue-qrcode';
import { Tooling } from '@@/helpers';

const AddressBlockStub = {
  name: 'address-block',
  template: '<p class="address-block"><slot></slot></p>'
};

describe('ConfirmModal.vue', () => {
  let localVue, i18n, wrapper, store;
  const signedTx = '0x111';
  const fee = 10;
  const data = '0x111';
  const from = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
  const to = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068E';
  const gas = 10;
  const gasPrice = 1;
  const nonce = 10;
  const value = 10;
  const isHardwareWallet = false;
  const confirmSendTx = jest.fn();
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(ConfirmModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        qrcode: VueQrcode,
        'address-block': AddressBlockStub
      },
      propsData: {
        confirmSendTx,
        signedTx,
        data,
        from,
        to,
        fee,
        gas,
        gasPrice,
        nonce,
        value,
        isHardwareWallet
      }
    });
  });

  it('should render correct gas props', () => {
    wrapper.setData({ modalDetailInformation: true });
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[1]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.props().gas + ' wei');
  });

  it('should render correct gasPrice props', () => {
    wrapper.setData({ modalDetailInformation: true });
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[2]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.props().gasPrice + ' gwei');
  });

  it('should render correct fee props', () => {
    wrapper.setData({ modalDetailInformation: true });
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[3]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.props().fee + ' ETH');
  });

  it('should render correct nonce props', () => {
    wrapper.setData({ modalDetailInformation: true });
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[4]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(String(wrapper.props().nonce));
  });

  it('should render correct data props', () => {
    wrapper.setData({ modalDetailInformation: true });
    expect(
      wrapper.vm.$el
        .querySelectorAll('.grid-block')[5]
        .querySelectorAll('p')[1]
        .textContent.trim()
    ).toEqual(wrapper.props().data);
  });

  xit('should render correct sendTx props', () => {
    expect(
      wrapper
        .find('.submit-button')
        .classes()
        .indexOf('disabled')
    ).toBe(-1);
    wrapper.setProps({ signedTx: '' });
    expect(
      wrapper
        .find('.submit-button')
        .classes()
        .indexOf('disabled')
    ).toBeGreaterThan(-1);
  });

  it('should render correct from props', () => {
    expect(
      wrapper
        .findAll('.address-block')
        .at(0)
        .attributes('address')
    ).toEqual(from);
  });

  it('should render correct to props', () => {
    expect(
      wrapper
        .findAll('.address-block')
        .at(1)
        .attributes('address')
    ).toEqual(to);
  });

  it('should render correct value props', () => {
    expect(
      wrapper
        .findAll('.address-block')
        .at(0)
        .attributes('value')
    ).toEqual(String(value));
  });

  it('should render correct isHardwareWallet props', () => {
    expect(wrapper.vm.signedTransaction).toEqual('');
    wrapper.setProps({ isHardwareWallet: true });
    expect(wrapper.vm.signedTransaction).toEqual(
      'Please Approve on Hardware Wallet'
    );
  });

  describe('ConfirmModal.vue Methods', () => {
    xit('should confirm sendtx when click submit button', () => {
      const submitButton = wrapper.find('div.submit-button');
      submitButton.trigger('click');
      expect(confirmSendTx).toHaveBeenCalled();
    });

    it('should change modalDetailInformation data when checked', () => {
      const checkboxElement = wrapper.find(
        '.sliding-switch-white .switch input'
      );
      checkboxElement.trigger('click');
      expect(wrapper.vm.modalDetailInformation).toBe(true);
    });
  });
});
