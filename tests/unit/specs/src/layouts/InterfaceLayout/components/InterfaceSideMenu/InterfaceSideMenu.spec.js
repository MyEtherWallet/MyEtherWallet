// import Vue from 'vue';
// import { mount } from '@vue/test-utils';
// import InterfaceSideMenu from '@/layouts/InterfaceLayout/components/InterfaceSideMenu/InterfaceSideMenu.vue';
// import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
// import Notification from '@/components/Notification/Notification.vue';
// import PopOver from '@/components/PopOver/PopOver.vue';
// import { Tooling } from '@@/helpers';
// import sinon from 'sinon';
// import tabsConfig from '@/layouts/InterfaceLayout/components/InterfaceSideMenu/InterfaceSideMenu.config';

describe('InterfaceSideMenu.vue', () => {
  // let localVue, i18n, wrapper, store, spy;
  // beforeAll(() => {
  //   const baseSetup = Tooling.createLocalVueInstance();
  //   localVue = baseSetup.localVue;
  //   i18n = baseSetup.i18n;
  //   store = baseSetup.store;
  //   Vue.config.errorHandler = () => {};
  //   Vue.config.warnHandler = () => {};
  // });
  // beforeEach(() => {
  //   const mockRoute = {
  //     path: '/interface/deploy-contract'
  //   };
  //   spy = sinon.stub();
  //   const mockRouter = {
  //     push: spy
  //   };
  //   wrapper = mount(InterfaceSideMenu, {
  //     localVue,
  //     i18n,
  //     store,
  //     attachToDocument: true,
  //     stubs: {
  //       'back-button': BackButton,
  //       popover: PopOver,
  //       notification: Notification
  //     },
  //     mocks: {
  //       $route: mockRoute,
  //       $router: mockRouter
  //     }
  //   });
  // });
  it('should render correct tabAction method', () => {
    //   const groupTitleElements = wrapper.findAll('.menu-group-title');
    //   for (let i = 0; i < groupTitleElements.length; i++) {
    //     const groupTitleElement = groupTitleElements.at(i);
    //     groupTitleElement.trigger('click');
    //     expect(spy.calledWith({ path: tabsConfig.tabs[i].routes[0] }));
    //   }
  });
  // it('should render correct isTabActive method', () => {
  //   const groupTitleElements = wrapper.findAll('ul');
  //   for (let i = 0; i < groupTitleElements.length; i++) {
  //     const groupTitleElement = groupTitleElements.at(i);
  //     groupTitleElement.trigger('click');
  //     if (i == 2) expect(groupTitleElement.isVisible()).toBe(true);
  //   }
  // });
});
