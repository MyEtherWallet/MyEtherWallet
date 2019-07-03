import WalletOption from '@/layouts/AccessWalletLayout/components/WalletOption/WalletOption.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('WalletOption.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(WalletOption, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct text props', () => {
    const text = 'text';
    wrapper.setProps({ text });
    expect(
      wrapper.vm.$el
        .querySelector('.wallet-option-container div span')
        .textContent.trim()
    ).toEqual(text);
  });

  it('should render correct selected props', () => {
    expect(
      wrapper
        .find('.wallet-option-container')
        .classes()
        .indexOf('selected')
    ).toBe(-1);

    wrapper.setProps({ selected: true });
    expect(
      wrapper
        .find('.wallet-option-container')
        .classes()
        .indexOf('selected')
    ).toBeGreaterThan(-1);
  });

  // describe('WalletOption.vue Methods', () => {
  //   it('should toggle expanded data when click checkbox', () => {

  //   });
  // });
});
