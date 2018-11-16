import Vue from 'vue';
import { shallowMount} from '@vue/test-utils'
import NewsContainer from '@/containers/NewsContainer/NewsContainer.vue';
import NewsArticle from '@/containers/NewsContainer/components/NewsArticle/NewsArticle.vue';

import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}

describe('NewsContainer.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(NewsContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {'news-article':NewsArticle, 'router-link':RouterLinkStub }
        });
    });

  it('should render correct contents', () => {
    const newsArticleElements = wrapper.vm.$el.querySelectorAll('.news-text')
    for(var i=0; i< newsArticleElements.length; i++) {
      let newsArticleElement = newsArticleElements[i]
      const newsArticle = wrapper.vm.$data.articles[i]
      expect(newsArticle.title).toEqual(newsArticleElement.querySelector('h4').textContent.trim())
      expect(newsArticle.desc).toEqual(newsArticleElement.querySelector('.news-text p').textContent.trim())
      expect(newsArticle.readMore).toEqual(newsArticleElement.querySelector('.links p').textContent.trim())
      expect(wrapper.findAll(RouterLinkStub).at(i).vm.to).toBe(newsArticle.link)
    }
  });

  describe('NewsContainer.vue Methods', () => {});
});
