import { shallowMount } from '@vue/test-utils';
import FinishModal from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/FinishModal/FinishModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to']
};

const unlock = sinon.stub();

const BBtnStub = {
  name: 'b-btn',
  template: `<button></button>`
};

describe('FinishModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(FinishModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        unlock
      },
      stubs: {
        'b-btn': BBtnStub,
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct contents', () => {
    wrapper.find('.close-button').trigger('click');
    expect(wrapper.find('.close-button').html()).toEqual(
      '<button class="mid-round-button-green-filled close-button"></button>'
    );
  });
});
