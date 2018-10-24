import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal/InterfaceNetworkModal.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import store from 'store';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import sinon from 'sinon';

import {
  Tooling
} from '@@/helpers';

function capitalize(value){
  if(!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

describe('InterfaceNetworkModal.vue', () => {
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
        
        let actions = {
          switchNetwork: jest.fn(),
          setWeb3Instance: jest.fn()
        };

        store = new Vuex.Store({
          state: {
            web3: newWeb3,
            Networks: nodeList,
            network: network
          },
          actions
        });

        Vue.config.errorHandler = () => {};
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceNetworkModal, {
            localVue,
            i18n,
            store,
            stubs:{
                'interface-bottom-text':InterfaceBottomText
            },
        });
    });

    it('should render correct types data', () => {
       const optionElements = wrapper.vm.$el.querySelectorAll('.input-block-container select option');
       var types = Object.keys(wrapper.vm.$data.types);
       for(var i =0 ; i<types.length; i++) {
        var type = types[i];
        if(optionElements[i]!==undefined)
            expect(optionElements[i].textContent.trim().toLowerCase()).toEqual((wrapper.vm.$data.types[type].name + ' - ' + wrapper.vm.$data.types[type].name_long).toLowerCase());
       }
    });

    it('should render correct username data' , () => {
        const username = 'username';
        wrapper.setData({username});
        expect(wrapper.vm.$el.querySelectorAll('.auth-form-container input')[0].value).toEqual(username);
    });

    it('should render correct password data' , () => {
        const password = 'password';
        wrapper.setData({password});
        expect(wrapper.vm.$el.querySelectorAll('.auth-form-container input')[1].value).toEqual(password);
    });

    it('should render correct name data' , () => {
        const name = 'name';
        wrapper.setData({name});
        expect(wrapper.vm.$el.querySelectorAll('.content-block .input-block-container input')[0].value).toEqual(name);
    });

    it('should render correct url data' , () => {
        const url = 'url';
        wrapper.setData({url});
        expect(wrapper.vm.$el.querySelectorAll('.content-block .input-block-container input')[1].value).toEqual(url);
    });

    it('should render correct port data' , () => {
        const port = 'port';
        wrapper.setData({port});
        expect(wrapper.vm.$el.querySelectorAll('.content-block .input-block-container input')[2].value).toEqual(port);
    });

    it('should render correct blockExplorerTX data' , () => {
        const blockExplorerTX = 123;
        wrapper.setData({blockExplorerTX});
        expect(wrapper.vm.$el.querySelectorAll('.content-block .input-block-container input')[3].value).toEqual(String(blockExplorerTX));
    });

    it('should render correct chainID data' , () => {
        const chainID = 333221;
        wrapper.setData({chainID});
        expect(wrapper.vm.$el.querySelectorAll('.content-block .input-block-container input')[4].value).toEqual(String(chainID));
    });

    it('should render correct blockExplorerAddr data' , () => {
        const blockExplorerAddr = 423432;
        wrapper.setData({blockExplorerAddr});
        expect(wrapper.vm.$el.querySelectorAll('.content-block .input-block-container input')[5].value).toEqual(String(blockExplorerAddr));
    });
    
  describe('InterfaceNetworkModal.vue Methods', () => {
    it('should switch network Method when button click', () => {
        const netElements = wrapper.findAll('.grid-3 p');
        for(var i =0; i<netElements.length; i++) {
            netElements.at(i).trigger('click');
            expect(netElements.at(i).text()).toEqual(wrapper.vm.$data.selectedNetwork.service);
        }
    });

    it('should save custom network when button click' ,  () => {
        wrapper.find('.save-button').trigger('click');
        expect(wrapper.vm.$data.customNetworks.length).toEqual(1);
    });


    it('should remove  custom network when button click' ,  () => {
        for(var i=0; i< 2; i++) 
            wrapper.find('.save-button').trigger('click');
        const customNetworkElements = wrapper.findAll('.network-list .content-block .grid-3 div.switch-network i');
        for(var i =0; i< customNetworkElements.length; i++) {
            let customNetworkElement = customNetworkElements.at(0);
            customNetworkElement.trigger('click');
        }
        expect(wrapper.vm.$data.customNetworks.length).toBe(0);
    });

    it('should reset state when button click', () => {
        wrapper.find('.save-button').trigger('click');
        expect(wrapper.vm.$data.chainID).toEqual('');
        expect(wrapper.vm.$data.username).toEqual('');
        expect(wrapper.vm.$data.password).toEqual('');
        expect(wrapper.vm.$data.name).toEqual('');
        expect(wrapper.vm.$data.port).toEqual('');
        expect(wrapper.vm.$data.blockExplorerAddr).toEqual('');
        expect(wrapper.vm.$data.blockExplorerTX).toEqual('');
    });
  });
});
