import Vue from 'vue';
import { shallowMount,createLocalVue } from '@vue/test-utils'
import HardwareModal from '@/layouts/AccessWalletLayout/components/HardwareModal/HardwareModal.vue';
import VueI18N from 'vue-i18n'
import Translations from '@/translations';
import BootstrapVue from "bootstrap-vue";
const localVue = createLocalVue()
localVue.use(VueI18N)
localVue.use(BootstrapVue);


const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  // render: ()=>{},
  props:['to']  
}


describe('HardwareModal.vue', () => {
  it('should render correct contents', () => {
    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(HardwareModal, 
    {
        sync:false,
        attachToDocument:true, 
        localVue,
        i18n,
        stubs: {'router-link':RouterLinkStub }
    });

    const liElements = wrapper.findAll('li')
    console.log(liElements.length)

    var liElement = liElements.at(0)
    liElement.trigger('click')
    expect(wrapper.vm.$data.selected).toEqual('ledger')

    liElement = liElements.at(1)
    liElement.trigger('click')
    expect(wrapper.vm.$data.selected).toEqual('trezor')

    liElement = liElements.at(2)
    liElement.trigger('click')
    expect(wrapper.vm.$data.selected).toEqual('bitbox')

    liElement = liElements.at(3)
    liElement.trigger('click')
    expect(wrapper.vm.$data.selected).toEqual('secalot')

    wrapper.find('.mid-round-button-green-filled').trigger('click')
    wrapper.find('.mid-round-button-green-filled').trigger('click')
    expect(wrapper.vm.$data.mayNotBeAttached).toBe(false)
    
  });

  describe('HardwareModal.vue Methods', () => {});
});
