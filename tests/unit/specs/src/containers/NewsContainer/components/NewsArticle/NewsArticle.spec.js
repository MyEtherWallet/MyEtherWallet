import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import NewsArticle from '@/containers/NewsContainer/components/NewsArticle/NewsArticle.vue';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}

import {
  Tooling
} from '@@/helpers';

describe('NewsArticle.vue', () => {
    const title = 'NewsArticle title';
    const desc = 'NewsArticle desc';
    const fb = 'fb';
    const twitter = 'twitter';
    const readMore = 'NewsArticle readMore';
    const link = 'NewsArticle link';

    let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(NewsArticle, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { title, desc, fb, twitter, readMore, link },
          stubs: {'router-link':RouterLinkStub }
        });
    });

  it('should render correct contents', () => {
      expect(wrapper.vm.$el.querySelector('.news-text h4').textContent.trim()).toEqual(title);
      expect(wrapper.vm.$el.querySelector('.news-text p').textContent.trim()).toEqual(desc);
      expect(wrapper.vm.$el.querySelector('.links p').textContent.trim()).toEqual(readMore);
      expect(wrapper.vm.$el.querySelector('.fa-facebook').parentElement.href.trim()).toEqual(window.location.protocol + "//" + window.location.host + "/" + fb);
      expect(wrapper.vm.$el.querySelector('.fa-twitter').parentElement.href.trim()).toEqual(window.location.protocol + "//" + window.location.host + "/" + twitter);
  });

  describe('NewsArticle.vue Methods', () => { });
});
