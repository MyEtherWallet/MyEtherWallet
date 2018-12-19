import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import FinalizeModal from '@/dapps/RegisterDomain/components/FinalizeModal/FinalizeModal.vue';
import {
  Tooling
} from '@@/helpers';

import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import sinon from 'sinon';

const hideModal = sinon.stub()
const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
}

describe('FinalizeModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
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
    wrapper = shallowMount(FinalizeModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct domain name', () => {
    let domainName = 'domainName';
    wrapper.setProps({ domainName });
    expect(wrapper.vm.$el.querySelector('.finalize-modal-container h3').textContent.trim().indexOf(domainName)).toBeGreaterThan(-1);
  });

  it('should render correct confirm button', () => {
    const finalize = sinon.stub();
    wrapper.setProps({ finalize });
    wrapper.findAll('.button-container button').at(1).trigger('click');
    expect(finalize.called).toBe(true);
  });

  describe('FinalizeModal.vue Methods', () => {
    it('should render correct close method', () => {
      wrapper.vm.close();
      expect(hideModal.called).toBe(true);
    });

    it('should hide modal when close button clicked', () => {
      const finalize = sinon.stub();
      wrapper.setProps({ finalize });
      wrapper.findAll('.button-container button').at(0).trigger('click');
      expect(hideModal.called).toBe(true);
    });
  });
});
