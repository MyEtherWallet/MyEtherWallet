import Vue from 'vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';

describe('InterfaceBottomText.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(InterfaceBottomText);
    const vm = new Constructor({
      propsData: {
        link: 'link',
        linkText: 'linkText',
        question: 'question'
      }
    }).$mount();
    console.log(vm.$el.querySelectorAll('div p')); // todo remove dev item
    expect(vm.$el.querySelector('div p').textContent.trim()).toEqual(
      'question linkText'
    );
    expect(vm.$el.querySelector('div p a').textContent.trim()).toEqual(
      'linkText'
    );
    expect(vm.$el.querySelector('div p a').getAttribute('href')).toEqual(
      'link'
    );
  });

  describe('InterfaceBottomText.vue Methods', () => {});
});
