import AddressQrcodeModal from '@/components/AddressQrcodeModal/AddressQrcodeModal.vue';
import { shallowMount } from '@vue/test-utils';
import VueQrcode from '@xkeshi/vue-qrcode';
import { Tooling } from '@@/helpers';

describe('AddressQrcodeModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    document.execCommand = jest.fn().mockImplementation(command => {
      return command;
    });

    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(AddressQrcodeModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        qrcode: VueQrcode
      }
    });
  });

  it('should render correct address props', () => {
    const address = 'address';
    wrapper.setProps({ address });
    expect(wrapper.vm.$el.querySelector('textarea.address').value).toEqual(
      address
    );
  });

  describe('AddressQrcodeModal.vue Methods', () => {
    it('should execute `copy` command when button is clicked', () => {
      wrapper.find('.modal-contents button').trigger('click');
      expect(document.execCommand).toHaveBeenCalled();
    });
  });
});
