import { shallowMount } from '@vue/test-utils';
import MnemonicTableToDisplay from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/PrintModal/components/MnemonicTableToDisplay';
import { Tooling } from '@@/helpers';

xdescribe('MnemonicTableToDisplay.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(MnemonicTableToDisplay, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct contents', () => {
    const mnemonic = [];
    mnemonic.push('values1');
    mnemonic.push('values2');
    mnemonic.push('values3');
    wrapper.setProps({ mnemonic });
    const itemElements = wrapper.vm.$el.querySelectorAll('item');

    for (const [i, itemElement] of itemElements.entries()) {
      expect(itemElement.textContent.trim()).toEqual(mnemonic[i]);
    }
  });

  it('should render isTwentyFour props data', () => {
    expect(
      wrapper
        .find('.full-mnemonic')
        .classes()
        .indexOf('full-mnemonic')
    ).toBeGreaterThan(-1);
  });
});
