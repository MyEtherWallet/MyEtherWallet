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

  it('should render correct buttonCheckEtherscan computed data', () => {
    wrapper.setData({ etherscanLink: 'etherscanLink' });
    expect(
      wrapper.vm.$el
        .querySelectorAll('.standard-button .the-button-box')[1]
        .textContent.trim()
    ).toEqual(wrapper.vm.buttonCheckEtherscan.title);
  });

  it('should render correct buttonOk computed data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.standard-button .the-button-box')[2]
        .textContent.trim()
    ).toEqual('');
  });

  describe('SuccessModal.vue Methods', () => {
    it('should render correct hideModal method', () => {
      wrapper.vm.hideModal();
      expect(hideModal.called).toBe(true);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
