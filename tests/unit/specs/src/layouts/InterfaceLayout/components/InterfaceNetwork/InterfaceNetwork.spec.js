import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import { shallowMount } from '@vue/test-utils'
import InterfaceNetwork from '@/layouts/InterfaceLayout/components/InterfaceNetwork/InterfaceNetwork.vue';
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal/InterfaceNetworkModal.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import sinon from 'sinon'
import {
  Tooling
} from '@@/helpers';

const showModal = sinon.stub();

const BModalStub = {
  name:'b-modal',
  template:'<div><slot></slot></div>',
  props:['to'],
  methods: {
    show: showModal
  }  
}

describe('InterfaceNetwork.vue', () => {
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

        store = new Vuex.Store({
          state: {
            web3: newWeb3,
            Networks: nodeList,
            network: network
          }
        });
        
        Vue.config.errorHandler = ()=>{};
        Vue.config.warnHandler = ()=>{};
        Vue.config.silent = true;
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceNetwork, {
            localVue,
            i18n,
            store,
            stubs:{
                'interface-network-modal':InterfaceNetworkModal,
                'popover':PopOver,
                'b-modal':BModalStub
            }
        });
    });

    it('should render correct blockNumber props', () => {
        const blockNumber = 100;
        wrapper.setProps({blockNumber});
        expect(wrapper.find('.information-container span').text()).toEqual(String(blockNumber));
    });

  describe('InterfaceNetwork.vue Methods', () => {
    it('should render correct networkModalOpen method', () => {
        wrapper.vm.networkModalOpen();
        expect(showModal.called).toBe(true);
    });

  });
});
