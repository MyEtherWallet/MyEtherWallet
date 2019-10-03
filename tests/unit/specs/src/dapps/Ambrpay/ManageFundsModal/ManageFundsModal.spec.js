import ManageFundsModal from '@/dapps/Ambrpay/components/ManageFundsModal/ManageFundsModal.vue';
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

describe('ManageFundsModal.vue', () => {
  let localVue, wrapper, i18n, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ManageFundsModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        manageFundsText: 'Add',
        availableBalanceEth: '5',
        availableBalanceUSD: '1'
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
    expect(wrapper.vm.$data.actionStep).toEqual(true);
    expect(wrapper.vm.$data.ethAmount).toEqual(0);
    expect(wrapper.vm.$data.errMsg).toEqual('');
  });

  it('should set ethAmount and errMsg to null if manageFundsText differ', () => {
    wrapper.setData({ ethAmount: 3 });
    wrapper.setData({ errMsg: 'Amount higher than balance' });
    wrapper.setProps({ manageFundsText: 'Withdraw' });
    wrapper.setProps({ manageFundsText: 'Add' });

    expect(wrapper.vm.$data.ethAmount).toEqual(0);
    expect(wrapper.vm.$data.errMsg).toEqual('');
  });

  it('should keep ethAmount and errMsg if manageFundsText the same', () => {
    wrapper.setData({ ethAmount: 3 });
    wrapper.setProps({ manageFundsText: 'Add' });

    expect(wrapper.vm.$data.ethAmount).toEqual(3);
  });

  it('should set the correct error message when value is 0', () => {
    const input = wrapper.find('input');
    input.setValue(0);
    expect(wrapper.vm.$data.errMsg).toEqual('Amount must be higher than 0');
  });

  it('should set the correct error message when value is greater than account balance', () => {
    const input = wrapper.find('input');

    wrapper.setData({ account: { balance: 5 } });
    input.setValue(10);
    expect(wrapper.vm.$data.errMsg).toEqual('Amount higher than balance');
  });

  it('should set the correct error message when value is greater than account balance', () => {
    const input = wrapper.find('input');

    wrapper.setProps({ manageFundsText: 'Withdraw' });
    input.setValue(6);
    expect(wrapper.vm.$data.errMsg).toEqual(
      'Amount higher than subscription balance'
    );
  });

  it('should not have an error message if everything is correct', () => {
    const input = wrapper.find('input');

    wrapper.setProps({ manageFundsText: 'Withdraw' });
    input.setValue(4);
    expect(wrapper.vm.$data.errMsg).toEqual('');
  });

  it('should call onClick on button click', () => {
    const onClickStub = sinon.stub();
    wrapper.setMethods({ onClick: onClickStub });
    wrapper.find('button').trigger('click');
    expect(onClickStub.called).toBe(true);
  });

  it('should call emit and set actionStep to false if manageFundsText is add', () => {
    wrapper.setData({ actionStep: true });
    wrapper.find('button').trigger('click');
    wrapper.vm.$emit('addFunds');
    expect(wrapper.vm.$data.actionStep).toBe(false);
    expect(wrapper.emitted().addFunds).toBeTruthy();
  });

  it('should call emit and set actionStep to false if manageFundsText is withdraw', () => {
    wrapper.setProps({ manageFundsText: 'Withdraw' });
    wrapper.setData({ actionStep: true });
    wrapper.find('button').trigger('click');
    wrapper.vm.$emit('withdrawFunds');
    expect(wrapper.vm.$data.actionStep).toBe(false);
    expect(wrapper.emitted().withdrawFunds).toBeTruthy();
  });

  it('should set actionStep to be true and hide the modal', () => {
    wrapper.setData({ actionStep: false });
    wrapper.find('button').trigger('click');

    expect(wrapper.vm.$data.actionStep).toBe(true);
    expect(hideModal.called).toBe(true);
  });
});
