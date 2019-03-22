import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import InitialENSStateContainer from '@/dapps/ManageENS/containers/InitialENSStateContainer/InitialENSStateContainer.vue';
import { Tooling } from '@@/helpers';

describe('InitialENSStateContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const checkDomain = sinon.stub();
  const domainName = '';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(InitialENSStateContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { domainName, checkDomain }
    });
  });

  xit('should render correct domain name', () => {
    expect(wrapper.vm.$el.querySelector('.domain-name input').value).toEqual(
      domainName
    );
  });

  xit('should render correct localdomainName watch method', () => {
    wrapper.setProps({ domainName: 'domainName11' });
    expect(wrapper.emitted().domainNameChange).toBeTruthy();
  });

  it('should render correct domainNameErr props', () => {
    wrapper.setData({ domainNameErr: true });
    expect(wrapper.find('p.erroredMsg').isVisible()).toBe(true);
    wrapper.setData({ domainNameErr: false });
    expect(wrapper.find('p.erroredMsg').isVisible()).toBe(false);
  });

  it('should show/hide contract loading warning according to contractInitiated flag', () => {
    expect(wrapper.find('.contract-loading-warning').isVisible()).toBe(true);
    wrapper.setData({ contractInitiated: true });
    expect(wrapper.find('.contract-loading-warning').isVisible()).toBe(false);
  });

  it('should show/hide spinner icon according to loading flag', () => {
    expect(wrapper.find('.fa-spinner').isVisible()).toBe(false);
    wrapper.setData({ loading: true });
    expect(wrapper.find('.fa-spinner').isVisible()).toBe(true);
  });

  describe('InitialENSStateContainer.vue Methods', () => {
    it('should check domain when submit button clicked', () => {
      wrapper.find('.submit-button').trigger('click');
      expect(checkDomain.called).toBe(true);
    });
  });
});
