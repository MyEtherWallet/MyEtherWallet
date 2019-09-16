import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import ErrorModal from '@/containers/ConfirmationContainer/components/ErrorModal/ErrorModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

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

describe('ErrorModal.vue', () => {
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
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(ErrorModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { message, linkTo },
      stubs: {
        'b-modal': BModalStub,
        'b-btn': BBtnStub
      },
      mocks: {
        $router: mockRoute
      }
    });
  });

  it('should render correct message props', () => {
    expect(
      wrapper.vm.$el.querySelector('.d-block p').textContent.trim()
    ).toEqual(message);
  });

  it('should render correct linkMessage props', () => {
    wrapper.setProps({ linkMessage });
    console.log(wrapper.vm.$el.querySelector('.close-button'));
  });

  describe('ErrorModal.vue Methods', () => {
    xit('should render correct hideModal method', () => {
      wrapper.vm.hideModal();
      expect(hideModal.called).toBe(true);
    });
  });
});
