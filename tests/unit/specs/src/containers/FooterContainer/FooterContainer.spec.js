import Vue from 'vue';
import { shallowMount , mount } from '@vue/test-utils'
import FooterContainer from '@/containers/FooterContainer/FooterContainer.vue';


const $t = ()=>{}

const RouterLinkStub = {
  name:'router-link',
  template:'<p> <slot> </slot></p>',
  props:['to']  
}

import {
  Tooling
} from '@@/helpers';


describe('FooterContainer.vue', () => {

    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = mount(FooterContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {'router-link':RouterLinkStub }
        });
    });


  it('should render correct lowerLinks', () => {

    const linkWrappers = wrapper.findAll(RouterLinkStub)

    var lowerLinkWrappers = []
    for(var i=0; i< linkWrappers.length; i++) {
      const linkWrapper = linkWrappers.at(i);
      if(linkWrapper.vm.$el.parentElement.parentElement.className.indexOf('foot-note')>-1) {
        lowerLinkWrappers.push(linkWrapper)
      }
    }

    for(var i=0; i< wrapper.vm.$data.lowerLinks.length; i++) {
      var lowerLink = wrapper.vm.$data.lowerLinks[i];
      const lowerLinkWrapper = lowerLinkWrappers[i];
      expect(lowerLinkWrapper.vm.to).toEqual(lowerLink.to)
    }
  });

  it('should render correct links', () => {
    const socialElement = wrapper.vm.$el.querySelector('.social');
    const linksElements = socialElement.getElementsByTagName('a')

    for(var i=0; i< wrapper.vm.$data.links.length; i++) {
      const linksElement = linksElements[i];
      var link = wrapper.vm.$data.links[i];

      const icoClassName = linksElement.getElementsByTagName('i')[0].className
      icoClassName = icoClassName.replace('fa ','')
      expect(link.to).toEqual(linksElement.href)
      expect(link.class).toEqual(icoClassName)
    }
  });

  it('should render correct footerContent', () => {
    const contentWrappers = wrapper.findAll(RouterLinkStub)

    var contentsElements = []
    for(var i=0; i< contentWrappers.length; i++) {
      const contentWrapper = contentWrappers.at(i);

      if(contentWrapper.vm.$el.parentElement.parentElement.className.indexOf('content-links')>-1) {
        contentsElements.push(contentWrapper)
      }
    }


    var contents = []
    for(var i=0; i< wrapper.vm.$data.footerContent.length; i++) {
      var footerContent = wrapper.vm.$data.footerContent[i];
      for(var j=0; j<footerContent.contents.length; j++) {
        if(footerContent.contents[j].to !== undefined) {
          contents.push(footerContent.contents[j])
        }
      }
    }

    for(var i=0; i<contentsElements.length; i++) {
      expect(contents[i].to).toEqual(contentsElements[i].vm.to)
    }
  });
  
  describe('FooterContainer.vue Methods', () => {});
});
