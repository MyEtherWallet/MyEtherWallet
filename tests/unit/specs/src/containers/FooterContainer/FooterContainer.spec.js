import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount, mount } from '@vue/test-utils';
import FooterContainer from '@/containers/FooterContainer/FooterContainer.vue';

const $t = () => {};

const RouterLinkStub = {
  name: 'router-link',
  template: '<p> <slot> </slot></p>',
  props: ['to']
};

import { Tooling } from '@@/helpers';

describe('FooterContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    const getters = {
      ethDonationAddress: () => {}
    };

    store = new Vuex.Store({
      getters
    });
  });

  beforeEach(() => {
    wrapper = mount(FooterContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: { 'router-link': RouterLinkStub }
    });
  });

  xit('[FAILING MAX STACK] should render correct lowerLinks', () => {
    const linkWrappers = wrapper.findAll(RouterLinkStub);

    const lowerLinkWrappers = [];
    for (var i = 0; i < linkWrappers.length; i++) {
      const linkWrapper = linkWrappers.at(i);
      if (
        linkWrapper.vm.$el.parentElement.parentElement.className.indexOf(
          'foot-note'
        ) > -1
      ) {
        lowerLinkWrappers.push(linkWrapper);
      }
    }

    for (var i = 0; i < lowerLinkWrappers.length; i++) {
      const lowerLink = wrapper.vm.$data.lowerLinks[i];
      const lowerLinkWrapper = lowerLinkWrappers[i];
      expect(lowerLinkWrapper.vm.to).toEqual(lowerLink.to);
    }
  });

  it('should render correct links', () => {
    const socialElement = wrapper.vm.$el.querySelector('.social');
    const linksElements = socialElement.getElementsByTagName('a');

    for (let i = 0; i < wrapper.vm.$data.links.length; i++) {
      const linksElement = linksElements[i];
      const link = wrapper.vm.$data.links[i];

      let icoClassName = linksElement.getElementsByTagName('i')[0].className;
      icoClassName = icoClassName.replace('fa ', '');
      expect(link.to).toEqual(linksElement.href);
      expect(link.class).toEqual(icoClassName);
    }
  });

  xit('[FAILING MAX STACK] should render correct footerContent', () => {
    const contentWrappers = wrapper.findAll(RouterLinkStub);

    const contentsElements = [];
    for (var i = 0; i < contentWrappers.length; i++) {
      const contentWrapper = contentWrappers.at(i);
      if (
        contentWrapper.vm.$el.parentElement.parentElement.className.indexOf(
          'content-links'
        ) > -1
      ) {
        contentsElements.push(contentWrapper);
      }
    }

    const contents = [];
    for (var i = 0; i < wrapper.vm.$data.footerContent.length; i++) {
      const footerContent = wrapper.vm.$data.footerContent[i];
      for (let j = 0; j < footerContent.contents.length; j++) {
        if (footerContent.contents[j].to !== undefined) {
          contents.push(footerContent.contents[j]);
        }
      }
    }

    for (var i = 0; i < contentsElements.length; i++) {
      expect(contents[i].to).toEqual(contentsElements[i].vm.to);
    }
  });
});
