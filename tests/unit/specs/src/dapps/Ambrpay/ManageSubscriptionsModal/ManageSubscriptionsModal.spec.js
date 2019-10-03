import ManageSubscriptionsModal from '@/dapps/Ambrpay/components/ManageSubscriptionsModal/ManageSubscriptionsModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import sinon from 'sinon';

const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  methods: {
    hide: hideModal
  }
};

describe('ManageSubscriptionsModal.vue', () => {
  let localVue, wrapper, i18n, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ManageSubscriptionsModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        subscriptions: []
      },
      stubs: {
        'b-modal': BModalStub
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.moreInfo).toEqual(false);
  });

  it('should tell the client theres no subscriptions if theres no subscriptions', () => {
    expect(wrapper.find('.no-sub-container p').text()).toBe(
      'You have no active subscriptions!'
    );
  });

  describe('if there are active subscriptions', () => {
    beforeEach(() => {
      const subscriptions = [
        {
          id: 's_q1XqMxVfJcp2C1',
          cycleStart: '05.03.2019',
          cycleEnd: '05.04.2019',
          price: 0.01,
          storagePos: 32,
          subscriptionPlan: 'Crypto to Crypto',
          subscriptionInterval: 1,
          receiverWallet: '0x5D6a22Cc5c70D452E406Df657C0f6beE5508C802',
          subscriptionPlanCurrencyCode: 'ETH',
          subscriptionCurrencyCode: 'ETH',
          subscriptionStatus: 'Unpaid',
          smartContractAddress: '0xa5a179c7570F4d17F174F73c7668013000E305a4'
        }
      ];
      wrapper.setProps({ subscriptions: subscriptions });
    });

    it('should call formatDate()', () => {
      const formatDateStub = sinon.stub();
      wrapper.setMethods({ formatDate: formatDateStub });

      expect(formatDateStub.called).toBe(true);
    });

    it('should show a subscription-container', () => {
      expect(wrapper.find('.subscription-container').exists()).toBe(true);
    });

    it('should call toggleMoreInfo() on click', () => {
      const toggleMoreInfoStub = sinon.stub();
      wrapper.setMethods({ toggleMoreInfo: toggleMoreInfoStub });
      wrapper.find('i.fa-angle-down').trigger('click');

      expect(toggleMoreInfoStub.called).toBe(true);
    });

    it('should toggle more info on toggleMoreInfo()', () => {
      wrapper.find('i.fa-angle-down').trigger('click');
      expect(wrapper.find('i.fa-angle-up').exists()).toBe(true);
      expect(wrapper.vm.$data.moreInfo).toBe(true);
    });

    it('should call copyToClipboard', () => {
      const copyToClipboardStub = sinon.stub();
      wrapper.setMethods({ copyToClipboard: copyToClipboardStub });
      wrapper.find('.address-txt').trigger('click');

      expect(copyToClipboardStub.called).toBe(true);
    });

    it('should call unsubscribe() on btn click', () => {
      const unsubscribeStub = sinon.stub();
      wrapper.setMethods({ unsubscribe: unsubscribeStub });
      wrapper.find('button').trigger('click');

      expect(unsubscribeStub.called).toBe(true);
    });

    it('should call $emit and hide the modal on btn click', done => {
      wrapper.find('button').trigger('click');

      wrapper.vm.$emit('unsubscribeSub');
      expect(wrapper.emitted().unsubscribeSub).toBeTruthy();

      wrapper.vm.$nextTick(() => {
        expect(hideModal.called).toBe(true);
        done();
      });
    });
  });
});
