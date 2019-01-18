import { shallowMount } from '@vue/test-utils';
import VerifyMessageContainer from '@/layouts/InterfaceLayout/containers/VerifyMessageContainer/VerifyMessageContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import PopOver from '@/components/PopOver/PopOver.vue';

import { Tooling } from '@@/helpers';

//xdescribe
describe('VerifyMessageContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    store.replaceState({
      account: {
        balance: {
          result: ''
        }
      },
      wallet: {
        getAddressString: function() {}
      }
    });
    wrapper = shallowMount(VerifyMessageContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-bottom-text': InterfaceBottomText,
        'interface-container-title': InterfaceContainerTitle,
        popover: PopOver
      }
    });
  });

  xit('[Failing] should render correct message to textarea', () => {
    const message = 'message';
    wrapper.setData({ message });
    expect(wrapper.vm.$el.querySelector('.domain-name textarea').value).toEqual(
      message
    );
  });

  xit('[Failing] should render correct error message to textarea', () => {
    const error = {
      show: true,
      msg: 'error! please try again!'
    };
    const message = {
      msg: 'message',
      address: '0x'
    };
    const showMessage = true;
    wrapper.setData({ message: JSON.stringify(message), error, showMessage });
    expect(
      wrapper.vm.$el
        .querySelectorAll('p')[0]
        .textContent.indexOf(message.address)
    ).toBeGreaterThan(-1);
    expect(
      wrapper.vm.$el.querySelectorAll('p')[0].textContent.indexOf(message.msg)
    ).toBeGreaterThan(-1);
    expect(wrapper.vm.$el.querySelectorAll('p')[1].textContent).toEqual(
      String(error.show)
    );
  });

  describe('VerifyMessageContainer.vue Methods', () => {
    xit('[Failing] should verify message when click button', () => {
      const message = {
        msg: 'message',
        address: '0xadfasdfasjflaksjdflkasdjlfk',
        sig: 'aaa'
      };
      wrapper.setData({ message: JSON.stringify(message) });
      wrapper.find('.submit-button').trigger('click');
      expect(wrapper.vm.$data.error.show).toBe(true);
      expect(wrapper.vm.$data.error.msg).toEqual(
        'Something went terribly WRONG!!!!'
      );
    });

    xit('[Failing] should delete textarea when click button', () => {
      const message = 'message';
      wrapper.setData({ message });
      expect(
        wrapper.vm.$el.querySelector('.domain-name textarea').value
      ).toEqual(message);
      wrapper.find('.copy-buttons span').trigger('click');
      expect(
        wrapper.vm.$el.querySelector('.domain-name textarea').value
      ).toEqual('');
    });
  });
});
