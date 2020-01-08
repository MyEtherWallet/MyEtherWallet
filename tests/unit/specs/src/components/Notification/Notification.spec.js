import { shallowMount } from '@vue/test-utils';
import NotificationsContainer from '@/containers/NotificationsContainer/NotificationsContainer.vue';
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

describe('NotificationsContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(NotificationsContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct unreadCount', () => {
    expect(wrapper.find('.notification-dot').isVisible()).toBe(false);
    wrapper.setData({ unreadCount: 1, detailsShown: false });
    expect(wrapper.find('.notification-dot').isVisible()).toBe(true);
  });

  it('should render correct detailsShown', () => {
    wrapper.setData({ detailsShown: true });
    expect(wrapper.find('.notification-item-container').isVisible()).toBe(true);
    wrapper.setData({ detailsShown: false });
    expect(wrapper.find('.notification-no-item').isVisible()).toBe(true);
  });

  describe('NotificationsContainer.vue Methods', () => {
    it('should show notification when button click', () => {
      const notificationLogo = wrapper.find('.notification-logo');
      notificationLogo.trigger('click');
      expect(showModal).toHaveBeenCalled();
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
