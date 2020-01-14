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
    const container = wrapper.find('.identicon-container p').text();
    expect(container).toEqual(capitalize(direction) + ' Address');
  });

  it('should render correct currency props', async () => {
    wrapper.setProps({ tokenSymbol: 'ETH' });
    await wrapper.vm.$nextTick();
    const textValue = wrapper.find('.currency-type').text();
    expect(textValue.trim()).toEqual(currency.toUpperCase());
  });

  it('should render correct tokenTransferVal props', () => {
    const textValue = wrapper
      .find('.currency-amt')
      .text()
      .trim();
    expect(textValue).toEqual(tokenTransferVal.trim());
  });

  it('should render correct tokenSymbol props', () => {
    const textValue = wrapper.find('.currency-type').text();
    expect(textValue).toEqual(tokenSymbol);
  });

  it('should render correct value props', async () => {
    wrapper.setProps({ tokenTransferVal: '100' });
    await wrapper.vm.$nextTick();
    const eth = '100';
    const textValue = wrapper
      .find('.currency-amt')
      .text()
      .trim();
    expect(textValue).toEqual(String(eth));
  });

  describe('AddressBlock.vue Methods', () => {});

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
