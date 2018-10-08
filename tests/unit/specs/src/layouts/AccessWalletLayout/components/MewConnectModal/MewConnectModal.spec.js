import Vue from 'vue';
import { shallowMount,createLocalVue } from '@vue/test-utils'
import MewConnectModal from '@/layouts/AccessWalletLayout/components/MewConnectModal/MewConnectModal.vue';
import VueI18N from 'vue-i18n'
import Translations from '@/translations';
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue()
localVue.use(VueI18N)
localVue.use(BootstrapVue);

describe('MewConnectModal.vue', () => {
  it('should render correct contents', () => {
    const i18n = new VueI18N({
      locale:'en_US',
      Translations
    })

    const wrapper = shallowMount(MewConnectModal, 
    {
        sync:false,
        attachToDocument:true, 
        localVue,
        i18n
    });

    const QrCode = 'QrCode'
    wrapper.setData({QrCode:QrCode})
    console.log(wrapper.vm.$data.QrCode)
    expect(wrapper.vm.$data.QrCode).toEqual(QrCode)
  });

  describe('MewConnectModal.vue Methods', () => {});
});
