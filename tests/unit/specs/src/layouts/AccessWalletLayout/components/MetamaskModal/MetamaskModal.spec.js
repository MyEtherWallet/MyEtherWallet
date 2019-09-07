import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import MetamaskModal from '@/layouts/AccessWalletLayout/components/MetamaskModal/MetamaskModal.vue';
import { Tooling } from '@@/helpers';
import { state } from '@@/helpers/mockStore';
import { RouterLinkStub } from '@@/helpers/setupTooling';

describe('MetamaskModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(MetamaskModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: { 'router-link': RouterLinkStub }
    });
  });

  it('should check the switch to enable accessMyWallet Button', () => {
    wrapper.setData({ web3WalletExists: false });
    expect(
      wrapper.vm.$el.querySelectorAll('.modal-multi-icons img').length
    ).toEqual(1);
    wrapper.setData({ web3WalletExists: true });
    expect(
      wrapper.vm.$el.querySelectorAll('.modal-multi-icons img').length
    ).toEqual(3);
    const checkboxInput = wrapper.find('input[type=checkbox]');
    checkboxInput.trigger('click');
    expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(false);
    checkboxInput.trigger('click');
    expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(true);
  });

  it('should render correct refreshPage data', () => {
    wrapper.setData({ web3WalletExists: false });
    expect(
      wrapper
        .findAll('.close-button')
        .at(0)
        .isVisible()
    ).toBe(true);
    wrapper.find('a.close-button').trigger('click');
    expect(wrapper.vm.$data.refreshPage).toBe(true);
    expect(
      wrapper
        .findAll('.close-button')
        .at(0)
        .isVisible()
    ).toBe(false);
  });

  it('should render correct unlockWeb3Wallet data', () => {
    wrapper.setData({ web3WalletExists: true });
    expect(
      wrapper
        .findAll('.content-container h4')
        .at(0)
        .isVisible()
    ).toEqual(true);
    expect(
      wrapper
        .findAll('.content-container h4')
        .at(1)
        .isVisible()
    ).toEqual(false);
    wrapper.setData({ unlockWeb3Wallet: true });
    expect(
      wrapper
        .findAll('.content-container h4')
        .at(0)
        .isVisible()
    ).toEqual(false);
    expect(
      wrapper
        .findAll('.content-container h4')
        .at(1)
        .isVisible()
    ).toEqual(true);
  });

  describe('MetamaskModal.vue Methods', () => {
    it('should render correct getWeb3Wallet methods', () => {
      window.web3 = state.newWeb3;
      wrapper.vm.getWeb3Wallet();
    });
  });
});
