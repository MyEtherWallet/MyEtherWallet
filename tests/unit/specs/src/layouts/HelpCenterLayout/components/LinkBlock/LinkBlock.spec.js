import Vue from 'vue';
import { shallowMount , mount} from '@vue/test-utils'
import LinkBlock from '@/layouts/HelpCenterLayout/components/LinkBlock/LinkBlock.vue';

import {
  Tooling
} from '@@/helpers';

const content = {
          icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg',
          title:'linkblock  title',
          description:'linkblock description',
          email:'stuntblitz@gmail.com',
          social:[
            { key:'twitter', link:'http://www.twitter.com', icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'},
            { key:'facebook', link:'http://www.facebook.com', icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'},
            { key:'instagram', link:'http://www.instagram.com', icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'}
          ]
        }

describe('LinkBlock.vue', () => {
   let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        

        wrapper = shallowMount(LinkBlock, {
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
      expect(wrapper.vm.$el.querySelector('.block-icon img').getAttribute('src')).toEqual(content.icon)
      expect(wrapper.vm.$el.querySelector('.description').textContent.trim()).toEqual(content.description)
      expect(wrapper.vm.$el.querySelector('.block-title').textContent.trim()).toEqual(content.title)
      expect(wrapper.vm.$el.querySelector('.email a').href.replace('mailto:', '')).toEqual(content.email)
      const socialElements = wrapper.vm.$el.querySelectorAll('.social div')
      console.log(socialElements.length)
      for(var i =0 ; i<socialElements.length; i++) {
        const socialElement = socialElements[i];
        console.log(socialElement.querySelector('a').href)
        expect(socialElement.querySelector('a').href).toEqual(content.social[i].link+"/")
        expect(socialElement.querySelector('img').getAttribute('src')).toEqual(content.social[i].icon)

      }
    });

    describe('LinkBlock.vue Methods', () => {});
});
