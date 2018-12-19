import Vue from 'vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import AlreadyOwnedENSContainer from '@/dapps/RegisterDomain/containers/AlreadyOwnedENSContainer/AlreadyOwnedENSContainer.vue';
import FinalizeModal from '@/dapps/RegisterDomain/components/FinalizeModal/FinalizeModal.vue';
import {
  Tooling
} from '@@/helpers';

import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';

const showModal = sinon.stub()

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
}

describe('AlreadyOwnedENSContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const labelHash = 'labelHash';
  const nameHash = 'nameHash';
  const owner = 'owner';
  const deedOwner = 'deedOwner';
  const resolverAddress = 'resolverAddress';
  const domainName = 'domainName';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    const wallet = {
      getChecksumAddressString: jest.fn(x => 0),
      getAddressString: function () {
        return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      }
    };
    const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);

    const newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
      hostUrl.pathname
      }`
    );
    let getters = {
      wallet: () => {
        return wallet;
      },
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
    wrapper = shallowMount(AlreadyOwnedENSContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { labelHash, nameHash, owner, deedOwner, resolverAddress, domainName },
      stubs: {
        'b-modal': BModalStub,
        'finalize-modal': FinalizeModal
      }
    });
  });

  it('should render correct domain name props', () => {
    expect(wrapper.vm.$el.querySelector('.already-owned-container h3').textContent.trim().indexOf(domainName)).toBeGreaterThan(-1);
  });

  it('should render correct labelHash props', () => {
    expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[0].textContent.trim()).toEqual(labelHash);
  });

  it('should render correct nameHash props', () => {
    expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[1].textContent.trim()).toEqual(nameHash);
  });

  it('should render correct owner props', () => {
    expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[2].textContent.trim()).toEqual(owner);
  });

  it('should render correct deedOwner props', () => {
    expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[3].textContent.trim()).toEqual(deedOwner);
  });

  it('should render correct resolverAddress props', () => {
    expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[4].textContent.trim()).toEqual(resolverAddress);
  });


  describe('AlreadyOwnedENSContainer Method.vue', () => {
    it('should render correct openFinalizeModal method', () => {
      wrapper.vm.openFinalizeModal();
      expect(showModal.called).toBe(true);
    });
  });
});
