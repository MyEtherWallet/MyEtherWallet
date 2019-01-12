import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon';
import BuySubdomain from '@/dapps/BuySubdomain/BuySubdomain.vue';
import domains from '@/dapps/BuySubdomain/domains.json';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import SubdomainAbi from '@/helpers/subdomainAbi.js';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import {
  Tooling
} from '@@/helpers';

describe('BuySubdomain.vue', () => {
  let localVue, i18n, wrapper, store, newWeb3;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => { };

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
      ens: () => {

      }
    };

    store = new Vuex.Store({
      getters
    });

  });

  beforeEach(() => {
    wrapper = shallowMount(BuySubdomain, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-bottom-text': InterfaceBottomText
      }
    });
  });

  it('should render correct knownRegistrarInstances data', () => {
    wrapper.find('.subdomain-input input').setValue('adsfasdf');
    let web3C = newWeb3.eth.Contract;
    let knownRegistrarInstances = {};
    domains.forEach(domain => {
      const updatedDomain = Object.assign({}, domain);
      updatedDomain.contract = new web3C(SubdomainAbi, domain.registrar);
      knownRegistrarInstances[domain.name] = updatedDomain;
    });

    expect(JSON.stringify(knownRegistrarInstances)).toEqual(JSON.stringify(wrapper.vm.$data.knownRegistrarInstances));
  });

  describe('BuySubdomain.vue Methods', () => {

  });
});
