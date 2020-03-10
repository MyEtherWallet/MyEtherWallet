import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import DeployContractContainer from '@/layouts/InterfaceLayout/containers/DeployContractContainer/DeployContractContainer.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

describe('DeployContractContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const resetView = jest.fn();

  beforeAll(() => {
    window.scrollTo = jest.fn().mockImplementation((valX, valY) => {
      window.pageXOffset = valX;
      window.pageYOffset = valY;
    });

    document.execCommand = jest.fn().mockImplementation(command => {
      return command;
    });

    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = new VueX.Store({
      modules: {
        main: {
          namespaced: true,
          state,
          getters
        }
      }
    });
    Vue.config.warnHandler = () => {};
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

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render correct bytecode', async () => {
    const bytecode = 'bytecode';
    wrapper.setData({ bytecode });
    await wrapper.vm.$nextTick();
    const textarea = wrapper.findAll('textarea').at(0).element.value;
    expect(textarea).toEqual(bytecode);
  });

  it('should render correct abi', async () => {
    const abi = 'abi';
    wrapper.setData({ abi });
    await wrapper.vm.$nextTick();
    const textarea = wrapper.findAll('textarea').at(1).element.value;
    expect(textarea).toEqual(abi);
  });

  it('should render correct contractName', async () => {
    const contractName = 'contractName';
    wrapper.setData({ contractName });
    await wrapper.vm.$nextTick();
    const input = wrapper.findAll('.contract-name input').at(0).element.value;
    expect(input).toEqual(contractName);
  });

  it('should render correct contractName placeholder', () => {
    const placeholder = wrapper
      .findAll('.contract-name input')
      .at(0)
      .attributes().placeholder;
    expect(placeholder).toEqual('Name for the contract');
  });

  it('should have correct value for isValidAbi', async () => {
    const abi = '[]';
    wrapper.setData({ abi });
    await wrapper.vm.$nextTick();
    const icon = wrapper.findAll('i.good-button').at(1);
    expect(icon.classes()).not.toContain('not-good');
  });

  it('should have correct value for isValidByte', async () => {
    const bytecode = '0xabcdef1234';
    wrapper.setData({ bytecode });
    await wrapper.vm.$nextTick();
    const icon = wrapper.findAll('i.good-button').at(0);
    expect(icon.classes()).not.toContain('not-good');
  });

  it('should clear the form', () => {
    const clearFunc = jest.spyOn(wrapper.vm, 'clear');
    const button = wrapper.find('.clear-all-btn');
    button.trigger('click');
    expect(clearFunc).toHaveBeenCalled();
    expect(wrapper.vm.bytecode).toEqual('');
    expect(wrapper.vm.abi).toEqual('');
    expect(wrapper.vm.contractName).toEqual('');
  });

  describe('DeployContractContainer.vue Methods', () => {
    it('should execute `copy` command when button is clicked', () => {
      wrapper
        .findAll('.title-button')
        .at(1)
        .trigger('click');
      expect(document.execCommand).toHaveBeenCalled();
    });

    it('should Open confirmationModal when click button', () => {
      window.pageXOffset = 100;
      window.pageYOffset = 100;
      wrapper.find('.submit-button').trigger('click');
      expect(window.pageXOffset).toBe(0);
      expect(window.pageYOffset).toBe(0);
    });
  });

  it('dismounts', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
