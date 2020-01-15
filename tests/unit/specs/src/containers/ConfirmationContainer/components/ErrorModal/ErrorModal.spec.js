import Vue from 'vue';
import { mount } from '@vue/test-utils';
import ErrorModal from '@/containers/ConfirmationContainer/components/ErrorModal/ErrorModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

const hideModal = sinon.stub();
const showModal = sinon.stub();
const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal,
    show: showModal
  }
};

const BBtnStub = {
  name: 'b-btn',
  template: '<div class="b-btn"><slot></slot></div>'
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
    wrapper = mount(ErrorModal, {
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

  afterAll(() => {
    wrapper.destroy();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct message props', () => {
    const message = wrapper.find('.d-block p').text();
    expect(message.trim()).toEqual(message);
  });

  it('should render correct linkMessage props', async () => {
    wrapper.vm.$refs.errorModal.show();
    await wrapper.vm.$nextTick();
    const container = wrapper.findAll('.button-container');
    expect(container.at(0).text()).toEqual('An Error Occured');
    wrapper.setProps({ linkMessage });
    expect(container.at(0).text()).toEqual(linkMessage);
  });

  describe('ErrorModal.vue Methods', () => {
    it('should render correct hideModal method', () => {
      wrapper.vm.hideModal();
      expect(hideModal.called).toBe(true);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
