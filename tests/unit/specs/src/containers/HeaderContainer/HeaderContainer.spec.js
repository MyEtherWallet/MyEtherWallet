import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import HeaderContainer from '@/containers/HeaderContainer/HeaderContainer.vue';
import Blockie from '@/components/Blockie';
import NotificationsContainer from '@/containers/NotificationsContainer';
import SettingsModal from '@/components/SettingsModal';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
import LogoutModal from '@/components/LogoutModal';
import { state, getters } from '@@/helpers/mockStore';

const BNavItemStub = {
  name: 'b-nav-item',
  template: '<div class="b-nav-item"><slot></slot></div>',
  props: ['to']
};

const showModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};
const mockRoute = {
  fullPath: '/#faqs'
};

const eventHub = {
  $on: sinon.stub(),
  $off: sinon.stub()
};

describe('HeaderContainer.vue', () => {
  let localVue, i18n, wrapper, store, push, dispatch;

  beforeAll(() => {
    window.scrollTo = jest.fn().mockImplementation((valX, valY) => {
      window.pageXOffset = valX;
      window.pageYOffset = valY;
    });
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};

    const actions = {
      clearWallet: jest.fn(),
      decryptWallet: jest.fn(),
      setGasPrice: jest.fn(),
      addSwapNotification: jest.fn()
    };

    getters.wallet = () => {
      return null;
    };

    getters.account = () => {
      return {
        balance: 0,
        address: null,
        identifier: 'keystore',
        isHardware: false
      };
    };

    state.account = {
      balance: 0,
      address: null,
      identifier: 'keystore',
      isHardware: false
    };

    store = new VueX.Store({
      actions,
      getters,
      state
    });

    dispatch = sinon.stub();
    store.dispatch = dispatch;
  });

  beforeEach(() => {
    push = sinon.stub();
    const mockRouter = {
      push: push
    };

    wrapper = shallowMount(HeaderContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'b-nav-item': BNavItemStub,
        blockie: Blockie,
        notification: NotificationsContainer,
        'b-modal': BModalStub,
        'settings-modal': SettingsModal,
        'logout-modal': LogoutModal
      },
      mocks: {
        $eventHub: eventHub,
        $router: mockRouter,
        $store: store,
        $route: mockRoute,
        _i18n: i18n,
        $root: {
          _i18n: i18n,
          $el: {
            getBoundingClientRect: function() {
              return 100;
            }
          }
        }
      }
    });
  });

  it('should render correct currentName data', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.current-language-flag p')
        .textContent.trim()
    ).toEqual(wrapper.vm.$data.currentName);
  });

  it('should render correct isMobileMenuOpen data', () => {
    expect(
      wrapper
        .find('.fixed-header')
        .classes()
        .indexOf('fixed-header-border-bottom')
    ).toBe(-1);
    wrapper.setData({ isMobileMenuOpen: true });
    wrapper.vm.$nextTick(() => {
      expect(
        wrapper
          .find('.fixed-header')
          .classes()
          .indexOf('fixed-header-border-bottom')
      ).toBeGreaterThan(-1);
    });
  });

  it('should render correct isHomePage data', async () => {
    expect(wrapper.findAll('.b-nav-item').length).toBe(1);
    wrapper.setData({ isHomePage: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.b-nav-item').length).toBe(1);
  });

  it('should render correct showGetFreeWallet data', async () => {
    wrapper.setData({ isPageOnTop: false, isMewCx: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.first-button').classes()).toContain('hide');
    wrapper.setData({
      showGetFreeWallet: true,
      isPageOnTop: false,
      isMewCx: false
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.first-button').classes()).toContain('show');
  });

  it('should render correct supportedLanguages data', () => {
    const dropDownItems = wrapper.vm.$el.querySelectorAll(
      '.language-menu-container b-dropdown-item-stub'
    );

    for (const [i, dropDownItem] of dropDownItems.entries()) {
      expect(dropDownItem.getAttribute('data-language-code')).toEqual(
        wrapper.vm.$data.supportedLanguages[i].langCode
      );
      expect(dropDownItem.getAttribute('data-flag-name')).toEqual(
        wrapper.vm.$data.supportedLanguages[i].flag
      );
    }
  });

  describe('HeaderContainer.vue Methods', () => {
    it('should render correct logout method', () => {
      expect(showModal.called).toBe(false);
      wrapper.vm.logout();
      expect(showModal.called).toBe(true);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
