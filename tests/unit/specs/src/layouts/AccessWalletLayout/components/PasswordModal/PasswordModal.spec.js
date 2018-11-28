import { shallowMount } from '@vue/test-utils'
import PasswordModal from '@/layouts/AccessWalletLayout/components/PasswordModal/PasswordModal.vue';
import  sinon from 'sinon' 
import {
  Tooling
} from '@@/helpers';

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
        const password='password';
        wrapper.setData({password})
        expect(wrapper.vm.$el.querySelector('.password-form input').value).toEqual(password);
    });

    it('should render error data', () => {
        const error='error';
        wrapper.setData({error})
        expect(wrapper.vm.$el.querySelector('.password-form p').textContent.trim()).toEqual(error);
    });

    describe('PasswordModal.vue Methods', () => {
        it('should switch view password when image button clicked', () => {
            wrapper.find('.password-form img').trigger('click');
            expect(wrapper.vm.$data.show).toBe(true);
            wrapper.find('.password-form img').trigger('click');
            expect(wrapper.vm.$data.show).toBe(false);
        });
    });
});
