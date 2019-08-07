import Vue from 'vue';
import WalletPasswordModal from '@/components/WalletPasswordModal/WalletPasswordModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';

const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
};

const eventHub = {
  $on: sinon.stub(),
  $off: sinon.stub()
};

describe('WalletPasswordModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(WalletPasswordModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'standard-button': StandardButton,
        'b-modal': BModalStub
      },
      mocks: {
        $eventHub: eventHub
      }
    });
  });

  it('should render correct passphrase data', () => {
    wrapper.setData({ passphrase: 'passphrase' });
    const passphrase = wrapper.vm.$el
      .querySelector('.input-container input')
      .value.trim();
    expect(passphrase).toEqual(wrapper.vm.$data.passphrase);
  });

  it('should change passphrase data when input triggers', () => {
    const inputElement = wrapper.find('.input-container input');
    const inputText = 'testpassword';
    inputElement.setValue(inputText);
    inputElement.trigger('change');
    expect(wrapper.vm.$data.passphrase).toBe(inputText);
  });

  it('should submit password when button clicked', () => {
    wrapper.find('.button-block button').trigger('click');
    expect(wrapper.vm.$data.passphrase).toBe('');
  });

  it('should clear passphrase when button clicked', () => {
    wrapper.find('.input-headers span').trigger('click');
    expect(wrapper.vm.$data.passphrase).toBe('');
    wrapper.vm.$emit('showHardwarePassword');
  });
});
