import Vue from 'vue';
import { shallowMount, createLocalVue } from '@vue/test-utils'
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton/AccessWalletButton.vue';

import BootstrapVue from "bootstrap-vue"
import debugLogger from 'debug';
const testLog = debugLogger('test:AccessWalletButton.spec')

const localVue = createLocalVue()
localVue.use(BootstrapVue);

describe('AccessWalletButton.vue', () => {
  it('should render correct contents', () => {
    const img = 'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
    const title = 'AccessWalletButton title';
    const desc = 'AccessWalletButton desc';
    const recommend = 'AccessWalletButton recommend';
    const tooltip = 'AccessWalletButton tooltip';
    const disabled = false;


    const wrapper = shallowMount(AccessWalletButton, {
        localVue,
        propsData: { img, title, desc, recommend, tooltip, disabled }
    });

    // console.log('AccessWalletButton image:%O', wrapper.vm.$el.querySelector('.icon').src);
    expect(wrapper.vm.$el.querySelector('.icon').src.trim()).toEqual(img);

    testLog('AccessWalletButton title:%O', wrapper.vm.$el.querySelector('h3').textContent.trim());
    expect(wrapper.vm.$el.querySelector('h3').textContent.trim()).toEqual(title);

    testLog('AccessWalletButton description:%O', wrapper.vm.$el.querySelector('.desc').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.desc').textContent.trim()).toEqual(desc);

    testLog('AccessWalletButton recommend:%O', wrapper.vm.$el.querySelector('.small-note').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.small-note').textContent.trim()).toEqual(recommend);

  });

  describe('AccessWalletButton.vue Methods', () => {});
});
