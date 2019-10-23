import Vue from 'vue';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import InterfaceTokens from '@/layouts/InterfaceLayout/components/InterfaceTokens/InterfaceTokens.vue';
import InterfaceTokensModal from '@/layouts/InterfaceLayout/components/InterfaceTokensModal/InterfaceTokensModal.vue';
import { Tooling } from '@@/helpers';

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

describe('InterfaceTokens.vue', () => {
  const customTokens = [
    { name: 'ETH', balance: 200 },
    { name: 'BTH', balance: 300 },
    { name: 'ETC', balance: 400 }
  ];

  const localTokens = [
    { name: 'ETH', balance: 200 },
    { name: 'BTH', balance: 300 },
    { name: 'ETC', balance: 400 }
  ];

  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
    Vue.config.errorHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(InterfaceTokens, {
      localVue,
      i18n,
      store,
      stubs: {
        'interface-tokens-modal': InterfaceTokensModal,
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct search data', () => {
    const search = 'search';
    wrapper.setData({ search });
    expect(wrapper.vm.$el.querySelector('.search-block input').value).toEqual(
      search
    );
  });

  it('should render correct customTokens data', () => {
    wrapper.setData({ customTokens });

    const tableElement = wrapper.vm.$el.querySelectorAll(
      '.token-table-container table'
    )[0];
    const trElements = tableElement.querySelectorAll('tr');

    for (const [i, trElement] of trElements.entries()) {
      expect(trElement.querySelectorAll('td')[0].textContent.trim()).toEqual(
        customTokens[i].name
      );
      expect(trElement.querySelectorAll('td')[1].textContent.trim()).toEqual(
        String(customTokens[i].balance)
      );
    }
  });

  it('should render correct localTokens data', () => {
    wrapper.setData({ localTokens });
    const tableElement = wrapper.vm.$el.querySelectorAll(
      '.token-table-container table'
    )[1];
    const trElements = tableElement.querySelectorAll('tr');
    for (const [i, trElement] of trElements.entries()) {
      expect(trElement.querySelectorAll('td')[0].textContent.trim()).toEqual(
        localTokens[i].name
      );
      expect(trElement.querySelectorAll('td')[1].textContent.trim()).toEqual(
        String(localTokens[i].balance)
      );
    }
  });

  describe('InterfaceTokens.vue Methods', () => {
    it('should render correct addTokenModal method', () => {
      wrapper.vm.addTokenModal();
      expect(showModal.called).toBe(true);
    });
  });
});
