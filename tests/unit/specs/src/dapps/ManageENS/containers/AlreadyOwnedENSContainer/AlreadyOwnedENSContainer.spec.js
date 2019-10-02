import Vue from 'vue';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import AlreadyOwnedENSContainer from '@/dapps/ManageENS/containers/AlreadyOwnedENSContainer/AlreadyOwnedENSContainer.vue';
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

describe('AlreadyOwnedENSContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const labelHash = 'labelHash';
  const nameHash = 'nameHash';
  const owner = 'owner';
  const deedOwner = 'deedOwner';
  const resolverAddress = 'resolverAddress';
  const hostName = 'hostName';
  const tld = 'tld';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(AlreadyOwnedENSContainer, {
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
        tld
      },
      stubs: {
        'b-modal': BModalStub
      },
      mocks: {
        $router: mockRouter
      }
    });
  });

  xit('should render correct fullDomainName computed data', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.already-owned-container h3')[1]
        .textContent.trim()
        .indexOf(wrapper.vm.fullDomainName)
    ).toBeGreaterThan(-1);
  });

  it('should render correct labelHash props', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.content-container .content')[0]
        .textContent.trim()
    ).toEqual(labelHash);
  });

  it('should render correct nameHash props', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.content-container .content')[1]
        .textContent.trim()
    ).toEqual(nameHash);
  });

  it('should render correct owner props', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.content-container .content')[2]
        .textContent.trim()
    ).toEqual(owner);
  });

  it('should render correct deedOwner props', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.content-container .content')[3]
        .textContent.trim()
    ).toEqual(resolverAddress);
  });

  xit('should render correct resolverAddress props', () => {
    expect(
      wrapper.vm.$el
        .querySelectorAll('.content-container .content')[4]
        .textContent.trim()
    ).toEqual(resolverAddress);
  });
});
