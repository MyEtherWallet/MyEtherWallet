import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import CreateWalletModal from '@/layouts/CreateWalletLayout/components/CreateWalletModal/CreateWalletModal.vue';

import {
  Tooling
} from '@@/helpers';

const showModal = jest.fn(()=> console.log('showmodal function called'))

const BModalStub = {
  name:'router-link',
  template:'<div><slot></slot></div>',
  props:['to'],
  methods: {
    show: showModal
  }  
}

describe('CreateWalletModal.vue', () => {
    let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(CreateWalletModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            "b-modal":BModalStub
          }
        });
    });

  it('should render correct contents', () => {
    expect( showModal ).toHaveBeenCalled()
  });

  describe('CreateWalletModal.vue Methods', () => { });
});
