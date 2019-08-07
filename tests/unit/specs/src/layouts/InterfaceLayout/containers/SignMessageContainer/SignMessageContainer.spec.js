import { shallowMount } from '@vue/test-utils';
import SignMessageContainer from '@/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import { Tooling } from '@@/helpers';

describe('SignMessageContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(SignMessageContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-bottom-text': InterfaceBottomText,
        'interface-container-title': InterfaceContainerTitle,
        popover: PopOver,
        'success-modal': SuccessModal
      }
    });
  });

  it('should render correct data', () => {
    const message = 'message';
    wrapper.setData({ message });
    expect(wrapper.vm.$el.querySelector('.the-form textarea').value).toEqual(
      message
    );
  });
});
