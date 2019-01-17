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
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
// import sinon from 'sinon';

import { Tooling, ETH_NETWORK_INDEX } from '@@/helpers';

describe('[Needs Cleaned Up 1-16-19] InteractWithContractContainer.vue', () => {
  let localVue, i18n, /*wrapper,*/ store /*, getters*/;
  const resetView = jest.fn();

  // beforeAll(() => {
  //   const baseSetup = Tooling.createLocalVueInstance();
  //   localVue = baseSetup.localVue;
  //   i18n = baseSetup.i18n;
  //   store = baseSetup.store;

  //   const network = nodeList['ETH'][3];
  //   const hostUrl = url.parse(network.url);

  //   const newWeb3 = new Web3(
  //     `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
  //     hostUrl.pathname
  //     }`
  //   );

  //   getters = {
  //     network: () => {
  //       return network;
  //     },
  //     web3: () => {
  //       return newWeb3;
  //     }
  //   };

  //   store = new VueX.Store({
  //     getters,
  //     state: {
  //       gasPrice: '',
  //       web3: newWeb3,
  //       Networks: nodeList,
  //       wallet: {
  //         getAddressString: jest.fn(x => 0)
  //       }
  //     }
  //   });

  //   Vue.config.errorHandler = () => { };
  // });

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

    const network = nodeList['ETH'][ETH_NETWORK_INDEX];
    const hostUrl = url.parse(network.url);

    const newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
        hostUrl.pathname
      }`
    );

    const wallet = {
      getAddressString: function() {
        return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      }
    };

    const getters = {
      gasPrice: () => {},
      web3: () => {
        return newWeb3;
      },
      wallet: () => {
        return wallet;
      }
    };

    store = new VueX.Store({
      actions,
      getters,
      state: {
        web3: newWeb3,
        network: network,
        wallet: {
          getAddressString: function() {
            return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
          }
        }
      }
    });
  });

  beforeEach(() => {
    // wrapper = shallowMount(DeployContractContainer, {
    //   localVue,
    //   i18n,
    //   store,
    //   attachToDocument: true,
    //   stubs: {
    //     'interface-bottom-text': InterfaceBottomText,
    //     'interface-container-title': InterfaceContainerTitle,
    //     'currency-picker': CurrencyPicker,
    //     'popover': PopOver
    //   }
    // });
    const wrapper = shallowMount(DeployContractContainer, {
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

  it('should render correct abi data', () => {});
});
