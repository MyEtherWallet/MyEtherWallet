import { shallowMount } from '@vue/test-utils';
import PasswordModal from '@/layouts/AccessWalletLayout/components/PasswordModal/PasswordModal.vue';
import { Tooling } from '@@/helpers';

describe('PasswordModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(PasswordModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render password data', () => {
    const password = 'Strength1000!!!!AAAA***BB###';
    wrapper.setData({ password });
    const formPasswordValue = wrapper.vm.$el.querySelector(
      '.password-form input'
    ).value;
    expect(formPasswordValue).toEqual(password);
  });

  describe('PasswordModal.vue Methods', () => {
    it('should switch view password when image button clicked', () => {
      const imgPasswordElement = wrapper.find('.password-form img');
      imgPasswordElement.trigger('click');
      expect(wrapper.vm.$data.show).toBe(true);
      imgPasswordElement.trigger('click');
      expect(wrapper.vm.$data.show).toBe(false);
    });
  });
});
