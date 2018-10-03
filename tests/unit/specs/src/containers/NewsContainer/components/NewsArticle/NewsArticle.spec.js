import Vue from 'vue';
import { shallowMount, RouterLink } from '@vue/test-utils'
import NewsArticle from '@/containers/NewsContainer/components/NewsArticle/NewsArticle.vue';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}


describe('NewsArticle.vue', () => {
  it('should render correct contents', () => {
    const title = 'NewsArticle title';
    const desc = 'NewsArticle desc';
    const fb = 'fb';
    const twitter = 'twitter';
    const readMore = 'NewsArticle readMore';
    const link = 'NewsArticle link';


    const wrapper = shallowMount(NewsArticle, {
      propsData: { title, desc, fb, twitter, readMore, link },
      stubs: {'router-link':RouterLinkStub }
    });

    console.log('NewsArticle component title:%O', wrapper.vm.$el.querySelector('.news-text h4').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.news-text h4').textContent.trim()).toEqual(title);

    console.log('NewsArticle component desc:%O', wrapper.vm.$el.querySelector('.news-text p').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.news-text p').textContent.trim()).toEqual(desc);

    console.log('NewsArticle component link:%O', wrapper.vm.$el.querySelector('.links p').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.links p').textContent.trim()).toEqual(readMore);

    console.log('NewsArticle component icon:%O', wrapper.vm.$el.querySelector('.fa-facebook').parentElement.href);
    expect(wrapper.vm.$el.querySelector('.fa-facebook').parentElement.href.trim()).toEqual(window.location.protocol + "//" + window.location.host + "/" + fb);

    console.log('NewsArticle component icon:%O', wrapper.vm.$el.querySelector('.fa-twitter').parentElement.href);
    expect(wrapper.vm.$el.querySelector('.fa-twitter').parentElement.href.trim()).toEqual(window.location.protocol + "//" + window.location.host + "/" + twitter);
  });

  describe('NewsArticle.vue Methods', () => { });
});
