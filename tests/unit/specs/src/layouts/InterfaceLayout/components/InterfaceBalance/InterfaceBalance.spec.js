import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import InterfaceBalance from '@/layouts/InterfaceLayout/components/InterfaceBalance/InterfaceBalance.vue';
import i18n from 'vue-i18n';

const $t = ()=>{}
describe('InterfaceBalance.vue', () => {
  it('should render correct contents', () => {
    const balance = '100';
  
    const wrapper = shallowMount(InterfaceBalance, {
      propsData: { balance },
      mocks:{$t}
    });

    console.log('InterfaceBalance balance:%O', wrapper.vm.$el.querySelector('.balance-text p').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.balance-text p').textContent.trim()).toEqual(balance);
  });

  describe('InterfaceBalance.vue Methods', () => {});
});
