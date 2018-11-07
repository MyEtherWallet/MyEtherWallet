import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon';
import InitialENSStateContainer from '@/dapps/RegisterDomain/containers/InitialENSStateContainer/InitialENSStateContainer.vue';
import {
  Tooling
} from '@@/helpers';

describe('InitialENSStateContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const checkDomain = sinon.stub();
    let domainName = 'domainName';
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
    });

    beforeEach(() => {
        wrapper = shallowMount(InitialENSStateContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { domainName,checkDomain }
        });
    });

    it('should render correct domain name', () => {
      expect(wrapper.vm.$el.querySelector('.domain-name input').value).toEqual(domainName);
    });

    it('should render correct input element classname according to domainname', () => {
      expect(wrapper.find('.domain-name input').classes().indexOf('errored')).toBe(-1);
      wrapper.setData({localDomainName:'domain'});
      expect(wrapper.find('.domain-name input').classes().indexOf('errored')).toBeGreaterThan(-1);
    });

    it('should render correct submit button element classname according to domainname', () => {
      expect(wrapper.find('.submit-button').classes().indexOf('disabled')).toBe(-1);
      wrapper.setData({localDomainName:'domain'});
      expect(wrapper.find('.submit-button').classes().indexOf('disabled')).toBeGreaterThan(-1);
    });

    it('should show/hide erroredMsg p element according to domain name', () => {
      expect(wrapper.find('.erroredMsg').isVisible()).toBe(false);
      wrapper.setData({localDomainName:'domain'});
      expect(wrapper.find('.erroredMsg').isVisible()).toBe(true);
    });

    it('should show/hide contract loading warning according to contractInitiated flag', () => {
      expect(wrapper.find('.contract-loading-warning').isVisible()).toBe(true);
      wrapper.setData({contractInitiated: true});
      expect(wrapper.find('.contract-loading-warning').isVisible()).toBe(false);
    })

     it('should show/hide spinner icon according to loading flag', () => {
      expect(wrapper.find('.fa-spinner').isVisible()).toBe(false);
      wrapper.setData({loading: true});
      expect(wrapper.find('.fa-spinner').isVisible()).toBe(true);
    })

    describe('InitialENSStateContainer.vue Methods', () => {
      it('should check domain when submit button clicked', () => {
        wrapper.find('.submit-button').trigger('click');
        expect(checkDomain.called).toBe(true);
      });

      it('should expand domain check form when checkbox clicked', () => {
        // wrapper.find('.switch input').trigger('click');
        // console.log(wrapper.vm.$refs);
        // console.log(wrapper.find('.domain-check-form').classes());
      });
    });
});
