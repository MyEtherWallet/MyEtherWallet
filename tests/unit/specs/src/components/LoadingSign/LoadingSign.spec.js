import LoadingSign from '@/components/LoadingSign/LoadingSign.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';

const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
};

describe('LoadingSign.vue', () => {
  let localVue, i18n, wrapper, store, dispatch;

  const mockRouter = {
    push: sinon.stub()
  };

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    dispatch = sinon.stub();
    store.dispatch = dispatch;
  });

  beforeEach(() => {
    wrapper = shallowMount(LoadingSign, {
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

  it('should render correct loadingmessage1 props', () => {
    const loadingmessage1 = 'Loading...';
    expect(wrapper.find('.loading-message1').exists()).toBe(false);
    wrapper.setProps({ loadingmessage1 });
    expect(wrapper.find('.loading-message1').exists()).toBe(true);
    expect(
      wrapper.vm.$el.querySelector('.loading-message1').textContent.trim()
    ).toEqual(loadingmessage1);
  });

  it('should render correct loadingmessage2 props', () => {
    const loadingmessage2 = 'Loading...';
    expect(wrapper.find('.loading-message2').exists()).toBe(false);
    wrapper.setProps({ loadingmessage2 });
    expect(wrapper.find('.loading-message2').exists()).toBe(true);
    expect(
      wrapper.vm.$el.querySelector('.loading-message2').textContent.trim()
    ).toEqual(loadingmessage2);
  });
});
