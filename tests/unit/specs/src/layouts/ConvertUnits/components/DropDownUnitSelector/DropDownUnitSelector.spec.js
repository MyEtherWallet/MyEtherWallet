import { shallowMount } from '@vue/test-utils';
import DropDownUnitSelector from '@/layouts/ConvertUnits/components/DropDownUnitSelector/DropDownUnitSelector.vue';

import { Tooling } from '@@/helpers';

function capitalize(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

describe('DropDownUnitSelector.vue', () => {
  let localVue, i18n, wrapper, store;

  const options = ['Wei', 'Kwei', 'Mwei', 'Gwei', 'Szabo'];
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(DropDownUnitSelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { options }
    });
  });

  it('should render correct currentSelected props', () => {
    const currentSelected = capitalize(wrapper.props().currentSelected);
    expect(
      wrapper.vm.$el
        .querySelector('.selected-unit')
        .textContent.trim()
        .indexOf(currentSelected)
    ).toBeGreaterThan(-1);
  });

  it('should render correct dropdown-input-box data', async () => {
    wrapper.setData({ dropdownOpen: true });
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .find('.dropdown-input-box')
        .classes()
        .indexOf('dropdown-open')
    ).toBeGreaterThan(-1);
    wrapper.setData({ dropdownOpen: false });
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .find('.dropdown-input-box')
        .classes()
        .indexOf('dropdown-open')
    ).toBe(-1);
  });

  it('should render correct options props', async () => {
    const options = ['option1', 'option2'];
    wrapper.setProps({ options });
    await wrapper.vm.$nextTick();
    const liElements = wrapper.vm.$el.querySelectorAll(
      '.dropdown-list-box ul li'
    );
    for (let i = 0; i < liElements.length; i++) {
      expect(liElements[i].textContent.trim()).toEqual(capitalize(options[i]));
    }
  });

  describe('MobileMenuButton.vue Methods', () => {
    it('should toggle dropdown when button clicked', () => {
      wrapper.find('.dropdown-input-box').trigger('click');
      expect(wrapper.vm.$data.dropdownOpen).toBe(true);
      wrapper.find('.dropdown-input-box').trigger('click');
      expect(wrapper.vm.$data.dropdownOpen).toBe(false);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
