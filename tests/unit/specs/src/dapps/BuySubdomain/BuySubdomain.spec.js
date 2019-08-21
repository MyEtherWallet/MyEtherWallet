import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import BuySubdomain from '@/dapps/BuySubdomain/BuySubdomain.vue';
import domains from '@/dapps/BuySubdomain/domains.json';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import SubdomainAbi from '@/helpers/subdomainAbi.js';
import { Tooling } from '@@/helpers';
import { state } from '@@/helpers/mockStore';

describe('BuySubdomain.vue', () => {
  let localVue, i18n, wrapper, store, newWeb3;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
    newWeb3 = state.web3;
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

  xit('should render correct knownRegistrarInstances data', () => {
    wrapper.find('.subdomain-input input').setValue('adsfasdf');
    const web3C = newWeb3.eth.Contract;
    const knownRegistrarInstances = {};
    domains.forEach(domain => {
      const updatedDomain = Object.assign({}, domain);
      updatedDomain.contract = new web3C(SubdomainAbi, domain.registrar);
      knownRegistrarInstances[domain.name] = updatedDomain;
    });

    expect(JSON.stringify(knownRegistrarInstances)).toEqual(
      JSON.stringify(wrapper.vm.$data.knownRegistrarInstances)
    );
  });

  describe('BuySubdomain.vue Methods', () => {});
});
