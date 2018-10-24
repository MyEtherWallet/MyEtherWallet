import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import HomeLayout from '@/layouts/HomeLayout/HomeLayout.vue';
import NewsContainer from '@/containers/NewsContainer/NewsContainer.vue';
import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}
describe('HomeLayout.vue', () => {
  let localVue, i18n, wrapper, store;
    
      beforeAll(() => {
          const baseSetup = Tooling.createLocalVueInstance();
          localVue = baseSetup.localVue;
          i18n = baseSetup.i18n;
          store = baseSetup.store;
          store.replaceState({online:true })
      });

      beforeEach(() => {
          wrapper = shallowMount(HomeLayout, {
            localVue,
            i18n,
            store,
            attachToDocument: true,
            stubs:{
              'news':NewsContainer,
              'router-link':RouterLinkStub
            }
          });
      });


  it('should render correct contents', () => {
       expect(wrapper.vm.$data.online).toBe(true);  
       expect(wrapper.find('div.news').exists()).toBe(true)
     });

  describe('HomeLayout.vue Methods', () => {});
});
