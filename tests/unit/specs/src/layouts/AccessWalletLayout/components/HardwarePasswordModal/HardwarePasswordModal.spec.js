import Vue from 'vue';
import { shallowMount,createLocalVue } from '@vue/test-utils'
import HardwarePasswordModal from '@/layouts/AccessWalletLayout/components/HardwarePasswordModal/HardwarePasswordModal.vue';
import VueI18N from 'vue-i18n'
import Translations from '@/translations';
import BootstrapVue from "bootstrap-vue";
const localVue = createLocalVue()
localVue.use(VueI18N)
localVue.use(BootstrapVue);


describe('HardwarePasswordModal.vue', () => {
  it('should render correct contents', () => {
    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(HardwarePasswordModal, 
    {
        sync:false,
        attachToDocument:true, 
        localVue,
        i18n
    });

    var imgElement = wrapper.find('.input-container img')
    imgElement.trigger('click')

    console.log(wrapper.vm.$data.show)
    expect(wrapper.vm.$data.show).toBe(true)

    imgElement = wrapper.find('.input-container img')
    imgElement.trigger('click')
    expect(wrapper.vm.$data.show).toBe(false)



    var inputElement = wrapper.find('.input-container input')

    var inputText= 'testpassword'
    inputElement.setValue(inputText)
    inputElement.trigger('change')
      
    console.log('password:%O',wrapper.vm.$data.password)

    expect(wrapper.vm.$data.password).toBe(inputText)

  });

  describe('HardwarePasswordModal.vue Methods', () => {});
});
