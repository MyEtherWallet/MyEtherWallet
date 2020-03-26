import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import ManageENS from '@/dapps/ManageENS/ManageENS.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import { Tooling } from '@@/helpers';

xdescribe('ManageENS.vue', () => {
  let localVue, i18n, wrapper, store;
  const domainName = 'domainName';
  const nameHash = 'nameHash';
  const labelHash = 'labelHash';
  const owner = 'owner';
  const resolverAddress = 'resolverAddress';
  const deedOwner = 'deedOwner';
  const secretPhrase = 'secretPhrase';
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
    wrapper = shallowMount(ManageENS, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'back-button': BackButton
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  xit('should render correct domain name data', () => {
    wrapper.setData({ domainName });
    expect(wrapper.find('router-view').attributes('domain-name')).toEqual(
      `${domainName}.eth`
    );
  });

  xit('should render correct nameHash data', () => {
    wrapper.setData({ nameHash });
    expect(wrapper.find('router-view').attributes('name-hash')).toEqual(
      nameHash
    );
  });

  xit('should render correct labelHash data', () => {
    wrapper.setData({ labelHash });
    expect(wrapper.find('router-view').attributes('label-hash')).toEqual(
      labelHash
    );
  });

  xit('should render correct owner data', () => {
    wrapper.setData({ owner });
    expect(wrapper.find('router-view').attributes('owner')).toEqual(owner);
  });

  xit('should render correct resolverAddress data', () => {
    wrapper.setData({ resolverAddress });
    expect(wrapper.find('router-view').attributes('resolver-address')).toEqual(
      resolverAddress
    );
  });

  xit('should render correct deedOwner data', () => {
    wrapper.setData({ deedOwner });
    expect(wrapper.find('router-view').attributes('deed-owner')).toEqual(
      deedOwner
    );
  });

  xit('should render correct secretPhrase data', () => {
    wrapper.setData({ secretPhrase });
    expect(wrapper.find('router-view').attributes('secret-phrase')).toEqual(
      secretPhrase
    );
  });

  xit('should render correct contractInitiated data', () => {
    wrapper.setData({ contractInitiated });
    expect(
      wrapper.find('router-view').attributes('contract-initiated')
    ).toEqual(String(contractInitiated));
  });

  xit('should render correct step data', () => {
    wrapper.setData({ step });
    expect(wrapper.find('router-view').attributes('step')).toEqual(
      String(step)
    );
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
