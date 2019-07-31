import MobileNetworkBlock from '@/containers/HeaderContainer/components/MobileMenu/components/MobileNetworkBlock/MobileNetworkBlock.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal';
import sinon from 'sinon';

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

describe('MobileNetworkBlock.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(MobileNetworkBlock, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-network-modal': InterfaceNetworkModal,
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct parsedNetwork data', () => {
    expect(wrapper.find('.fa-spinner').isVisible()).toBe(false);
    wrapper.setData({ parsedNetwork: '' });
    expect(wrapper.find('.fa-spinner').isVisible()).toBe(true);
  });

  it('should render correct network computed data', () => {
    expect(wrapper.find('.bottom-block .network').exists()).toBe(true);
    const network = wrapper.vm.network;
    expect(
      wrapper.vm.$el.querySelector('.bottom-block .network').textContent.trim()
    ).toEqual(network.service + '(' + network.type.name + ')');
  });

  it('should render correct blockNumber props data', () => {
    wrapper.setProps({ blockNumber: 100 });
    expect(wrapper.vm.$data.parsedNetwork).toBe(wrapper.props().blockNumber);
  });

  describe('MobileMenuButton.vue Methods', () => {
    it('should open network modal when button clicked', () => {
      wrapper.vm.networkModalOpen();
      expect(showModal.called).toBe(true);
    });
  });
});
