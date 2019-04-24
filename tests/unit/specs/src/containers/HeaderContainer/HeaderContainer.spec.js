import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import HeaderContainer from '@/containers/HeaderContainer/HeaderContainer.vue';
import Blockie from '@/components/Blockie';
import Notification from '@/components/Notification';
import ScrollUpButton from '@/components/ScrollUpButton';
import SettingsModal from '@/components/SettingsModal';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

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

//xdescribe
describe('HeaderContainer.vue', () => {
  let localVue, i18n, wrapper, store, push, dispatch;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};

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
        'settings-modal': SettingsModal
        // 'notifications-modal': NotificationsModal,
        // 'logout-modal': LogoutModal,
        // 'logout-warning-modal': LogoutWarningModal,
        // 'issue-log-modal': IssueLogModal,
        // 'user-reminder-button': UserReminderButton
      },
      mocks: {
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

  xit('[Failing] should render correct isPageOnTop data', () => {
    expect(wrapper.vm.$data.isPageOnTop).toBe(true);
  });

  describe('HeaderContainer.vue Methods', () => {
    xit('[Failing] should render correct scrollTop method', () => {
      window.pageXOffset = 100;
      window.pageYOffset = 100;
      wrapper.vm.scrollTop();
      expect(window.pageXOffset).toBe(0);
      expect(window.pageYOffset).toBe(0);
    });

    xit('[Failing] should render correct logout method', () => {
      wrapper.vm.logout();
      expect(dispatch.calledWith('clearWallet')).toBe(true);
      expect(push.calledWith('/')).toBe(true);
    });

    xit('[Failing] should render correct showNotifications method', () => {
      wrapper.vm.showNotifications();
      expect(showModal.called).toBe(true);
    });
  });
});
