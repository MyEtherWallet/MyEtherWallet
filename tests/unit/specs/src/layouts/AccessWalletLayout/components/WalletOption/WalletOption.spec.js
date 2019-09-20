import WalletOption from '@/layouts/AccessWalletLayout/components/WalletOption/WalletOption.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('WalletOption.vue', () => {
  let localVue, i18n, wrapper, store;
  const text = 'walletOption';

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
      attachToDocument: true,
      propsData: {text}
    });
  });

  it('should render correct text props', () => {
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
});
