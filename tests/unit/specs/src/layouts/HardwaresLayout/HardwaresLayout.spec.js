import { shallowMount } from '@vue/test-utils';
import HardwaresLayout from '@/layouts/HardwaresLayout/HardwaresLayout.vue';
import { Tooling } from '@@/helpers';

describe('HardwaresLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(HardwaresLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct items data', () => {
    let { items } = wrapper.vm.$data;
    items = items.filter(element => element.logo != '');
    const hardwareItems = wrapper.vm.$el.querySelectorAll('.hardware-item');
    for (const [i, hardwareItem] of hardwareItems.entries()) {
      const { price, href, currency } = items[i];
      const spanCurrency = hardwareItem.querySelector('.price-container span');
      const pPrice = hardwareItem.querySelector('.price-container p');
      const aHref = hardwareItem.querySelector('.more-info');

      expect(spanCurrency.textContent.trim()).toEqual(currency);
      expect(pPrice.textContent.trim()).toEqual(price);
      expect(aHref.getAttribute('href')).toEqual(href);
    }
  });
});
