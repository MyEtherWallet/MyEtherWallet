import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

const hideModal = sinon.stub();
const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
};

const BBtnStub = {
  name: 'b-btn',
  template: '<div  class="b-btn"><slot></slot></div>'
};

describe('SuccessModal.vue', () => {
  let localVue, i18n, wrapper, store;
  const message = 'message';
  const linkMessage = 'linkMessage';
  const linkTo = '/linkTo';

  const spy = sinon.stub();
  const mockRoute = {
    push: spy
  };

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = new VueX.Store({
      modules: {
        main: {
          namespaced: true,
          state,
          getters
        }
      }
    });

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(SuccessModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { message, linkTo },
      stubs: {
        'b-modal': BModalStub,
        'b-btn': BBtnStub,
        'standard-button': StandardButton
      },
      mocks: {
        $router: mockRoute
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct message props', () => {
    expect(
      wrapper.vm.$el.querySelector('.d-block p').textContent.trim()
    ).toEqual(message);
  });

  it('should render correct linkMessage props', () => {
    expect(wrapper.vm.buttonOk.title).toEqual('OK');
    wrapper.setProps({ linkMessage });
    expect(wrapper.vm.buttonOk.title).toEqual(linkMessage);
  });

  it('should not render ethplorers buttons without tx', () => {
    expect(
      wrapper.findAll(StandardButton).length
    ).toBe(1);

    expect(
      wrapper.find(StandardButton).props('options')
    ).toEqual(wrapper.vm.buttonOk);
  });

  it('should render ethplorers buttons with tx', () => {
    wrapper.setProps({ txHashExlporrer: 'txHashTest' });
    wrapper.vm.explorers.forEach((item, index) => {
      expect(
        wrapper.findAll(StandardButton).at(index).props('options')
      ).toEqual(item.options);
    });

    expect(
      wrapper.findAll(StandardButton).at(wrapper.vm.explorers.length).props('options')
    ).toEqual(wrapper.vm.buttonOk);
  });

  it('should render ethplorers buttons by data from blockExplorers', () => {
    const tx = 'txHashTest';
    wrapper.setProps({ txHashExlporrer: tx });
    expect(
      wrapper.vm.explorers.map(item => item.link)
    ).toEqual(
      wrapper.vm.network.type.blockExplorers.map(item => item.tx.replace('[[txHash]]', tx))
    );
  });

  describe('SuccessModal.vue Methods', () => {
    it('should render correct hideModal method', () => {
      wrapper.vm.hideModal();
      expect(hideModal.called).toBe(true);
    });
  });
});
