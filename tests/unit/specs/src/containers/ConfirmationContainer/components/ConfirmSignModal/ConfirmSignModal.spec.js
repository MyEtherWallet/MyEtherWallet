import { shallowMount } from '@vue/test-utils';
import ConfirmSignModal from '@/containers/ConfirmationContainer/components/ConfirmSignModal/ConfirmSignModal.vue';
import VueQrcode from '@xkeshi/vue-qrcode';
import { Tooling } from '@@/helpers';
const confirmSignMessage = jest.fn();

const signedMessage = 'signedMessage';
const messageToSign = 'messageToSign';
const from = 'from';
const isHardwareWallet = false;

const showModal = jest.fn();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};

describe('ConfirmSignModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    document.execCommand = jest.fn().mockImplementation(command => {
      return command;
    });
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ConfirmSignModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        qrcode: VueQrcode,
        'b-modal': BModalStub
      },
      propsData: {
        signedMessage,
        messageToSign,
        from,
        confirmSignMessage,
        isHardwareWallet
      }
    });
  });

  it('should render correct signedMessage props', () => {
    expect(wrapper.vm.signedMessageSignature).toEqual(signedMessage);
  });

  it('should render correct from props', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.tx-from .address-info span')
        .textContent.trim()
    ).toEqual(from);
  });

  it('should render correct messageToSign props', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.tx-to .address-info')
        .getElementsByTagName('p')[1]
        .textContent.trim()
    ).toEqual(messageToSign);
  });

  describe('ConfirmSignModal.vue Methods', () => {
    it('should confirm SignMessage when click submit button', () => {
      const submitButton = wrapper.find('div.submit-button');
      submitButton.trigger('click');
      expect(confirmSignMessage).toHaveBeenCalled();
    });
  });
});
