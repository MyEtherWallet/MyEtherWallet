import { shallowMount } from '@vue/test-utils';
import HardwarePasswordModal from '@/layouts/AccessWalletLayout/components/HardwarePasswordModal/HardwarePasswordModal.vue';
import { Tooling } from '@@/helpers';

describe('HardwarePasswordModal.vue', () => {
  let localVue, i18n, wrapper, store;
  const hardwareBrand = 'hardwareBrand';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(HardwarePasswordModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { hardwareBrand }
    });
  });

  it('should render correct error data', () => {
    const error = 'error';
    wrapper.setData({ error });
    expect(wrapper.find('p.error').text()).toEqual(error);
  });

  it('should render correct password data', () => {
    const password = 'password';
    wrapper.setData({ password });
    expect(
      wrapper.vm.$el.querySelector('.input-container input').value
    ).toEqual(password);
  });

  it('should render correct hardwareBrand props', () => {
    expect(
      wrapper
        .find('.submit-button')
        .text()
        .indexOf(hardwareBrand)
    ).toBeGreaterThan(-1);
  });

  describe('HardwarePasswordModal.vue Methods', () => {
    it('should change password data when input triggers', () => {
      const inputElement = wrapper.find('.input-container input');
      const inputText = 'testpassword';
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.vm.$data.password).toBe(inputText);
    });

    it('should change show data when button click', () => {
      const imgElement = wrapper.find('.input-container img');
      imgElement.trigger('click');
      expect(wrapper.vm.$data.show).toBe(true);
      imgElement.trigger('click');
      expect(wrapper.vm.$data.show).toBe(false);
    });
  });
});
