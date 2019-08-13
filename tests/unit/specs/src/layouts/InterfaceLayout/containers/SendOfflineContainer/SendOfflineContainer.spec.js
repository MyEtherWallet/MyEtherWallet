import Vue from 'vue';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import SendOfflineContainer from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/SendOfflineContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import { Tooling } from '@@/helpers';

xdescribe('SendOfflineContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  const spy = sinon.stub();
  const mockRouter = {
    push: spy
  };
  const mockRoute = {
    name: 'Send Offline'
  };

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(SendOfflineContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-container-title': InterfaceContainerTitle,
        popover: PopOver
      },
      mocks: {
        $router: mockRouter,
        $route: mockRoute
      }
    });
  });

  xit('should render correct nonce data', () => {
    // expect(
    //   wrapper.vm.$el.querySelector('router-view').getAttribute('nonce')
    // ).toBe(String(wrapper.vm.$data.nonce));

    console.log(wrapper.vm.$el.querySelector('.gas-amount input').textContent);
  });

  xit('should render correct gasLimit data', () => {
    expect(
      wrapper.vm.$el.querySelector('router-view').getAttribute('gas-limit')
    ).toBe(String(wrapper.vm.$data.gasLimit));
  });

  xit('should render correct rawTx data', () => {
    expect(
      wrapper.vm.$el.querySelector('router-view').getAttribute('raw-tx')
    ).toBe(wrapper.vm.$data.rawTx);
  });

  xit('should render correct tabs data', () => {
    const pointerEventsElements = wrapper.vm.$el.querySelectorAll(
      'div.prevent-pointer-events'
    );
    for (let i = 0; i < pointerEventsElements.length; i++) {
      const pointerEventsElement = pointerEventsElements[i];
      expect(
        pointerEventsElement.querySelector('p.title').textContent.trim()
      ).toEqual(wrapper.vm.$data.tabs[i].title);
      expect(
        pointerEventsElement.querySelector('p.description').textContent.trim()
      ).toEqual(wrapper.vm.$data.tabs[i].desc);
    }
  });
});
