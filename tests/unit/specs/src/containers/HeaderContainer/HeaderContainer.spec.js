import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import HeaderContainer from '@/containers/HeaderContainer/HeaderContainer.vue';
import Blockie from '@/components/Blockie';
import Notification from '@/components/Notification';
import ScrollUpButton from '@/components/ScrollUpButton';
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
  $on: sinon.stub()
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
        notification: Notification,
        'b-modal': BModalStub,
        'scroll-up-button': ScrollUpButton,
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

  it('should render correct isPageOnTop data', () => {
    expect(
      wrapper
        .find('.scrollup-container')
        .classes()
        .indexOf('active')
    ).toBe(-1);
    wrapper.setData({ isPageOnTop: false });
    expect(
      wrapper
        .find('.scrollup-container')
        .classes()
        .indexOf('active')
    ).toBeGreaterThan(-1);
  });

  it('should render correct currentName data', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.current-language-flag p')
        .textContent.trim()
    ).toEqual(wrapper.vm.$data.currentName);
  });

  it('should render correct  isMobileMenuOpen data', () => {
    expect(
      wrapper
        .find('.fixed-header')
        .classes()
        .indexOf('fixed-header-border-bottom')
    ).toBe(-1);
    wrapper.setData({ isMobileMenuOpen: true });
    expect(
      wrapper
        .find('.fixed-header')
        .classes()
        .indexOf('fixed-header-border-bottom')
    ).toBeGreaterThan(-1);
  });

  it('should render correct isPageOnTop data', () => {
    expect(
      wrapper
        .find('.scrollup-container')
        .classes()
        .indexOf('active')
    ).toBe(-1);
    wrapper.setData({ isPageOnTop: false });
    expect(
      wrapper
        .find('.scrollup-container')
        .classes()
        .indexOf('active')
    ).toBeGreaterThan(-1);
  });

  xit('[Failing 2019-07-16] should render correct isHomePage data', () => {
    expect(wrapper.findAll('.b-nav-item').length).toBe(3);
    wrapper.setData({ isHomePage: false });
    expect(wrapper.findAll('.b-nav-item').length).toBe(1);
  });

  it('should render correct showGetFreeWallet data', () => {
    wrapper.setData({ isPageOnTop: false });
    expect(
      wrapper
        .find('.first-button')
        .classes()
        .indexOf('hide')
    ).toBeGreaterThan(-1);
    wrapper.setData({ showGetFreeWallet: true });
    expect(
      wrapper
        .find('.first-button')
        .classes()
        .indexOf('show')
    ).toBeGreaterThan(-1);
  });

  it('should render correct supportedLanguages data', () => {
    const dropDownItems = wrapper.vm.$el.querySelectorAll(
      '.language-menu-container b-dropdown-item-stub'
    );
    for (let i = 0; i < dropDownItems.length; i++) {
      const dropDownItem = dropDownItems[i];
      expect(dropDownItem.getAttribute('data-language-code')).toEqual(
        wrapper.vm.$data.supportedLanguages[i].langCode
      );
      expect(dropDownItem.getAttribute('data-flag-name')).toEqual(
        wrapper.vm.$data.supportedLanguages[i].flag
      );
    }
  });

  describe('HeaderContainer.vue Methods', () => {
    it('should render correct scrollTop method', () => {
      window.pageXOffset = 100;
      window.pageYOffset = 100;
      wrapper.vm.scrollTop();
      expect(window.pageXOffset).toBe(0);
      expect(window.pageYOffset).toBe(0);
    });

    it('should render correct logout method', () => {
      expect(showModal.called).toBe(false);
      wrapper.vm.logout();
      expect(showModal.called).toBe(true);
    });
  });
});
