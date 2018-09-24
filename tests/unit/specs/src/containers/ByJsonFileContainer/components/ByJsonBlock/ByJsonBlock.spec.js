import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import ByJsonBlock from '@/containers/ByJsonFileContainer/components/ByJsonBlock/ByJsonBlock.vue';

describe('ByJsonBlock.vue', () => {
  it('should render correct contents', () => {

    const img = 'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
    const title = 'ByJsonBlock title';
    const desc = 'ByJsonBlock desc';

    const wrapper = shallowMount(ByJsonBlock, {
      propsData: { img, title, desc }
    });

    console.log('ByJsonBlock container component title:%O', wrapper.vm.$el.querySelector('.text-block h6').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.text-block h6').textContent.trim()).toEqual(title);

    console.log('ByJsonBlock container component desc:%O', wrapper.vm.$el.querySelector('.text-block p').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.text-block p').textContent.trim()).toEqual(desc);


    console.log('ByJsonBlock container component img:%O', wrapper.vm.$el.querySelector('.icon-block img').src);
    expect(wrapper.vm.$el.querySelector('.icon-block img').src.trim()).toEqual(img);
  });

  describe('ByJsonBlock.vue Methods', () => { });
});
