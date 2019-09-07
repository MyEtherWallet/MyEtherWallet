import { shallowMount } from '@vue/test-utils';
import VerificationModal from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/VerificationModal/VerificationModal.vue';
import sinon from 'sinon';

import { Tooling } from '@@/helpers';

describe('VerificationModal.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(VerificationModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct contents', () => {
    const mnemonicValues = [];
    mnemonicValues.push('values1');
    mnemonicValues.push('values2');
    mnemonicValues.push('values3');
    wrapper.setProps({ mnemonicValues });
    const liElements = wrapper.vm.$el.querySelectorAll('li');

    for (const [i, liElement] of liElements.entries()) {
      expect(liElement.querySelector('span').textContent.trim()).toEqual(
        mnemonicValues[i]
      );
    }
  });

  describe('VerificationModal.vue Methods', () => {
    it('should verify-button', () => {
      const mnemonicDoneModalOpen = sinon.stub();
      wrapper.setProps({ mnemonicDoneModalOpen });
      wrapper.find('.verify-button').trigger('click');
      expect(mnemonicDoneModalOpen.called).toBe(true);
    });
  });
});
