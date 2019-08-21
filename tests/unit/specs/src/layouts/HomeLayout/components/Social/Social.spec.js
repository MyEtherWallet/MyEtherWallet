import { shallowMount } from '@vue/test-utils';
import Social from '@/layouts/HomeLayout/components/Social/Social.vue';
import { Tooling } from '@@/helpers';

// const $t = () => {};
describe('Social.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(Social, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct contents', () => {
    const linkElements = wrapper.vm.$el
      .querySelector('.icons')
      .getElementsByTagName('a');
    const imgElements = wrapper.vm.$el.getElementsByTagName('img');

    for (const [i, data] of wrapper.vm.$data.links.entries()) {
      const link = data.to;
      let linkElement = linkElements[i].href;
      if (
        linkElements[i].href.lastIndexOf('/') ===
        linkElements[i].href.length - 1
      ) {
        linkElement = linkElements[i].href.substring(
          0,
          linkElements[i].href.length - 1
        );
      }

      expect(link).toEqual(linkElement);
      expect(data.name).toEqual(imgElements[i].parentElement.className);
    }
  });

  describe('Social.vue Methods', () => {});
});
