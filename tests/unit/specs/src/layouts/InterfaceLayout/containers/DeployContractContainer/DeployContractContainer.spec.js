import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
// import InteractWithContractContainer from '@/layouts/InterfaceLayout/containers/InteractWithContractContainer/InteractWithContractContainer.vue';
// import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';

import DeployContractContainer from '@/layouts/InterfaceLayout/containers/DeployContractContainer/DeployContractContainer.vue';
// import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
// import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
// import sinon from 'sinon';
import { state, getters } from '@@/helpers/mockStore';

import { Tooling } from '@@/helpers';

describe('[Needs Cleaned Up 1-16-19] InteractWithContractContainer.vue', () => {
  let localVue, i18n, wrapper, store /*, getters*/;
  const resetView = jest.fn();

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
    Vue.config.errorHandler = () => {};

    const actions = {
      setGasPrice: jest.fn()
    };

    store = new VueX.Store({
      actions,
      getters,
      state
    });
  });
  beforeEach(() => {
    wrapper = shallowMount(DeployContractContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'back-button': BackButton,
        popover: PopOver
      },
      propsData: {
        resetView: resetView
      }
    });
    wrapper.find('div'); // added to suppress eslint warning
  });
  it('should render correct bytecode', () => {
    const bytecode = 'bytecode';
    wrapper.setData({ bytecode });
    expect(wrapper.vm.$el.querySelectorAll('textarea')[0].value).toEqual(
      wrapper.vm.$data.bytecode
    );
  });

  it('should render correct abi', () => {
    const abi = 'abi';
    wrapper.setData({ abi });
    expect(wrapper.vm.$el.querySelectorAll('textarea')[1].value).toEqual(
      wrapper.vm.$data.abi
    );
  });

  xit('should render correct contractName', () => {
    const contractName = 'contractName';
    wrapper.setData({ contractName });
    expect(
      wrapper.vm.$el.querySelectorAll('.domain-name input')[0].value
    ).toEqual(contractName);
  });

  xit('should render correct contractName placeholder', () => {
    expect(
      wrapper.vm.$el.querySelectorAll('.domain-name input')[0].placeholder
    ).toEqual(wrapper.vm.$data.contractNamePlaceholder);
  });

  xit('should render correct transactionFee', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.send-form2 .title-container .title p')[1]
        .textContent.indexOf(wrapper.vm.$data.transactionFee)
    ).toBeGreaterThan(-1);
  });

  xit('should render correct gas limit', () => {
    expect(wrapper.vm.$el.querySelector('.gas-amount input').value).toEqual(
      String(wrapper.vm.$data.gasLimit)
    );
  });

  it('should render correct validAbi', () => {
    expect(
      wrapper.vm.$el
        .querySelector('i.good-button')
        .className.indexOf('not-good')
    ).toBeGreaterThan(-1);
  });

  describe('DeployContractContainer.vue Methods', () => {
    xit('should changeGas when click button', () => {
      const btnElements = wrapper.findAll('.small-circle-button-green-border');
      btnElements.at(0).trigger('click');
      expect(wrapper.vm.$data.gasAmount).toEqual(5);
      btnElements.at(1).trigger('click');
      expect(wrapper.vm.$data.gasAmount).toEqual(45);
      btnElements.at(2).trigger('click');
      expect(wrapper.vm.$data.gasAmount).toEqual(75);
    });

    xit('[FAILING] should Open confirmationModal when click button', () => {
      window.pageXOffset = 100;
      window.pageYOffset = 100;
      wrapper.find('.submit-button').trigger('click');
      expect(window.pageXOffset).toBe(0);
      expect(window.pageYOffset).toBe(0);
    });

    xit('should delete Input when click button', () => {
      const bytecode = 'bytecode';
      wrapper.setData({ bytecode });
      wrapper.find('.copy-buttons span').trigger('click');
    });
  });
});
