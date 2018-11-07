import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import AlreadyOwnedENSContainer from '@/dapps/RegisterDomain/containers/AlreadyOwnedENSContainer/AlreadyOwnedENSContainer.vue';
import {
  Tooling
} from '@@/helpers';


describe('AlreadyOwnedENSContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const labelHash = 'labelHash';
    const nameHash = 'nameHash';
    const owner = 'owner';
    const deedOwner = 'deedOwner';
    const resolverAddress = 'resolverAddress';
    const domainName = 'domainName';

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(AlreadyOwnedENSContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { labelHash, nameHash, owner, deedOwner, resolverAddress,  domainName}
        });
    });

    it('should render correct domain name props', () => {
      expect(wrapper.vm.$el.querySelector('.already-owned-container h3').textContent.trim()).toEqual(domainName + '.eth is already owned.');
    });

    it('should render correct labelHash props', () => {
      expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[0].textContent.trim()).toEqual(labelHash);
    });

    it('should render correct nameHash props', () => {
      expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[1].textContent.trim()).toEqual(nameHash);
    });

    it('should render correct owner props', () => {
      expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[2].textContent.trim()).toEqual(owner);
    });

    it('should render correct deedOwner props', () => {
      expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[3].textContent.trim()).toEqual(deedOwner);
    });

    it('should render correct resolverAddress props', () => {
      expect(wrapper.vm.$el.querySelectorAll('.content-container .content')[4].textContent.trim()).toEqual(resolverAddress);
    });

    it('should render correct receivedProps', () => {
      expect(wrapper.vm.$data.receivedProps[0].data).toEqual(labelHash);
      expect(wrapper.vm.$data.receivedProps[1].data).toEqual(nameHash);
      expect(wrapper.vm.$data.receivedProps[2].data).toEqual(owner);
      expect(wrapper.vm.$data.receivedProps[3].data).toEqual(deedOwner);
      expect(wrapper.vm.$data.receivedProps[4].data).toEqual(resolverAddress);
    });
});
