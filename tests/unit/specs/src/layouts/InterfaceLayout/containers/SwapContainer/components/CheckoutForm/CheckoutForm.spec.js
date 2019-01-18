import { shallowMount } from '@vue/test-utils';
import CheckoutForm from '@/layouts/InterfaceLayout/containers/SwapContainer/components/CheckoutForm/CheckoutForm.vue';

import { Tooling } from '@@/helpers';

describe('CheckoutForm.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(CheckoutForm, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct content', () => {
    expect(wrapper.find('#payment_form').exists()).toBe(true);
  });

  it('should render correct formData version', () => {
    const formData = {};
    formData.version = '2.0';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[0].value
    ).toEqual(formData.version);
  });

  it('should render correct formData partner', () => {
    const formData = {};
    formData.partner = 'partner';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[1].value
    ).toEqual(formData.partner);
  });

  it('should render correct formData return_url', () => {
    const formData = {};
    formData.return_url = 'return_url';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[3].value
    ).toEqual(formData.return_url);
  });

  it('should render correct formData quote_id', () => {
    const formData = {};
    formData.quote_id = 'quote_id';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[4].value
    ).toEqual(formData.quote_id);
  });

  it('should render correct formData payment_id', () => {
    const formData = {};
    formData.payment_id = 'payment_id';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[5].value
    ).toEqual(formData.payment_id);
  });

  it('should render correct formData user_id', () => {
    const formData = {};
    formData.user_id = 'user_id';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[6].value
    ).toEqual(formData.user_id);
  });

  it('should render correct formData destination_wallet_address', () => {
    const formData = {};
    formData.destination_wallet_address = 'destination_wallet_address';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[7].value
    ).toEqual(formData.destination_wallet_address);
  });

  it('should render correct formData destination_wallet_currency', () => {
    const formData = {};
    formData.destination_wallet_currency = 'destination_wallet_currency';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[8].value
    ).toEqual(formData.destination_wallet_currency);
  });

  it('should render correct formData fiat_total_amount_amount', () => {
    const formData = {};
    formData.fiat_total_amount_amount = 'fiat_total_amount_amount';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[9].value
    ).toEqual(formData.fiat_total_amount_amount);
  });

  it('should render correct formData fiat_total_amount_currency', () => {
    const formData = {};
    formData.fiat_total_amount_currency = 'fiat_total_amount_currency';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[10].value
    ).toEqual(formData.fiat_total_amount_currency);
  });

  it('should render correct formData digital_total_amount_amount', () => {
    const formData = {};
    formData.digital_total_amount_amount = 'digital_total_amount_amount';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[11].value
    ).toEqual(formData.digital_total_amount_amount);
  });

  it('should render correct formData digital_total_amount_currency', () => {
    const formData = {};
    formData.digital_total_amount_currency = 'digital_total_amount_currency';
    wrapper.setProps({ formData });
    expect(
      wrapper.vm.$el.querySelectorAll('#payment_form input')[12].value
    ).toEqual(formData.digital_total_amount_currency);
  });

  describe('CheckoutForm.vue Methods', () => {});
});
