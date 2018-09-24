import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton/AccessWalletButton.vue';


describe('AccessWalletButton.vue', () => {
  it('should render correct contents', () => {
    const img = 'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
    const title = 'AccessWalletButton title';
    const desc = 'AccessWalletButton desc';
    const recommend = 'AccessWalletButton recommend';
    const tooltip = 'AccessWalletButton tooltip';
    const disabled = false;

  
    const wrapper = shallowMount(AccessWalletButton, {
      propsData: { img, title, desc, recommend, tooltip, disabled }
    });

    console.log('AccessWalletButton image:%O', wrapper.vm.$el.querySelector('.icon').src);
    expect(wrapper.vm.$el.querySelector('.icon').src.trim()).toEqual(img);

    console.log('AccessWalletButton title:%O', wrapper.vm.$el.querySelector('h3').textContent.trim());
    expect(wrapper.vm.$el.querySelector('h3').textContent.trim()).toEqual(title);

    console.log('AccessWalletButton description:%O', wrapper.vm.$el.querySelector('.desc').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.desc').textContent.trim()).toEqual(desc);

    console.log('AccessWalletButton recommend:%O', wrapper.vm.$el.querySelector('.small-note').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.small-note').textContent.trim()).toEqual(recommend);

  });

  describe('AccessWalletButton.vue Methods', () => {});
});
