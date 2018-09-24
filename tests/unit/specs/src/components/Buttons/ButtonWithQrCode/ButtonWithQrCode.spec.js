import Vue from 'vue';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode/ButtonWithQrCode.vue';
import { shallowMount } from '@vue/test-utils'

describe('ButtonWithQrCode.vue', () => {
  it('should render correct contents', () => {
    const buttonname = 'QRCode';
    const qrcode = 'qrcode';
    const wrapper = shallowMount(ButtonWithQrCode, {
      propsData: { buttonname , qrcode}
    });

    console.log('button text:%O', wrapper.vm.$el.querySelector('div div .the-button').textContent.trim());
    expect(wrapper.vm.$el.querySelector('div div .the-button').textContent.trim()).toEqual(buttonname);
  });

  describe('ButtonWithQrCode.vue Methods', () => {});
});
