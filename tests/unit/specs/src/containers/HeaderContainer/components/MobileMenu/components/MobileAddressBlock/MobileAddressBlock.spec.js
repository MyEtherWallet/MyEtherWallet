import MobileAddressBlock from '@/containers/HeaderContainer/components/MobileMenu/components/MobileAddressBlock/MobileAddressBlock.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('MobileAddressBlock.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(MobileAddressBlock, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct account computed data', () => {
    expect(
      wrapper.vm.$el.querySelector('.the-address').textContent.trim()
    ).toEqual(wrapper.vm.account.address);
  });
});
