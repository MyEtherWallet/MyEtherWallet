import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import Categories from '@/layouts/HelpCenterLayout/components/Categories/Categories.vue';
import CategoryButton from '@/layouts/HelpCenterLayout/components/CategoryButton/CategoryButton.vue';
import { Tooling } from '@@/helpers';

describe('Categories.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(Categories, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'category-button': CategoryButton
      }
    });
  });

  it('should render correct contents', () => {
    const categoryButtonElements = wrapper.vm.$el.querySelectorAll(
      '.category-buttons li'
    );

    for (const [i, categoryButtonElement] of categoryButtonElements.entries()) {
      expect(
        categoryButtonElement.querySelector('.button-title').textContent.trim()
      ).toEqual(wrapper.vm.$data.categoryButtons[i].title);
    }

    const linkBlockElements = wrapper.vm.$el.querySelectorAll('.link-block');

    for (const [i, linkBlockElement] of linkBlockElements.entries()) {
      expect(
        linkBlockElement.querySelector('.block-icon img').getAttribute('src')
      ).toEqual(wrapper.vm.$data.linkBlocks[i].icon);
      expect(
        linkBlockElement.querySelector('.description').textContent.trim()
      ).toEqual(wrapper.vm.$data.linkBlocks[i].description);
      expect(
        linkBlockElement.querySelector('.block-title').textContent.trim()
      ).toEqual(wrapper.vm.$data.linkBlocks[i].title);
      expect(
        linkBlockElement.querySelector('.email a').href.replace('mailto:', '')
      ).toEqual(wrapper.vm.$data.linkBlocks[i].email);

      const socialElements = linkBlockElement.querySelectorAll('.social div');

      for (const [j, socialElement] of socialElements.entries()) {
        expect(socialElement.querySelector('a').href).toEqual(
          wrapper.vm.$data.linkBlocks[i].social[j].link + '/'
        );
        expect(socialElement.querySelector('img').getAttribute('src')).toEqual(
          wrapper.vm.$data.linkBlocks[i].social[j].icon
        );
      }
    }
  });

  describe('Categories.vue Methods', () => {});
});
