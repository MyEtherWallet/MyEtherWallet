import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import CategoryButton from '@/layouts/HelpCenterLayout/components/CategoryButton/CategoryButton.vue';
import { Tooling } from '@@/helpers';

const content = {
  icon:
    'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg',
  title: 'CategoryButton  title'
};

describe('CategoryButton.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(CategoryButton, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        content
      }
    });
  });

  it('should render correct contents', () => {
    const { icon, title } = content;
    const imgIcon = wrapper.vm.$el.querySelector('.button-icon img');
    const pTitle = wrapper.vm.$el.querySelector('.button-title');
    expect(imgIcon.getAttribute('src')).toEqual(icon);
    expect(pTitle.textContent.trim()).toEqual(title);
  });
});
