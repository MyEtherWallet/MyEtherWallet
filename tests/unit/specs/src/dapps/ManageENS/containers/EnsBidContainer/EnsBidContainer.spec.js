import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import EnsBidContainer from '@/dapps/ManageENS/containers/EnsBidContainer/EnsBidContainer.vue';
import JsonStringModal from '@/dapps/ManageENS/components/JsonStringModal/JsonStringModal.vue';
import sinon from 'sinon';
import { Misc } from '@/helpers';
import { Tooling } from '@@/helpers';

const TimerStub = {
  name: 'timer',
  template: '<p class="timer">{{dateNumber}}</p>',
  props: ['dateNumber']
};

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

describe('EnsBidContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const checkDomain = sinon.stub();
  const generateKeyPhrase = sinon.stub();
  const startAuctionAndBid = sinon.stub();
  const revealBid = sinon.stub();
  const sendBid = sinon.stub();

  const domainName = 'domainName';
  const mockRoute = {
    fullPath: 'auction'
  };
  const mockRouter = {
    replace: sinon.stub(),
    history: {
      current: {
        path: '/interface/dapps/register-domain'
      }
    }
  };
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(EnsBidContainer, {
      localVue,
      i18n,
      store,
      propsData: {
        domainName,
        checkDomain,
        generateKeyPhrase,
        startAuctionAndBid
      },
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      },
      stubs: {
        timer: TimerStub,
        'b-modal': BModalStub,
        'json-string-modal': JsonStringModal
      }
    });
  });

  it('should render correct bidAmount props', () => {
    const bidAmountElement = wrapper.vm.$el
      .querySelectorAll('.inputs-container .input-container')[0]
      .querySelector('input');
    expect(bidAmountElement.value.trim()).toEqual(
      String(wrapper.props().bidAmount)
    );
  });

  it('should render correct bidMask props', () => {
    const bidMaskElement = wrapper.vm.$el
      .querySelectorAll('.inputs-container .input-container')[1]
      .querySelector('input');
    expect(bidMaskElement.value.trim()).toEqual(
      String(wrapper.props().bidMask)
    );
  });

  it('should render correct secretPhrase props', () => {
    const secretPhraseElement = wrapper.vm.$el
      .querySelectorAll('.inputs-container .input-container')[2]
      .querySelector('input');
    expect(secretPhraseElement.value.trim()).toEqual(
      String(wrapper.props().secretPhrase)
    );
  });

  it('should render correct domain name props', () => {
    const domainNameElement = wrapper.vm.$el.querySelector(
      '.content-header h3'
    );
    expect(domainNameElement.textContent.trim()).toEqual(domainName);
  });

  it('should call startAuctionAndBid props func when button clicked', () => {
    wrapper
      .findAll('.buttons-container .submit-button')
      .at(0)
      .trigger('click');
    expect(startAuctionAndBid.called).toBe(true);
  });

  it('should call revealBid props func when button clicked', () => {
    mockRoute.fullPath = 'none';
    wrapper = shallowMount(EnsBidContainer, {
      localVue,
      i18n,
      store,
      propsData: { revealBid },
      mocks: {
        $route: mockRoute,
        $router: {
          replace: sinon.stub(),
          history: {
            current: {
              path: '/interface/dapps/register-domain'
            }
          }
        }
      }
    });
    wrapper
      .findAll('.submit-button')
      .at(0)
      .trigger('click');
    expect(revealBid.called).toBe(true);
  });

  it('should call sendBid props func when button clicked', () => {
    mockRoute.fullPath = 'bid';
    wrapper = shallowMount(EnsBidContainer, {
      localVue,
      i18n,
      store,
      propsData: { sendBid },
      mocks: {
        $route: mockRoute,
        $router: {
          replace: sinon.stub(),
          history: {
            current: {
              path: '/interface/dapps/register-domain'
            }
          }
        }
      }
    });
    wrapper
      .findAll('.submit-button')
      .at(0)
      .trigger('click');
    expect(sendBid.called).toBe(true);
  });

  it('should render correct auctionDateEnd props', () => {
    expect(wrapper.vm.$el.querySelector('.timer').textContent.trim()).toEqual(
      String(wrapper.props().auctionDateEnd)
    );
  });

  it('should render correct highestBidder props', () => {
    mockRoute.fullPath = 'revealBid';
    wrapper = shallowMount(EnsBidContainer, {
      localVue,
      i18n,
      store,
      mocks: {
        $route: mockRoute,
        $router: {
          replace: sinon.stub(),
          history: {
            current: {
              path: '/interface/dapps/register-domain'
            }
          }
        }
      }
    });
    const highestBidder = 'highestBidder';
    wrapper.setProps({ highestBidder });
    const auctionStartedString = wrapper.vm.$el
      .querySelector('.auction-started h3')
      .textContent.trim();
    expect(auctionStartedString.indexOf(highestBidder)).toBeGreaterThan(-1);
  });

  it('should render correct raw props', () => {
    const raw = {
      bidAmount: '0.2',
      bidMask: '0.1',
      secretPhrase: 'secretPhrase',
      revealDate: Date.now(),
      auctionDateEnd: Date.now()
    };
    wrapper.setProps({ raw });
    expect(
      wrapper.vm.$el.querySelectorAll('.detail-value')[0].textContent
    ).toEqual(raw.bidAmount + ' ');
    expect(
      wrapper.vm.$el.querySelectorAll('.detail-value')[1].textContent
    ).toEqual(raw.secretPhrase);
    expect(
      wrapper.vm.$el.querySelectorAll('.detail-value')[2].textContent
    ).toEqual(Misc.formatDate(raw.revealDate));
    expect(
      wrapper.vm.$el.querySelectorAll('.detail-value')[3].textContent
    ).toEqual(raw.bidMask + ' ');
    expect(
      wrapper.vm.$el.querySelectorAll('.detail-value')[4].textContent
    ).toEqual(Misc.formatDate(raw.auctionDateEnd));
  });

  it('should render correct jsonText data', () => {
    const raw = {
      bidAmount: '0.2',
      bidMask: '0.1',
      secretPhrase: 'secretPhrase',
      revealDate: Date.now(),
      auctionDateEnd: Date.now()
    };
    wrapper.setProps({ raw });
    expect(wrapper.vm.$el.querySelector('.json-content').value).toEqual(
      wrapper.vm.$data.jsonText
    );
  });

  it('should show/hide edit input according to showDetail data', () => {
    expect(wrapper.find('.edit').isVisible()).toBe(false);
    wrapper.setData({ showDetail: true });
    expect(wrapper.find('.edit').isVisible()).toBe(true);
  });

  it('should show/hide button according to showInfo data', () => {
    expect(wrapper.find('.buttons-container .submit-button').isVisible()).toBe(
      true
    );
    wrapper.setData({ showInfo: false });
    expect(wrapper.find('.buttons-container .submit-button').isVisible()).toBe(
      false
    );
  });

  it('should show/hide erroredMsg according to localBidAmount and localBidMask', () => {
    expect(wrapper.find('.erroredMsg').isVisible()).toBe(false);
    wrapper.setData({ localBidAmount: 0.1 });
    expect(wrapper.find('.erroredMsg').isVisible()).toBe(true);
  });

  describe('EnsBidContainer.vue Methods', () => {
    it('should update json when submit button clicked', () => {
      const raw = {
        bidAmount: 0.222,
        bidMask: 0.111,
        secretPhrase: 'secretPhrase',
        revealDate: Date.now(),
        auctionDateEnd: Date.now()
      };

      const textAreaElement = wrapper.find(
        '.json-string-form .input-container textarea'
      );
      textAreaElement.setValue(JSON.stringify(raw));
      textAreaElement.trigger('change');
      wrapper.find('.json-string-form .submit-button').trigger('click');
      expect(wrapper.vm.$data.localSecretPhrase).toEqual(raw.secretPhrase);
      expect(wrapper.vm.$data.localBidAmount).toEqual(raw.bidAmount);
      expect(wrapper.vm.$data.localBidMask).toEqual(raw.bidMask);
    });

    it('should edit input according when button clicked', () => {
      wrapper.setData({ localStep: 100 });
      wrapper.find('.edit').trigger('click');
      expect(wrapper.vm.$data.localStep).toBe(1);
    });

    it('should trigger openJsonModal method when button clicked', () => {
      mockRoute.fullPath = 'revealBid';
      wrapper = shallowMount(EnsBidContainer, {
        localVue,
        i18n,
        store,
        mocks: {
          $route: mockRoute,
          $router: {
            replace: sinon.stub(),
            history: {
              current: {
                path: '/interface/dapps/register-domain'
              }
            }
          }
        },
        stubs: {
          'b-modal': BModalStub,
          'json-string-modal': JsonStringModal
        }
      });
      wrapper.find('.json-string').trigger('click');
      expect(showModal.called).toBe(true);
    });
  });
});
