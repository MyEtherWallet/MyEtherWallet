import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import AccessWalletLayout from '@/layouts/AccessWalletLayout/AccessWalletLayout.vue';
import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']
}

describe('AccessWalletLayout.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;


        let getters = {
          online:() => {
            return true;
          }
        };

        store = new Vuex.Store({
          getters
        });

    });

    beforeEach(() => {
        wrapper = shallowMount(AccessWalletLayout, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs:{
            'router-link':RouterLinkStub
          }
        });
    });


  it('should render correct contents', () => {

     });

  describe('AccessWalletLayout.vue Methods', () => {});
});
