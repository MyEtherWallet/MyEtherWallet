import Vue from 'vue';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import ClaimDNSContainer from '@/dapps/ManageENS/containers/ClaimDNSContainer/ClaimDNSContainer.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { Tooling } from '@@/helpers';
const showModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};

const push = sinon.stub();
const mockRouter = {
  push: push
};

describe('ClaimDNSContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const labelHash = 'labelHash';
  const nameHash = 'nameHash';
  const owner = 'owner';
  const deedOwner = 'deedOwner';
  const resolverAddress = 'resolverAddress';
  const hostName = 'hostName';
  const tld = 'tld';
  const claimFunc = sinon.stub();
  const dnsOwner = 'dnsOwner';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(ClaimDNSContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        labelHash,
        nameHash,
        owner,
        deedOwner,
        resolverAddress,
        hostName,
        tld,

        claimFunc,
        dnsOwner
      },
      stubs: {
        'b-modal': BModalStub,
        'interface-bottom-text': InterfaceBottomText
      },
      mocks: {
        $router: mockRouter
      }
    });
  });

  it('should render correct dnsOwner props data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.claim-dns-content p')[1]
        .textContent.trim()
        .indexOf(dnsOwner)
    ).toBeGreaterThan(-1);
  });

  it('should render correct claimFunc props func', () => {
    wrapper.find('.large-round-button-green-filled').trigger('click');
    expect(claimFunc.called).toBe(true);
  });

  it('should render correct loading props data', () => {
    expect(
      wrapper.find('.large-round-button-green-filled span').isVisible()
    ).toBe(true);
  });

  it('should render correct fullDomainName computed data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.claim-dns-content p')[0]
        .textContent.trim()
        .indexOf(wrapper.vm.fullDomainName)
    ).toBeGreaterThan(-1);
  });
});
