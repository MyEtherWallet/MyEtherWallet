import CustomerSupport from '@/components/CustomerSupport/CustomerSupport.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import sinon from 'sinon';

const showModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};

describe('CustomerSupport.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    const mockRouter = {
      history: {
        current: {
          fullPath: '/'
        }
      }
    };

    wrapper = shallowMount(CustomerSupport, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      mocks: {
        $router: mockRouter
      },
      stubs: {
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct browser data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.email-prefill-inputs input')[0]
        .value.trim()
    ).toEqual(wrapper.vm.$data.browser);
  });

  it('should render correct os data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.email-prefill-inputs input')[1]
        .value.trim()
    ).toEqual(wrapper.vm.$data.os);
  });

  it('should render correct device data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.email-prefill-inputs input')[2]
        .value.trim()
    ).toEqual(wrapper.vm.$data.device);
  });

  it('should render correct address data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.email-prefill-inputs input')[3]
        .value.trim()
    ).toEqual(wrapper.vm.$data.address);
  });

  it('should render correct url data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.email-prefill-inputs input')[4]
        .value.trim()
    ).toEqual(wrapper.vm.$data.url);
  });

  it('should render correct description data', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.email-prefill-inputs textarea')
        .value.trim()
    ).toEqual(wrapper.vm.$data.description);
  });

  it('should render correct noIcon props', () => {
    expect(
      wrapper
        .find('.support-content')
        .classes()
        .indexOf('with-icon')
    ).toBeGreaterThan(-1);
    wrapper.setProps({ noIcon: true });
    expect(
      wrapper
        .find('.support-content')
        .classes()
        .indexOf('without-icon')
    ).toBeGreaterThan(-1);
  });

  it('should render correct issueLinkout computed data', () => {
    const url = wrapper.vm.$data.url;
    const browser = wrapper.vm.$data.browser;
    const os = wrapper.vm.$data.os;
    const device = wrapper.vm.$data.device;
    const description = wrapper.vm.$data.description;
    const subject = `Issue on ${url}`;
    const body = `
        Browser: ${browser},
        Os: ${os},
        Device: ${device},
        url: ${url}
        Wallet Address: ${url}


        ${description}
      `;
    expect(wrapper.vm.issueLinkOut).toEqual(
      `mailto:support@myetherwallet.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  });

  describe('CustomerSupport.vue Methods', () => {
    it('should show emailPrefill modal when button clicked', () => {
      wrapper.find('.support-content').trigger('click');
      expect(showModal.called).toBe(true);
    });
  });
});
