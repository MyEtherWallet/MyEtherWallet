import DropDownAddressSelector from '@/components/DropDownAddressSelector/DropDownAddressSelector.vue';
import { shallowMount } from '@vue/test-utils';

import { Tooling } from '@@/helpers';

describe('DropDownAddressSelector.vue', () => {
  let localVue, i18n, store, wrapper;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(DropDownAddressSelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      computed: {
        addresses() {
          return [
            {
              address: 'mewtopiax.eth',
              currency: 'ETH',
              nickname: 1
            },
            {
              address: '1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9',
              currency: 'ETH',
              nickname: 2
            }
          ];
        }
      }
    });
  });

  afterAll(() => {
    wrapper.destroy();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('render correct addresses', async () => {
    const dropdownOpen = wrapper.find('.dropdown-open-button');
    dropdownOpen.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.dropdownOpen).toBe(true);
    const addressElements = wrapper.findAll(
      '.dropdown-list-box .listed-address'
    );
    addressElements.wrappers.forEach((addressElement, i) => {
      expect(addressElement.text().trim()).toContain(
        wrapper.vm.addresses[i].address
      );
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
