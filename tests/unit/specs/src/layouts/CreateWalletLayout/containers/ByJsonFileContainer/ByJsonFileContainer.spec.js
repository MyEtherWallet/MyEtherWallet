import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import ByJsonFileContainer from '@/layouts/CreateWalletLayout/containers/ByJsonFileContainer/ByJsonFileContainer.vue';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import ByJsonBlock from '@/layouts/CreateWalletLayout/components/ByJsonBlock/ByJsonBlock.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

const showModal = sinon.stub();
const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal,
    hide: hideModal
  }
};

describe('ByJsonFileContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = new VueX.Store({
      modules: {
        main: {
          namespaced: true,
          state,
          getters
        }
      }
    });

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(ByJsonFileContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'router-link': RouterLinkStub,
        'by-json-block': ByJsonBlock,
        'success-modal': SuccessModal,
        'b-modal': BModalStub
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  xit('should render correct contents data', () => {
    const contentElements = wrapper.vm.$el.querySelectorAll(
      '.contents .content-block'
    );
    for (const [i, contentElement] of contentElements.entries()) {
      expect(contentElement.querySelector('h6').textContent.trim()).toEqual(
        wrapper.vm.$data.contents[i].title
      );
      expect(contentElement.querySelector('p').textContent.trim()).toEqual(
        wrapper.vm.$data.contents[i].desc
      );
    }
  });

  it('should render correct downloadable data', () => {
    wrapper.setData({ downloadable: true });
    expect(wrapper.find('.user-input-container span').exists()).toBe(true);
    wrapper.setData({ downloadable: false });
    expect(wrapper.find('.user-input-container span').exists()).toBe(false);
  });

  it('should render correct walletJson data', () => {
    const walletJson = 'walletJson';
    wrapper.setData({ walletJson });
    expect(
      wrapper.vm.$el.querySelector('.user-button a').getAttribute('href')
    ).toEqual(walletJson);
  });

  it('should render correct name data', () => {
    const name = 'name';
    wrapper.setData({ name });
    expect(
      wrapper.vm.$el.querySelector('.user-button a').getAttribute('download')
    ).toEqual(name);
  });

  describe('ByJsonFileContainer.vue Methods', () => {
    it('should render correct downloadDone method', () => {
      wrapper.find('.user-button a').trigger('click');
      expect(showModal.called).toBe(true);
    });
  });
});
