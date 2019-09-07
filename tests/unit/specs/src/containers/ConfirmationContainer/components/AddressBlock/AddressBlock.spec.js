import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import AddressBlock from '@/containers/ConfirmationContainer/components/AddressBlock/AddressBlock.vue';
import web3 from 'web3';
import { Tooling } from '@@/helpers';

function capitalize(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

describe('AddressBlock.vue', () => {
  let localVue, i18n, wrapper, store;
  const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
  const direction = 'from';
  const currency = 'ETH';
  const tokenTransferTo = 'tokenTransferTo';
  const tokenSymbol = 'tokenSymbol';
  const tokenTransferVal = '100';
  const value = '1000000000000';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(AddressBlock, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        address,
        direction,
        currency,
        tokenTransferTo,
        tokenSymbol,
        tokenTransferVal,
        value
      }
    });
  });

  it('should render correct address props', () => {
    wrapper.setProps({ tokenTransferTo: '' });
    expect(
      wrapper.vm.$el
        .querySelector('.address-container .address')
        .textContent.trim()
    ).toEqual(wrapper.vm.checksumAddress);
  });

  it('should render correct direction props', () => {
    expect(
      wrapper.vm.$el.querySelector('.identicon-container p').textContent.trim()
    ).toEqual(capitalize(direction) + ' Address');
  });

  it('should render correct currency props', () => {
    wrapper.setProps({ tokenSymbol: '' });
    expect(
      wrapper.vm.$el.querySelector('.currency-type').textContent.trim()
    ).toEqual(currency.toUpperCase());
  });

  it('should render correct tokenTransferVal props', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.currency-amt')
        .textContent.trim()
        .indexOf(tokenTransferVal)
    ).toBeGreaterThan(-1);
  });

  it('should render correct tokenSymbol props', () => {
    expect(
      wrapper.vm.$el.querySelector('.currency-type').textContent.trim()
    ).toEqual(tokenSymbol);
  });

  it('should render correct value props', () => {
    wrapper.setProps({ tokenTransferVal: '' });
    const eth = web3.utils.fromWei(value, 'ether');
    expect(
      wrapper.vm.$el
        .querySelector('.currency-amt')
        .textContent.trim()
        .indexOf(String(eth))
    ).toBeGreaterThan(-1);
  });

  describe('AddressBlock.vue Methods', () => {});
});
