import LogoutModal from '@/components/LogoutModal/LogoutModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';
import { state, getters } from '@@/helpers/mockStore';
import Vuex from 'vuex';

const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
};

describe('LogoutModal.vue', () => {
  let localVue, i18n, wrapper, store, dispatch, actions;

  const mockRouter = {
    push: sinon.stub()
  };

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    dispatch = sinon.stub();

    actions = {
      clearWallet: sinon.stub()
    };

    store = new Vuex.Store({
      modules: {
        main: {
          dispatch: dispatch,
          namespaced: true,
          state,
          getters,
          actions
        }
      }
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(LogoutModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'standard-button': StandardButton,
        'b-modal': BModalStub
      },
      mocks: {
        $router: mockRouter
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  describe('LogoutModal.vue Methods', () => {
    it('should cancel when button is clicked', () => {
      wrapper.find('.buttons .no').trigger('click');
      expect(hideModal.called).toBe(true);
    });

    it('should logout when button is clicked', () => {
      expect(dispatch.calledWith('clearWallet')).toBe(false);
      wrapper.find('.buttons .yes').trigger('click');
      expect(actions.clearWallet.called).toBe(true);
      expect(hideModal.called).toBe(true);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
