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

  afterAll(() => {
    wrapper.destroy();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct search data', async () => {
    const search = 'search';
    wrapper.setData({ search });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('.search-block input').element.value;
    expect(input).toEqual(search);
  });

  it('should render correct customTokens data', () => {
    wrapper.setData({ customTokens });

    const tableElement = wrapper.findAll('.token-table-container table').at(0);
    const trElements = tableElement.findAll('tr');
    trElements.wrappers.forEach((trElement, i) => {
      expect(
        trElement
          .findAll('td')
          .at(0)
          .element.text()
      ).toEqual(customTokens[i].name);
      expect(
        trElement
          .findAll('td')
          .at(1)
          .element.text()
      ).toEqual(String(customTokens[i].balance));
    });
  });

  it('should render correct localTokens data', () => {
    wrapper.setData({ localTokens });
    const tableElement = wrapper.findAll('.token-table-container table').at(1);
    const trElements = tableElement.findAll('tr');
    trElements.wrappers.forEach((trElement, i) => {
      expect(
        trElement
          .findAll('td')
          .at(0)
          .element.text()
      ).toEqual(localTokens[i].name);
      expect(
        trElement
          .findAll('td')
          .at(1)
          .element.text()
      ).toEqual(String(localTokens[i].balance));
    });
  });

  describe('InterfaceTokens.vue Methods', () => {
    it('should render correct addTokenModal method', () => {
      wrapper.vm.addTokenModal();
      expect(showModal.called).toBe(true);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
