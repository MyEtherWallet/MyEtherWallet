import Vue from 'vue';
import { shallowMount , mount} from '@vue/test-utils'
import CategoryButton from '@/layouts/HelpCenterLayout/components/CategoryButton/CategoryButton.vue';

import {
  Tooling
} from '@@/helpers';

const content = {
          icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg',
          title:'CategoryButton  title'
        }

describe('CategoryButton.vue', () => {
   let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        

        wrapper = shallowMount(CategoryButton, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: {
            content:content
          }
        });
    });

    it('should render correct contents', () => {
      console.log('button icon:%O', wrapper.vm.$el.querySelector('.button-icon img').getAttribute('src'))
      console.log('button title:%O', wrapper.vm.$el.querySelector('.button-title').textContent.trim() )
      expect(wrapper.vm.$el.querySelector('.button-icon img').getAttribute('src')).toEqual(content.icon)
      expect(wrapper.vm.$el.querySelector('.button-title').textContent.trim()).toEqual(content.title)
    });

    describe('CategoryButton.vue Methods', () => {});
});
