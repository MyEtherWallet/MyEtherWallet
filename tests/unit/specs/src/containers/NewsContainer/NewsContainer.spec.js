import Vue from 'vue';
import { shallowMount , RouterLink, createLocalVue } from '@vue/test-utils'
import NewsContainer from '@/containers/NewsContainer/NewsContainer.vue';
import VueRouter from 'vue-router'
import VueI18N from 'vue-i18n'
import Translations from '@/translations';
const localVue = createLocalVue()
localVue.use(VueI18N)
import NewsArticle from '@/containers/NewsContainer/components/NewsArticle/NewsArticle.vue';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}

describe('NewsContainer.vue', () => {
  it('should render correct contents', () => {
    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(NewsContainer, 
      {
        attachToDocument:true, 
        localVue,
        i18n, 
        stubs: {'news-article':NewsArticle, 'router-link':RouterLinkStub }
      });
    
    console.log(wrapper.vm.$el.querySelectorAll('.news-text'))
    const newsArticleElements = wrapper.vm.$el.querySelectorAll('.news-text')
    for(var i=0; i< newsArticleElements.length; i++) {
      let newsArticleElement = newsArticleElements[i]
      const newsArticle = wrapper.vm.$data.articles[i]
  
      console.log('NewsArticle component title:%O', newsArticleElement.querySelector('h4').textContent.trim());      
      console.log('NewsArticle component desc:%O', newsArticleElement.querySelector('.news-text p').textContent.trim());
      console.log('NewsArticle component readMore:%O', newsArticleElement.querySelector('.links p').textContent.trim());          
      console.log('NewsArticle component link:%O', wrapper.findAll(RouterLinkStub).at(i).vm.to)
      expect(newsArticle.title).toEqual(newsArticleElement.querySelector('h4').textContent.trim())
      expect(newsArticle.desc).toEqual(newsArticleElement.querySelector('.news-text p').textContent.trim())
      expect(newsArticle.readMore).toEqual(newsArticleElement.querySelector('.links p').textContent.trim())
      expect(wrapper.findAll(RouterLinkStub).at(i).vm.to).toBe(newsArticle.link)
    }
  });

  describe('NewsContainer.vue Methods', () => {});
});
