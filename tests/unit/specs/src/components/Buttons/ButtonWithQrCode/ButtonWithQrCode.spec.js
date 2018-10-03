import Vue from 'vue';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode/ButtonWithQrCode.vue';
import { shallowMount } from '@vue/test-utils'

import {
  Tooling
} from '@@/helpers';

describe('ButtonWithQrCode.vue', () => {
    let localVue, i18n, wrapper, store;
    const buttonname = 'QRCode';
    const qrcode = 'qrcode';
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(ButtonWithQrCode, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { buttonname , qrcode}
        });
    });

  it('should render correct contents', () => {
    console.log('button text:%O', wrapper.vm.$el.querySelector('div div .the-button').textContent.trim());
    expect(wrapper.vm.$el.querySelector('div div .the-button').textContent.trim()).toEqual(buttonname);
  });

  describe('ButtonWithQrCode.vue Methods', () => {});

});




