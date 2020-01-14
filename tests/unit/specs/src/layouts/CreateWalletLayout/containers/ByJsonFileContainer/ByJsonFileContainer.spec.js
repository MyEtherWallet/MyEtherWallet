import Vue from 'vue';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import ByJsonFileContainer from '@/layouts/CreateWalletLayout/containers/ByJsonFileContainer/ByJsonFileContainer.vue';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import ByJsonBlock from '@/layouts/CreateWalletLayout/components/ByJsonBlock/ByJsonBlock.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
import * as createWallet from '@/translations/create-wallet/en_US.json';

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
const newObj = Object.assign({}, { createWallet: createWallet });

const translator = function(keyname) {
  return keyname.split('.').reduce((o, i) => o[i], newObj);
};

describe('ByJsonFileContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

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

  afterAll(() => {
    wrapper.destroy();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct contents data', () => {
    const contentElements = wrapper.findAll('.contents .content-block');

    contentElements.wrappers.forEach((contentElement, i) => {
      const header = contentElement.find('h6').text();
      const pTag = contentElement.find('p').text();
      if (header && pTag) {
        expect(header).toEqual(translator(wrapper.vm.$data.contents[i].title));
        expect(pTag).toEqual(translator(wrapper.vm.$data.contents[i].desc));
      }
    });
  });

  it('should render correct downloadable data', async () => {
    wrapper.setData({ downloadable: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.user-input-container span').exists()).toBe(true);
    wrapper.setData({ downloadable: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.user-input-container span').exists()).toBe(false);
  });

  it('should render correct walletJson data', async () => {
    const walletJson = 'walletJson';
    wrapper.setData({ walletJson });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.$el.querySelector('.user-button a').getAttribute('href')
    ).toEqual(walletJson);
  });

  it('should render correct name data', async () => {
    const name = 'name';
    wrapper.setData({ name });
    await wrapper.vm.$nextTick();
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

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
