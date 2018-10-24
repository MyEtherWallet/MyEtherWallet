import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import MetamaskModal from '@/layouts/AccessWalletLayout/components/MetamaskModal/MetamaskModal.vue';
import languages from '@/translations';
import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot></slot></div>',
  props:['to']  
}

describe('MetamaskModal.vue', () => {
  let localVue, i18n, wrapper;

  beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
  });

  beforeEach(() => {
      wrapper = shallowMount(MetamaskModal, {
        localVue,
        i18n,
        attachToDocument: true,
        stubs: {'router-link':RouterLinkStub }
      });
  });

  it('should check the switch to enable accessMyWallet Button', () => {
    expect(wrapper.vm.$el.querySelectorAll('.modal-multi-icons img').length).toEqual(1);
    wrapper.setData({web3WalletExists:true});
    expect(wrapper.vm.$el.querySelectorAll('.modal-multi-icons img').length).toEqual(3);
    var checkboxInput = wrapper.find('input[type=checkbox]');
    checkboxInput.trigger('click');
    expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(false);
    checkboxInput.trigger('click');
    expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(true);
  });

  it('should render correct refreshPage data', () => {
    expect(wrapper.findAll('.close-button').at(0).isVisible()).toBe(true);
    wrapper.find('a.close-button').trigger('click');
    expect(wrapper.vm.$data.refreshPage).toBe(true);
    expect(wrapper.findAll('.close-button').at(0).isVisible()).toBe(false);
  });

  it('should render correct unlockWeb3Wallet data', () => {
      wrapper.setData({web3WalletExists:true});
      expect(wrapper.findAll('.content-container h4').at(0).isVisible()).toEqual(true);
      expect(wrapper.findAll('.content-container h4').at(1).isVisible()).toEqual(false);
      wrapper.setData({unlockWeb3Wallet:true});
      expect(wrapper.findAll('.content-container h4').at(0).isVisible()).toEqual(false);
      expect(wrapper.findAll('.content-container h4').at(1).isVisible()).toEqual(true);
  });

  describe('MetamaskModal.vue Methods', () => {});
});
