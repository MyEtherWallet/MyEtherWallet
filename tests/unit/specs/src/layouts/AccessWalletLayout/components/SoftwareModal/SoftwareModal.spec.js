import { shallowMount, mount } from '@vue/test-utils';
import SoftwareModal from '@/layouts/AccessWalletLayout/components/SoftwareModal/SoftwareModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';
import Vue from 'vue';

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to']
};

const BBtnStub = {
  name: 'b-btn',
  template: '<div><slot></slot></div>',
  props: ['to']
};

jest.mock('platform');

describe('SoftwareModal.vue', () => {
  const openMnemonicPhraseInput = sinon.stub();
  const openPrivateKeyInput = sinon.stub();
  describe('SoftwareModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;
      Vue.config.warnHandler = () => {};
    });

    beforeEach(() => {
      wrapper = shallowMount(SoftwareModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        stubs: {
          'router-link': RouterLinkStub,
          'b-btn': BBtnStub,
          'b-modal': BModalStub
        }
      });
    });

    xit('should render correct contents', () => {
      const liElements = wrapper.findAll('li');
      let liElement = liElements.at(0);
      liElement.trigger('click');
      expect(wrapper.vm.$data.selected).toBe('byJson');
      liElement = liElements.at(1);
      liElement.trigger('click');
      expect(wrapper.vm.$data.selected).toBe('byMnem');
      liElement = liElements.at(2);
      liElement.trigger('click');
      expect(wrapper.vm.$data.selected).toBe('byPriv');
    });
  });

  describe('SoftwareModal.vue Methods', () => {
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
      wrapper = mount(SoftwareModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        propsData: {
          openMnemonicPhraseInput: openMnemonicPhraseInput,
          openPrivateKeyInput: openPrivateKeyInput
        },
        stubs: {
          'router-link': RouterLinkStub
        },
        mocks: {
          $router: mockRouter
        }
      });
    });

    it('should trigger openMnemonicPhraseInput method when continueAccess button is clicked', () => {
      wrapper.setData({ selected: 'byMnem' });
      wrapper.vm.continueAccess();
      expect(openMnemonicPhraseInput.called).toBe(true);
    });

    it('should trigger openPrivateKeyInput method when continueAccess button is clicked', () => {
      wrapper.setData({ selected: 'byPriv' });
      wrapper.vm.continueAccess();
      expect(openPrivateKeyInput.called).toBe(true);
    });
  });
});
