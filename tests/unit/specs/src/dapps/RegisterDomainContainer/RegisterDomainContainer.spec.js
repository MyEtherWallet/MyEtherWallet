import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import RegisterDomain from '@/dapps/RegisterDomain/RegisterDomain.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import { Tooling } from '@@/helpers';

describe('RegisterDomain.vue', () => {
  let localVue, i18n, wrapper, store;
  const domainName = 'domainName';
  const bidAmount = 0.001;
  const bidMask = 0.002;
  const nameHash = 'nameHash';
  const labelHash = 'labelHash';
  const owner = 'owner';
  const resolverAddress = 'resolverAddress';
  const deedOwner = 'deedOwner';
  const secretPhrase = 'secretPhrase';
  const auctionDateEnd = Date.now();
  const highestBid = 'highestBid';
  const contractInitiated = true;
  const step = 10;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(RegisterDomain, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'back-button': BackButton
      }
    });
  });

  it('should render correct domain name data', () => {
    wrapper.setData({ domainName });
    expect(wrapper.find('router-view').attributes('domain-name')).toEqual(
      domainName
    );
  });

  it('should render correct bidAmount data', () => {
    wrapper.setData({ bidAmount });
    expect(wrapper.find('router-view').attributes('bid-amount')).toEqual(
      String(bidAmount)
    );
  });

  it('should render correct bidMask data', () => {
    wrapper.setData({ bidMask });
    expect(wrapper.find('router-view').attributes('bid-mask')).toEqual(
      String(bidMask)
    );
  });

  it('should render correct nameHash data', () => {
    wrapper.setData({ nameHash });
    expect(wrapper.find('router-view').attributes('name-hash')).toEqual(
      nameHash
    );
  });

  it('should render correct labelHash data', () => {
    wrapper.setData({ labelHash });
    expect(wrapper.find('router-view').attributes('label-hash')).toEqual(
      labelHash
    );
  });

  it('should render correct owner data', () => {
    wrapper.setData({ owner });
    expect(wrapper.find('router-view').attributes('owner')).toEqual(owner);
  });

  it('should render correct resolverAddress data', () => {
    wrapper.setData({ resolverAddress });
    expect(wrapper.find('router-view').attributes('resolver-address')).toEqual(
      resolverAddress
    );
  });

  it('should render correct deedOwner data', () => {
    wrapper.setData({ deedOwner });
    expect(wrapper.find('router-view').attributes('deed-owner')).toEqual(
      deedOwner
    );
  });

  it('should render correct secretPhrase data', () => {
    wrapper.setData({ secretPhrase });
    expect(wrapper.find('router-view').attributes('secret-phrase')).toEqual(
      secretPhrase
    );
  });

  it('should render correct auctionDateEnd data', () => {
    wrapper.setData({ auctionDateEnd });
    expect(wrapper.find('router-view').attributes('auction-date-end')).toEqual(
      String(auctionDateEnd)
    );
  });

  it('should render correct highestBidder data', () => {
    wrapper.setData({ highestBid });
    expect(wrapper.find('router-view').attributes('highest-bidder')).toEqual(
      highestBid
    );
  });

  it('should render correct contractInitiated data', () => {
    wrapper.setData({ contractInitiated });
    expect(
      wrapper.find('router-view').attributes('contract-initiated')
    ).toEqual(String(contractInitiated));
  });

  it('should render correct step data', () => {
    wrapper.setData({ step });
    expect(wrapper.find('router-view').attributes('step')).toEqual(
      String(step)
    );
  });
});
