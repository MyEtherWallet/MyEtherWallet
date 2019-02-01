import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import ManageENSContainer from '@/dapps/RegisterDomain/containers/ManageENSContainer/ManageENSContainer.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { state, getters } from '@@/helpers/mockStore';
import { Tooling } from '@@/helpers';

describe('ManageENSContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const push = sinon.stub();
  const mockRouter = {
    push: push
  };
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};

    store = new Vuex.Store({
      getters,
      state
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(ManageENSContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-bottom-text': InterfaceBottomText
      },
      mocks: {
        $router: mockRouter
      }
    });
  });

  it('should push correct route', () => {
    expect(push.calledWith('/interface/dapps/register-domain'));
  });

  it('should render correct domainName props', () => {
    const domainName = 'domainName';
    wrapper.setProps({ domainName });
    expect(
      wrapper.vm.$el
        .querySelector('.manage-ens-container h3')
        .textContent.trim()
        .indexOf(domainName)
    ).toBeGreaterThan(-1);
  });

  xit('should render correct resolverAddress data', () => {
    const resolverAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
    wrapper.setData({ resolverAddress });
    expect(
      wrapper.vm.$el.querySelectorAll('.manage-form input')[0].value
    ).toEqual(resolverAddress);
  });

  it('should render correct transferTo data', () => {
    const transferTo = 'transferTo';
    wrapper.setData({ transferTo });
    expect(
      wrapper.vm.$el.querySelectorAll('.manage-form input')[1].value
    ).toEqual(transferTo);
  });

  describe('ManageENSContainer.vue Methods', () => {
    it('should render correct updateResolver props', () => {
      const updateResolver = sinon.stub();
      const resolverAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      wrapper.setData({ resolverAddress });
      wrapper.setProps({ updateResolver });
      wrapper.find('.submit-container button').trigger('click');
      expect(updateResolver.called).toBe(true);
    });

    it('should render correct transferDomain props', () => {
      const transferDomain = sinon.stub();
      wrapper.setData({ transferDomain });
      const resolverAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      wrapper.setData({ resolverAddress });
      wrapper
        .findAll('.submit-container button')
        .at(1)
        .trigger('click');
      expect(transferDomain.called).toBe(true);
    });
  });
});
