import Vue from 'vue';
import { shallowMount , RouterLink, createLocalVue } from '@vue/test-utils'
import FaqsContainer from '@/containers/FaqsContainer/FaqsContainer.vue';
import VueRouter from 'vue-router'
import VueI18N from 'vue-i18n'
import Translations from '@/translations';
const localVue = createLocalVue()
localVue.use(VueI18N)

describe('FaqsContainer.vue', () => {
  it('should render correct contents', () => {
    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(FaqsContainer, {attachToDocument:true, localVue,i18n});
   

    const linkWrappers = wrapper.findAll('.qa__contents--title')
    var linkWrapper = linkWrappers.at(0);
    linkWrapper.trigger('click')
    expect(wrapper.vm.$data.showFAQs.faq1).toBe(true)

    linkWrapper = linkWrappers.at(1);
    linkWrapper.trigger('click')
    expect(wrapper.vm.$data.showFAQs.faq2).toBe(true)

    linkWrapper = linkWrappers.at(2);
    linkWrapper.trigger('click')
    expect(wrapper.vm.$data.showFAQs.faq3).toBe(true)

    linkWrapper = linkWrappers.at(3);
    linkWrapper.trigger('click')
    expect(wrapper.vm.$data.showFAQs.faq4).toBe(true)

    linkWrapper = linkWrappers.at(4);
    linkWrapper.trigger('click')
    expect(wrapper.vm.$data.showFAQs.faq5).toBe(true)

  });

  describe('FaqsContainer.vue Methods', () => {});
});
