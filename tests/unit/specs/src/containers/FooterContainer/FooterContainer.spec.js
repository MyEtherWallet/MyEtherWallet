import { mount } from '@vue/test-utils';
import FooterContainer from '@/containers/FooterContainer/FooterContainer.vue';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';

describe('FooterContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    const mockRoute = {
      history: {
        current: {
          fullPath: '/'
        }
      }
    };
    wrapper = mount(FooterContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: { 'router-link': RouterLinkStub },
      mocks: {
        $router: mockRoute
      }
    });
  });

  it('should render correct lowerLinks', () => {
    const linkWrappers = wrapper.findAll(RouterLinkStub);

    const lowerLinkWrappers = [];
    for (let i = 0; i < linkWrappers.length; i++) {
      const linkWrapper = linkWrappers.at(i);
      if (
        linkWrapper.vm.$el.parentElement.parentElement.className.indexOf(
          'foot-note'
        ) > -1
      ) {
        lowerLinkWrappers.push(linkWrapper);
      }
    }

    for (let i = 0; i < lowerLinkWrappers.length; i++) {
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

  it('should render correct footerContent', () => {
    const contentWrappers = wrapper.findAll(RouterLinkStub);

    const contentsElements = [];
    for (let i = 0; i < contentWrappers.length; i++) {
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
    for (let i = 0; i < wrapper.vm.$data.footerContent.length; i++) {
      const footerContent = wrapper.vm.$data.footerContent[i];
      for (let j = 0; j < footerContent.contents.length; j++) {
        if (footerContent.contents[j].to !== undefined) {
          contents.push(footerContent.contents[j]);
        }
      }
    }

    for (let i = 0; i < contentsElements.length; i++) {
      expect(contents[i].to).toEqual(contentsElements[i].vm.to);
    }
  });
});
