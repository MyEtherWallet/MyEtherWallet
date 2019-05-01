import DropDownBidCurrencySelector from '@/components/DropDownBidCurrencySelector/DropDownBidCurrencySelector.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';

const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
};

describe('DropDownBidCurrencySelector.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(DropDownBidCurrencySelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'standard-button': StandardButton,
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct dropdownOpen data', () => {
    expect(wrapper.find('.fa-chevron-down').exists()).toBe(true);
    expect(wrapper.find('.fa-chevron-up').exists()).toBe(false);
    wrapper.setData({ dropdownOpen: true });
    expect(wrapper.find('.fa-chevron-down').exists()).toBe(false);
    expect(wrapper.find('.fa-chevron-up').exists()).toBe(true);
  });

  it('should render correct options props', () => {
    const title = 'title';
    const options = {
      title: title
    };
    wrapper.setProps({ options });
    expect(
      wrapper.vm.$el
        .querySelector('.form-title-container .title')
        .textContent.trim()
    ).toEqual(title);
  });

  describe('DropDownBidCurrencySelector.vue Methods', () => {
    it('should hide disconnected modal when button clicked', () => {
      wrapper.setData({ dropdownOpen: true });
      wrapper.find('.dropdown-open').trigger('click', {
        path: []
      });
      expect(wrapper.vm.$data.dropdownOpen).toBe(false);
    });
  });
});
