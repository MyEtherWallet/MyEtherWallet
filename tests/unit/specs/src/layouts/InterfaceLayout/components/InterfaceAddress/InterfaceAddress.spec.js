import { shallowMount } from '@vue/test-utils';
import InterfaceAddress from '@/layouts/InterfaceLayout/components/InterfaceAddress/InterfaceAddress.vue';
import { Tooling } from '@@/helpers';
import sinon from 'sinon';
import { state } from '@@/helpers/mockStore';

describe('InterfaceAddress.vue', () => {
  let localVue, i18n, wrapper, store;

  const triggerAlert = sinon.stub();
  const switchAddr = sinon.stub();

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
    wrapper = shallowMount(InterfaceAddress, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        triggerAlert,
        address: state.account.address,
        switchAddr
      }
    });
  });

  it('should render correct address props', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.information-container p.address')
        .textContent.trim()
    ).toEqual(state.account.address);
  });

  describe('InterfaceAddress.vue Methods', () => {
    xit('should trigger alert when copy method is triggered', () => {
      wrapper.vm.copy();
      expect(triggerAlert.called).toBe(true);
    });

    it('should trigger qrcode method when qrcode button clicked', () => {
      wrapper.setData({ hasMultipleAddr: true });
      wrapper.find('#popover-ref-copy').trigger('click');
    });
  });

  describe('InterfaceAddress.vue Methods', () => {});
});
