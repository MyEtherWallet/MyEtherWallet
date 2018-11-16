import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import DappButtons from '@/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue';

import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot><p class="param">{{to}}</p></div>',
  props:['to']  
}

describe('DappButtons.vue', () => {
    let localVue, i18n, wrapper, store;

    const title = 'DappButtons title';
    const desc = 'DappButtons desc';
    const icon = 'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
    const param = 'DappButtons param';
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(DappButtons, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData:{ title, desc, icon, param},
          stubs: {'router-link':RouterLinkStub }
        });
    });

    it('should render correct title', () => {
      expect(wrapper.vm.$el.querySelector('.dapps-button h4').textContent.trim()).toEqual(title);
    });

    it('should render correct description', () => {
      expect(wrapper.vm.$el.querySelector('.dapps-button p').textContent.trim()).toEqual(desc)
    });

    it('should render correct icon', () => {
      expect(wrapper.vm.$el.querySelector('.dapps-button img').src.trim()).toEqual(icon);
    });

    it('should render correct param', () => {
      expect(wrapper.vm.$el.querySelector('.param').textContent.trim()).toEqual(param);
    });

    it('should render correct active', () => {
      expect(wrapper.find('.dapps-button').classes().indexOf('disabled')).toBe(-1);
      wrapper.setProps({active:false})
      expect(wrapper.find('.dapps-button').classes().indexOf('disabled')).toBeGreaterThan(-1);
    });

  describe('DappButtons.vue Methods', () => {

  });
});
