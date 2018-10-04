import Vue from 'vue';
import { shallowMount , RouterLink, createLocalVue } from '@vue/test-utils'
import FooterContainer from '@/containers/FooterContainer/FooterContainer.vue';
import VueRouter from 'vue-router'
import VueI18N from 'vue-i18n'

import Translations from '@/translations';

const $t = ()=>{}

// Vue.config.ignoredElements.push('router-link-stub')

const RouterLinkStub = {
  name:'router-link',
  template:'<p> <slot> </slot></p>',
  // render: ()=>{},
  props:['to']  
}

const localVue = createLocalVue()
localVue.use(VueI18N)

describe('FooterContainer.vue', () => {
  it('should render correct lowerLinks', () => {

    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(FooterContainer, {
              localVue,
              i18n,
              stubs: {'router-link':RouterLinkStub }
      });

    const linkWrappers = wrapper.findAll(RouterLinkStub)

    var lowerLinkWrappers = []
    for(var i=0; i< linkWrappers.length; i++) {
      const linkWrapper = linkWrappers.at(i);
      // console.log(linkWrapper.html())
      // console.log(linkWrapper.vm.to)
      // console.log(linkWrapper.vm.$el.parentElement.parentElement.className)

      if(linkWrapper.vm.$el.parentElement.parentElement.className.indexOf('foot-note')>-1) {
        lowerLinkWrappers.push(linkWrapper)
      }
    }



    for(var i=0; i< wrapper.vm.$data.lowerLinks.length; i++) {
      var lowerLink = wrapper.vm.$data.lowerLinks[i];
      const lowerLinkWrapper = lowerLinkWrappers[i];
      // console.log(linkWrapper.html())
      // console.log(linkWrapper.vm.to)
      // console.log(linkWrapper.vm.$el.parentElement.parentElement.className)
      expect(lowerLinkWrapper.vm.to).toEqual(lowerLink.to)
    }
  });

  it('should render correct links', () => {
    const wrapper = shallowMount(FooterContainer, {
              mocks:{$t},
              stubs: {'router-link':RouterLinkStub }
      });

    const socialElement = wrapper.vm.$el.querySelector('.social');
    console.log(socialElement)

    const linksElements = socialElement.getElementsByTagName('a')

    for(var i=0; i< wrapper.vm.$data.links.length; i++) {
      const linksElement = linksElements[i];
      var link = wrapper.vm.$data.links[i];
      console.log(' href:'  + linksElement.href)
      console.log(' component data link:' + link.to)

      const icoClassName = linksElement.getElementsByTagName('i')[0].className
      icoClassName = icoClassName.replace('fa ','')
      console.log(icoClassName)
      expect(link.to).toEqual(linksElement.href)
      expect(link.class).toEqual(icoClassName)
    }
  });

  it('should render correct footerContent', () => {

    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(FooterContainer, {
              localVue,
              i18n,
              stubs: {'router-link':RouterLinkStub }
      });

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

  it('should toggle footerContent when trigger click open and close', () => {

    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(FooterContainer, {
              attachToDocument:true,
              localVue,
              i18n,
              stubs: {'router-link':RouterLinkStub }
      });

    var contents = []
    for(var i=0; i< wrapper.vm.$data.footerContent.length; i++) {
      var footerContent = wrapper.vm.$data.footerContent[i];
      
      wrapper.find("." + footerContent.class + " .open").trigger('click')
      console.log(wrapper.vm.$el.querySelector("." + footerContent.class + " .content-links").className)
      expect(wrapper.vm.$el.querySelector("." + footerContent.class + " .content-links").className).toEqual('content-links')

      expect(wrapper.vm.$el.querySelector("." + footerContent.class + " .close").style.display).toEqual('block')
      wrapper.find("." + footerContent.class + " .close").trigger('click')

      expect(wrapper.vm.$el.querySelector("." + footerContent.class + " .close").style.display).toEqual('none')
      console.log(wrapper.vm.$el.querySelector("." + footerContent.class + " .content-links").className)
      expect(wrapper.vm.$el.querySelector("." + footerContent.class + " .content-links").className).toEqual('content-links mobile-hide')
    }
  });


  describe('FooterContainer.vue Methods', () => {});
});
