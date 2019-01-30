import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import Notification from '@/components/Notification/Notification.vue';
import { state, getters } from '@@/helpers/mockStore';
import { Tooling } from '@@/helpers';

const showModal = jest.fn();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};

describe('Notification.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    store = new VueX.Store({
      getters,
      state
    });

    wrapper = shallowMount(Notification, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'b-modal': BModalStub
      }
    });
  });

  xit('should render correct unreadCount', () => {
    expect(wrapper.find('.notification-dot').isVisible()).toBe(false);
    wrapper.setData({ unreadCount: 1 });
    expect(wrapper.find('.notification-dot').isVisible()).toBe(true);
  });

  xit('should show no notification item text', () => {
    expect(wrapper.find('.notification-no-item').isVisible()).toBe(true);
  });

  describe('Notification.vue Methods', () => {
    xit('should show notification when button click', () => {
      const notificationLogo = wrapper.find('.notification-logo');
      notificationLogo.trigger('click');
      expect(showModal).toHaveBeenCalled();
    });
  });
});
