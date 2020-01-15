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
  const supportedCoins = {
    ETH: {
      id: 60,
      symbol: 'ETH',
      value: '0xabcdefg'
    },
    ETC: {
      id: 60,
      symbol: 'ETH',
      value: '0xabcdefg'
    }
  };
  const supportedText = {
    email: 'email123456',
    url: 'url123456',
    avatar: 'url123456',
    description: 'string123456',
    notice: 'string123456',
    keywords: 'string123456',
    'vnd.twitter': 'string123456',
    'vnd.github': 'strin123456g'
  };
  const resolverMultiCoinSupport = false;
  const hasAnyTxt = false;

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
        tld,
        resolverMultiCoinSupport,
        hasAnyTxt
      },
      stubs: {
        'b-modal': BModalStub
      },
      mocks: {
        $router: mockRouter
      },
      computed: {
        supportedCoinsWithValue() {
          return supportedCoins;
        },
        txtRecordsWithValue() {
          return supportedText;
        }
      }
    });
  });

  afterAll(() => {
    wrapper.destroy();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct fullDomainName computed data', () => {
    const container = wrapper.findAll('.already-owned-container h3');
    expect(
      container
        .at(0)
        .text()
        .trim()
    ).toContain(wrapper.vm.fullDomainName);
  });

  it('should render correct labelHash props', () => {
    const container = wrapper.findAll('.content-container .content');
    expect(
      container
        .at(0)
        .text()
        .trim()
    ).toEqual(labelHash);
  });

  it('should render correct nameHash props', () => {
    const container = wrapper.findAll('.content-container .content');
    expect(
      container
        .at(1)
        .text()
        .trim()
    ).toEqual(nameHash);
  });

  it('should render correct owner props', () => {
    const container = wrapper.findAll('.content-container .content');
    expect(
      container
        .at(2)
        .text()
        .trim()
    ).toEqual(owner);
  });

  it('should render multicoin section', () => {
    wrapper.setProps({
      resolverMultiCoinSupport: true
    });
    const container = wrapper.findAll('.content-container div');
    const items = Object.keys(supportedCoins);
    container.wrappers.forEach((item, idx) => {
      expect(item.find('.currency').text()).toContain(
        supportedCoins[items[idx]].symbol
      );
      expect(item.find('.content').text()).toEqual(
        supportedCoins[items[idx]].value
      );
    });
  });

  it('should render multicoin section', () => {
    wrapper.setProps({
      hasAnyTxt: true,
      resolverMultiCoinSupport: false
    });
    const container = wrapper.findAll('.content-container');
    const items = Object.keys(supportedText);
    container.wrappers.forEach((item, idx) => {
      expect(item.find('.currency').text()).toContain(items[idx]);
      expect(item.find('.content').text()).toEqual(supportedText[items[idx]]);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
