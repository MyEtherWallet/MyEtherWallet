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
    const { categoryButtons } = wrapper.vm.$data;
    const categoryButtonElements = wrapper.vm.$el.querySelectorAll(
      '.category-buttons li'
    );

    for (const [i, categoryButtonElement] of categoryButtonElements.entries()) {
      const pButtonTitle = categoryButtonElement.querySelector('.button-title');
      expect(pButtonTitle.textContent.trim()).toEqual(categoryButtons[i].title);
    }

    const linkBlockElements = wrapper.vm.$el.querySelectorAll('.link-block');

    for (const [i, linkBlockElement] of linkBlockElements.entries()) {
      const {
        icon,
        description,
        email,
        title,
        social
      } = wrapper.vm.$data.linkBlocks[i];

      const imgIcon = linkBlockElement.querySelector('.block-icon img');
      const pTitle = linkBlockElement.querySelector('.block-title');
      const pDescription = linkBlockElement.querySelector('.description');
      const aEmail = linkBlockElement.querySelector('.email a');
      const socialElements = linkBlockElement.querySelectorAll('.social div');

      for (const [j, socialElement] of socialElements.entries()) {
        expect(socialElement.querySelector('a').href).toEqual(
          `${social[j].link}/`
        );
        expect(socialElement.querySelector('img').getAttribute('src')).toEqual(
          social[j].icon
        );
      }
      expect(imgIcon.getAttribute('src')).toEqual(icon);
      expect(pTitle.textContent.trim()).toEqual(description);
      expect(pDescription.textContent.trim()).toEqual(title);
      expect(aEmail.href.replace('mailto:', '')).toEqual(email);
    }
  });
});
