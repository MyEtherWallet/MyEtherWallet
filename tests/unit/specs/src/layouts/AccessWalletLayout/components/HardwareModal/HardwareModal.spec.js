import { shallowMount } from '@vue/test-utils';
import HardwareModal from '@/layouts/AccessWalletLayout/components/HardwareModal/HardwareModal.vue';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';

describe('HardwareModal.vue', () => {
  let localVue, i18n, store, wrapper;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    jest.mock('platform');
  });

  beforeEach(() => {
    wrapper = shallowMount(HardwareModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: { 'router-link': RouterLinkStub }
    });
  });

  it('should render correct contents', () => {
    console.log(wrapper.find('li').exists());
    // const liElements = wrapper.findAll('li');
    //const liElement = liElements.at(0);
    //liElement.trigger('click');
    // expect(wrapper.vm.$data.selected).toEqual('ledger');
    // liElement = liElements.at(1);
    // liElement.trigger('click');
    // expect(wrapper.vm.$data.selected).toEqual('bitbox');
    // liElement = liElements.at(2);
    // liElement.trigger('click');
    // expect(wrapper.vm.$data.selected).toEqual('secalot');
    // liElement = liElements.at(3);
    // liElement.trigger('click');
    // expect(wrapper.vm.$data.selected).toEqual('trezor');
    // liElement = liElements.at(4);
    // liElement.trigger('click');
    // expect(wrapper.vm.$data.selected).toEqual('keepkey');
    // wrapper.find('.mid-round-button-green-filled').trigger('click');
    // wrapper.find('.mid-round-button-green-filled').trigger('click');
    // expect(wrapper.vm.$data.mayNotBeAttached).toBe(false);
  });

  describe('HardwareModal.vue Methods', () => {});
});
