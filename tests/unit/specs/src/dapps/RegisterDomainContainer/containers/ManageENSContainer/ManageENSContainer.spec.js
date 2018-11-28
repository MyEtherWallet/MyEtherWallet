import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon';
import ManageENSContainer from '@/dapps/RegisterDomain/containers/ManageENSContainer/ManageENSContainer.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import {
  Tooling
} from '@@/helpers';

xdescribe('ManageENSContainer.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
    });

    beforeEach(() => {
        wrapper = shallowMount(ManageENSContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs:{
            'interface-bottom-text': InterfaceBottomText
          }
        });
    });

    it('should render correct domainName props', () => {
    });

    describe('ManageENSContainer.vue Methods', () => {
     
    });
});
