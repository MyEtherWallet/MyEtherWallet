import WalletOption from '@/layouts/AccessWalletLayout/components/WalletOption/WalletOption.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import sinon from 'sinon';

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

  xit('[4-23-19] should render correct selected props', () => {
    expect(
      wrapper
        .find('.wallet-option-container')
        .classes()
        .indexOf('selected')
    ).toBe(-1);
    expect(
      wrapper
        .find('.good-button')
        .classes()
        .indexOf('not-good')
    ).toBeGreaterThan(-1);
    wrapper.setProps({ selected: true });
    expect(
      wrapper
        .find('.wallet-option-container')
        .classes()
        .indexOf('selected')
    ).toBeGreaterThan(-1);
    expect(
      wrapper
        .find('.good-button')
        .classes()
        .indexOf('not-good')
    ).toBe(-1);
  });

  describe('WalletOption.vue Methods', () => {
    xit('[4-23-19] should toggle expanded data when click checkbox', () => {
      wrapper.setProps({ disabled: true });
      const divParent = wrapper.find('.inactive');
      wrapper.setProps({ disabled: false });
      const select = sinon.stub();
      wrapper.setProps({ select });
      divParent.trigger('click');
      expect(select.called).toBe(true);
    });
  });
});
