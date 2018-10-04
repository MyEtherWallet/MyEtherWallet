import Vue from 'vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import { shallowMount,createLocalVue } from '@vue/test-utils'
import BootstrapVue from "bootstrap-vue"
const localVue = createLocalVue()
localVue.use(BootstrapVue);


describe('PopOver.vue', () => {
  it('validate address when dropdown is selected', () => {

    const poptitle = 'poptitle';
    const popcontent = 'popcontent';
    const popovertype = 'popovertype';

    const wrapper = shallowMount(PopOver, {
      localVue,
      attachToDocument:true, 
      propsData: { poptitle , popcontent, popovertype}
    });

    expect(wrapper.vm.$el.querySelector('p.popover-content').textContent).toEqual(popcontent);
  });

  describe('PopOver.vue Methods', () => {});
});
