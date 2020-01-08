import Vue from 'vue';

import { shallowMount } from '@vue/test-utils';
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal/InterfaceNetworkModal.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';

import { Tooling } from '@@/helpers';

describe('InterfaceNetworkModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

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

  it('should render correct username data', () => {
    const username = 'TEST_WALLET';
    wrapper.setData({ username });
    wrapper.vm.$nextTick(() => {
      const inputUsername = wrapper.findAll('.auth-form-container input').at(0);
      expect(inputUsername.value).toEqual(username);
    });
  });

  it('should render correct password data', () => {
    const password = '&3aB#(CC@0dk@x';
    wrapper.setData({ password });
    wrapper.vm.$nextTick(() => {
      const inputPassword = wrapper.findAll('.auth-form-container input').at(1);
      expect(inputPassword.value).toEqual(password);
    });
  });

  it('should render correct name data', () => {
    const name = 'James';
    wrapper.setData({ name });
    wrapper.vm.$nextTick(() => {
      const inputName = wrapper
        .findAll('.content-block .input-block-container input')
        .at(0);
      expect(inputName.value).toEqual(name);
    });
  });

  it('should render correct url data', () => {
    const url = 'https://localhost:8000';
    wrapper.setData({ url });
    wrapper.vm.$nextTick(() => {
      const inputURL = wrapper
        .findAll('.content-block .input-block-container input')
        .at(1);
      expect(inputURL.value).toEqual(url);
    });
  });

  it('should render correct port data', () => {
    const port = 80;
    wrapper.setData({ port });
    wrapper.vm.$nextTick(() => {
      const inputPort = wrapper
        .findAll('.content-block .input-block-container input')
        .at(2);
      expect(inputPort.value).toEqual(String(port));
    });
  });

  it('should render correct blockExplorerTX data', () => {
    const blockExplorerTX = 'blockExplorerTX';
    wrapper.setData({ blockExplorerTX });
    wrapper.vm.$nextTick(() => {
      const inputBlockExplorerTX = wrapper
        .findAll('.content-block .input-block-container input')
        .at(3);
      expect(inputBlockExplorerTX.value).toEqual(String(blockExplorerTX));
    });
  });

  it('should render correct chainID data', () => {
    const chainID = '100000000';
    wrapper.setData({ chainID });
    wrapper.vm.$nextTick(() => {
      const inputChainID = wrapper
        .findAll('.content-block .input-block-container input')
        .at(4);
      expect(inputChainID.value).toEqual(String(chainID));
    });
  });

  it('should render correct blockExplorerAddr data', () => {
    const blockExplorerAddr = '100000000';
    wrapper.setData({ blockExplorerAddr });
    wrapper.vm.$nextTick(() => {
      const inputBlockExplorerAddr = wrapper
        .findAll('.content-block .input-block-container input')
        .at(5);
      expect(inputBlockExplorerAddr.value).toEqual(String(blockExplorerAddr));
    });
  });

  describe('InterfaceNetworkModal.vue Methods', () => {
    it('should remove  custom network when button click', () => {
      wrapper.vm.$nextTick(() => {
        for (let i = 0; i < 2; i++)
          wrapper.find('.save-button').trigger('click');
        const customNetworkElements = wrapper.findAll(
          '.network-list .content-block .grid-3 div.switch-network i'
        );
        for (let i = 0; i < customNetworkElements.length; i++) {
          const customNetworkElement = customNetworkElements.at(0);
          customNetworkElement.trigger('click');
        }
        expect(wrapper.vm.$data.customNetworks.length).toBe(0);
      });
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
