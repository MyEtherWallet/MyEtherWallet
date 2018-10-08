import Vue from 'vue';
import { shallowMount , mount} from '@vue/test-utils'
import Categories from '@/layouts/HelpCenterLayout/components/Categories/Categories.vue';
import CategoryButton from '@/layouts/HelpCenterLayout/components/CategoryButton/CategoryButton.vue';
import {
  Tooling
} from '@@/helpers';


describe('Categories.vue', () => {
   let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(Categories, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs:{
            'category-button':CategoryButton
          }
        });
    });


    it('should render correct contents', () => {
      console.log(wrapper.html())

      console.log(wrapper.vm.$el.querySelectorAll('.category-buttons li'))

      for(var i=0; i<wrapper.vm.$el.querySelectorAll('.category-buttons li').length; i++) {
          const categoryButtonElement = wrapper.vm.$el.querySelectorAll('.category-buttons li')[i]
          // console.log('button icon:%O', categoryButtonElement.querySelector('.button-icon img').getAttribute('src'))
          console.log('button title:%O', categoryButtonElement.querySelector('.button-title').textContent.trim() )

          // expect(categoryButtonElement.querySelector('.button-icon img').getAttribute('src')).toEqual(wrapper.vm.$data.categoryButtons[i].icon)
          expect(categoryButtonElement.querySelector('.button-title').textContent.trim()).toEqual(wrapper.vm.$data.categoryButtons[i].title)
      }

      for(var i=0; i<wrapper.vm.$el.querySelectorAll('.link-block').length; i++) {
          const linkBlockElement = wrapper.vm.$el.querySelectorAll('.link-block')[i]
            

          expect(linkBlockElement.querySelector('.block-icon img').getAttribute('src')).toEqual(wrapper.vm.$data.linkBlocks[i].icon)
          expect(linkBlockElement.querySelector('.description').textContent.trim()).toEqual(wrapper.vm.$data.linkBlocks[i].description)
          expect(linkBlockElement.querySelector('.block-title').textContent.trim()).toEqual(wrapper.vm.$data.linkBlocks[i].title)
          expect(linkBlockElement.querySelector('.email a').href.replace('mailto:', '')).toEqual(wrapper.vm.$data.linkBlocks[i].email)
          const socialElements = linkBlockElement.querySelectorAll('.social div')
          
          for(var j = 0 ; j<socialElements.length; j++) {
            const socialElement = socialElements[h];
            
            expect(socialElement.querySelector('a').href).toEqual(wrapper.vm.$data.linkBlocks[i].social[j].link+"/")
            expect(socialElement.querySelector('img').getAttribute('src')).toEqual(wrapper.vm.$data.linkBlocks[i].social[j].icon)
          }
      }
    });

    describe('Categories.vue Methods', () => {});
});
