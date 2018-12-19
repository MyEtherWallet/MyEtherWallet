import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon';
import ManageENSContainer from '@/dapps/RegisterDomain/containers/ManageENSContainer/ManageENSContainer.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import {
  Tooling
} from '@@/helpers';

describe('ManageENSContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => { };

    const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);

    const newWeb3 = new Web3(
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
    wrapper = shallowMount(ManageENSContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-bottom-text': InterfaceBottomText
      }
    });
  });

  it('should render correct domainName props', () => {
    let domainName = 'domainName';
    wrapper.setProps({ domainName });
    expect(wrapper.vm.$el.querySelector('.manage-ens-container h3').textContent.trim().indexOf(domainName)).toBeGreaterThan(-1)
  });

  it('should render correct resolverAddress data', () => {
    let resolverAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
    wrapper.setData({ resolverAddress });
    expect(wrapper.vm.$el.querySelectorAll('.manage-form input')[0].value).toEqual(resolverAddress);
  });

  it('should render correct transferTo data', () => {
    let transferTo = 'transferTo';
    wrapper.setData({ transferTo });
    expect(wrapper.vm.$el.querySelectorAll('.manage-form input')[1].value).toEqual(transferTo);
  });

  describe('ManageENSContainer.vue Methods', () => {
    it('should render correct updateResolver props', () => {
      let updateResolver = sinon.stub();
      let resolverAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      wrapper.setData({ resolverAddress });
      wrapper.setProps({ updateResolver });
      wrapper.find('.submit-container button').trigger('click')
      expect(updateResolver.called).toBe(true);
    });

    it('should render correct transferDomain props', () => {
      let transferDomain = sinon.stub();
      wrapper.setData({ transferDomain });
      let resolverAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      wrapper.setData({ resolverAddress });
      wrapper.findAll('.submit-container button').at(1).trigger('click')
      expect(transferDomain.called).toBe(true);
    });
  });
});
