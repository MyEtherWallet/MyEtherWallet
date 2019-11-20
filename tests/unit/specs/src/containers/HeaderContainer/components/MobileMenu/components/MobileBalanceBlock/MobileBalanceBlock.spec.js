import MobileBalanceBlock from '@/containers/HeaderContainer/components/MobileMenu/components/MobileBalanceBlock/MobileBalanceBlock.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import InterfaceBalanceModal from '@/layouts/InterfaceLayout/components/InterfaceBalanceModal';

import sinon from 'sinon';

const showModal = sinon.stub();
const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal,
    hide: hideModal
  }
};

describe('MobileBalanceBlock.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(MobileBalanceBlock, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'b-modal': BModalStub,
        'interface-balance-modal': InterfaceBalanceModal
      }
    });
  });

  it('should render correct accountBalance data', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.bottom-block .the-address')
        .textContent.trim()
        .indexOf(wrapper.vm.accountBalance)
    ).toBeGreaterThan(-1);
    expect(
      wrapper.vm.$el
        .querySelector('.bottom-block .the-address')
        .textContent.trim()
        .indexOf(wrapper.vm.network.type.currencyName)
    ).toBeGreaterThan(-1);
  });

  describe('MobileMenuButton.vue Methods', () => {
    it('should open balance modal when button clicked', () => {
      wrapper.find('.show-balance-button').trigger('click');
      expect(showModal.called).toBe(true);
    });
  });
});
