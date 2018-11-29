import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import RegisterDomain from '@/dapps/RegisterDomain/RegisterDomain.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import Vuex from 'vuex';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';

import {
  Tooling
} from '@@/helpers';


describe('RegisterDomain.vue', () => {
    let localVue, i18n, wrapper, store;
    const domainName = 'domainName';
    const bidAmount = 0.001;
    const bidMask = 0.002;
    const nameHash = 'nameHash';
    const labelHash = 'labelHash';
    const owner = 'owner';
    const resolverAddress = 'resolverAddress';
    const deedOwner = 'deedOwner';
    const secretPhrase = 'secretPhrase';
    const auctionDateEnd = Date.now();
    const highestBid = 'highestBid';
    const contractInitiated = true;
    const step = 10;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
        Vue.config.errorHandler = ()=>{};

        const network = nodeList['ETH'][3];
        const hostUrl = url.parse(network.url);

        const newWeb3 = new Web3(
          `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
            hostUrl.pathname
          }`
        );

        let getters = {
          Networks: () =>  {
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
        wrapper = shallowMount(RegisterDomain, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'back-button': BackButton,
          }
        });
    });

    xit('[FAILING MAX STACK] should render correct domain name data', () => {
        wrapper.setData({domainName});
        expect(wrapper.find('router-view').attributes('domain-name')).toEqual(domainName);
    });

    xit('[FAILING MAX STACK] should render correct bidAmount data', () => {
        wrapper.setData({bidAmount});
        expect(wrapper.find('router-view').attributes('bid-amount')).toEqual(String(bidAmount));
    });

    xit('[FAILING MAX STACK] should render correct bidMask data', () => {
        wrapper.setData({bidMask});
        expect(wrapper.find('router-view').attributes('bid-mask')).toEqual(String(bidMask));
    });

    xit('[FAILING MAX STACK] should render correct nameHash data', () => {
        wrapper.setData({nameHash});
        expect(wrapper.find('router-view').attributes('name-hash')).toEqual(nameHash);
    });

    xit('[FAILING MAX STACK] should render correct labelHash data', () => {
        wrapper.setData({labelHash});
        expect(wrapper.find('router-view').attributes('label-hash')).toEqual(labelHash);
    });

    xit('[FAILING MAX STACK] should render correct owner data', () => {
        wrapper.setData({ owner });
        expect(wrapper.find('router-view').attributes('owner')).toEqual(owner);
    });

    xit('[FAILING MAX STACK] should render correct resolverAddress data', () => {
        wrapper.setData({ resolverAddress });
        expect(wrapper.find('router-view').attributes('resolver-address')).toEqual(resolverAddress);
    });

    xit('[FAILING MAX STACK] should render correct deedOwner data', () => {
        wrapper.setData({ deedOwner });
        expect(wrapper.find('router-view').attributes('deed-owner')).toEqual(deedOwner);
    });

    xit('[FAILING MAX STACK] should render correct secretPhrase data', () => {
        wrapper.setData({ secretPhrase });
        expect(wrapper.find('router-view').attributes('secret-phrase')).toEqual(secretPhrase);
    });

    xit('[FAILING MAX STACK] should render correct auctionDateEnd data', () => {
        wrapper.setData({ auctionDateEnd });
        expect(wrapper.find('router-view').attributes('auction-date-end')).toEqual(String(auctionDateEnd));
    });

    xit('[FAILING MAX STACK] should render correct highestBidder data', () => {
      wrapper.setData({ highestBid });
      expect(wrapper.find('router-view').attributes('highest-bidder')).toEqual(highestBid);
    });

    xit('[FAILING MAX STACK] should render correct contractInitiated data', () => {
      wrapper.setData({ contractInitiated });
      expect(wrapper.find('router-view').attributes('contract-initiated')).toEqual(String(contractInitiated));
    });

    xit('[FAILING MAX STACK] should render correct step data', () => {
      wrapper.setData({ step });
      expect(wrapper.find('router-view').attributes('step')).toEqual(String(step));
    });
});
