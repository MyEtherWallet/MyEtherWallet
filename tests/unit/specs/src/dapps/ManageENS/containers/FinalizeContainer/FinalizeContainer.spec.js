/* eslint-disable no-undef */
import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import FinalizeContainer from '@/dapps/ManageENS/containers/FinalizeContainer/FinalizeContainer.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { Tooling } from '@@/helpers';

describe('FinalizeContainer.vue', () => {
  let localVue, i18n, wrapper, store;
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
    wrapper = shallowMount(FinalizeContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-bottom-text': InterfaceBottomText
      },
      mocks: {
        $router: mockRoute
      }
    });
  });

  it('should render correct domainName props', () => {
    const domainName = 'domainName';
    wrapper.setProps({ domainName });
    expect(
      wrapper.vm.$el
        .querySelector('.finalize-container h3')
        .textContent.trim()
        .indexOf(domainName)
    ).toBeGreaterThan(-1);
  });

  describe('FinalizeContainer.vue Methods', () => {
    it('should render correct finalize props', () => {
      const finalize = sinon.stub();
      wrapper.setProps({ finalize });
      wrapper.find('.finalize-button').trigger('click');
      expect(finalize.called).toBe(true);
    });
  });
});
