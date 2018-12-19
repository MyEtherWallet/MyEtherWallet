import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import ConfirmationContainer from '@/containers/ConfirmationContainer/ConfirmationContainer.vue';

import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';

import {
  Tooling
} from '@@/helpers';


const mockRoute = {
  $on: jest.fn()
};

xdescribe('ConfirmationContainer.vue', () => {
  let localVue, i18n, wrapper, store, newWeb3;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);

    newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
      hostUrl.pathname
      }`
    );

    let getters = {
      Networks: () => {
        return nodeList
      },
      network: () => {
        return network
      },
      web3: () => {
        return newWeb3
      },
      wallet: () => { },
      gasPrice: () => {

      }
    };

    store = new Vuex.Store({
      getters
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(ConfirmationContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      mocks: {
        $eventHub:  mockRoute,
      }
    });
  });

  it('should render correct contents', () => {

  });

  describe('ConfirmationContainer.vue Methods', () => { });
});
