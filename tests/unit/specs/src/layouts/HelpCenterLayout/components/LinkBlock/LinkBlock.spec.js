import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import LinkBlock from '@/layouts/HelpCenterLayout/components/LinkBlock/LinkBlock.vue';
import { Tooling } from '@@/helpers';

const content = {
  icon:
    'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg',
  title: 'linkblock  title',
  description: 'linkblock description',
  email: 'stuntblitz@gmail.com',
  social: [
    {
      key: 'twitter',
      link: 'http://www.twitter.com',
      icon:
        'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'
    },
    {
      key: 'facebook',
      link: 'http://www.facebook.com',
      icon:
        'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'
    },
    {
      key: 'instagram',
      link: 'http://www.instagram.com',
      icon:
        'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'
    }
  ]
};

describe('LinkBlock.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(LinkBlock, {
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
    const {title, description, email, icon, social } = content;
    const imgIcon = wrapper.vm.$el.querySelector('.block-icon img');
    const pTitle = wrapper.vm.$el.querySelector('.block-title');
    const pDescription = wrapper.vm.$el.querySelector('.description');
    const aEmail = wrapper.vm.$el.querySelector('.email a');
    const socialElements = wrapper.vm.$el.querySelectorAll('.social div');

    expect(imgIcon.getAttribute('src')).toEqual(icon);
    expect(pDescription.textContent.trim()).toEqual(description);
    expect(pTitle.textContent.trim()).toEqual(title);
    expect(aEmail.href.replace('mailto:', '')).toEqual(email);

    for (const [i, socialElement] of socialElements.entries()) {
      expect(socialElement.querySelector('a').href).toEqual(`${social[i].link}/`);
      expect(socialElement.querySelector('img').getAttribute('src')).toEqual(
        social[i].icon
      );
    }
  });
});
