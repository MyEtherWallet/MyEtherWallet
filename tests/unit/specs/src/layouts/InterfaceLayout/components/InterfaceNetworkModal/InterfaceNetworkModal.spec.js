import Vue from 'vue';

import { shallowMount } from '@vue/test-utils';
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal/InterfaceNetworkModal.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';
import { Tooling } from '@@/helpers';

describe('InterfaceNetworkModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
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
    wrapper = shallowMount(InterfaceNetworkModal, {
      localVue,
      i18n,
      store,
      stubs: {
        'interface-bottom-text': InterfaceBottomText
      }
    });
  });

  it('should render correct types data', () => {
    const optionElements = wrapper.findAll(
      '.input-block-container select option'
    );
    const types = Object.keys(wrapper.vm.$data.types);
    for (const [i, type] of types.entries()) {
      if (optionElements[i] !== undefined) {
        expect(
          optionElements[i].textContent
            .trim()
            .toLowerCase()
            .indexOf(wrapper.vm.$data.types[type].name.toLowerCase())
        ).toBeGreaterThan(-1);
        expect(
          optionElements[i].textContent
            .trim()
            .toLowerCase()
            .indexOf(wrapper.vm.$data.types[type].name_long.toLowerCase())
        ).toBeGreaterThan(-1);
      }
    }
  });

  it('should render correct username data', async () => {
    const username = 'TEST_WALLET';
    const checkboxElement = wrapper.find('.sliding-switch-white .switch input');
    checkboxElement.trigger('click');
    wrapper.setData({ username: username });
    await wrapper.vm.$nextTick();
    const inputUsername = wrapper.findAll('.auth-form-container input').at(0);
    expect(inputUsername.element.value).toEqual(username);
  });

  it('should render correct password data', async () => {
    const password = '&3aB#(CC@0dk@x';
    wrapper.setData({ password });
    await wrapper.vm.$nextTick();
    const inputPassword = wrapper.findAll('.auth-form-container input').at(1);
    expect(inputPassword.element.value).toEqual(password);
  });

  it('should render correct name data', async () => {
    const name = 'James';
    wrapper.setData({ name });
    await wrapper.vm.$nextTick();
    const inputName = wrapper
      .findAll('.content-block .input-block-container input')
      .at(0);
    expect(inputName.element.value).toEqual(name);
  });

  it('should render correct url data', async () => {
    const url = 'https://localhost:8000';
    wrapper.setData({ url });
    await wrapper.vm.$nextTick();
    const inputURL = wrapper
      .findAll('.content-block .input-block-container input')
      .at(1);
    expect(inputURL.element.value).toEqual(url);
  });

  it('should render correct port data', async () => {
    const port = 80;
    wrapper.setData({ port });
    await wrapper.vm.$nextTick();
    const inputPort = wrapper
      .findAll('.content-block .input-block-container input')
      .at(2);
    expect(inputPort.element.value).toEqual(String(port));
  });

  it('should render correct blockExplorerTX data', async () => {
    const blockExplorerTX = 'blockExplorerTX';
    wrapper.setData({ blockExplorerTX });
    await wrapper.vm.$nextTick();
    const inputBlockExplorerTX = wrapper
      .findAll('.content-block .input-block-container input')
      .at(3);
    expect(inputBlockExplorerTX.element.value).toEqual(String(blockExplorerTX));
  });

  it('should render correct chainID data', async () => {
    const chainID = '100000000';
    wrapper.setData({ chainID });
    await wrapper.vm.$nextTick();
    const inputChainID = wrapper
      .findAll('.content-block .input-block-container input')
      .at(4);
    expect(inputChainID.element.value).toEqual(String(chainID));
  });

  it('should render correct blockExplorerAddr data', async () => {
    const blockExplorerAddr = '100000000';
    wrapper.setData({ blockExplorerAddr });
    await wrapper.vm.$nextTick();
    const inputBlockExplorerAddr = wrapper
      .findAll('.content-block .input-block-container input')
      .at(5);
    expect(inputBlockExplorerAddr.element.value).toEqual(
      String(blockExplorerAddr)
    );
  });

  describe('InterfaceNetworkModal.vue Methods', () => {
    it('should remove  custom network when button click', async () => {
      await wrapper.vm.$nextTick();
      for (let i = 0; i < 2; i++) wrapper.find('.save-button').trigger('click');
      const customNetworkElements = wrapper.findAll(
        '.network-list .content-block .grid-3 div.switch-network i'
      );
      for (let i = 0; i < customNetworkElements.length; i++) {
        const customNetworkElement = customNetworkElements.at(0);
        customNetworkElement.trigger('click');
      }
      expect(wrapper.vm.$data.customNetworks.length).toBe(2);
    });

    it('should reset state when button click', () => {
      wrapper.find('.save-button').trigger('click');
      const {
        username,
        password,
        name,
        port,
        blockExplorerAddr,
        blockExplorerTX
      } = wrapper.vm.$data;
      expect(username).toEqual('');
      expect(password).toEqual('');
      expect(name).toEqual('');
      expect(port).toEqual(443);
      expect(blockExplorerAddr).toEqual('');
      expect(blockExplorerTX).toEqual('');
    });
  });
});
