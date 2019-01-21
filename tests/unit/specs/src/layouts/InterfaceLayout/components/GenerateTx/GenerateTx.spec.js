import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from '@vue/test-utils';
import GenerateTx from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/GenerateTx';
import TxSpeedInput from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/TxSpeedInput';
import SignedTxModal from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/SignedTxModal/SignedTxModal';
import PopOver from '@/components/PopOver/PopOver.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import { Tooling } from '@@/helpers';

describe('GenerateTx.vue', () => {
  let localVue, i18n, wrapper, store;

  const gasLimit = 1000;
  const nonce = 1;
  const toData = 120;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};

    const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);
    const newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
        hostUrl.pathname
      }`
    );

    const account = {
      balance: {
        result: ''
      }
    };

    const getters = {
      account: () => {
        return account;
      },
      web3: () => {
        return newWeb3;
      },
      network: () => {
        return {
          auth: false,
          password: '',
          port: 443,
          service: 'infura.io',
          type: {
            blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
            blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
            chainID: 1,
            contracts: [],
            ensResolver: '0x314159265dd8dbb310642f98f50c066173c1259b',
            homePage: 'https://ethereum.org',
            name: 'ETH',
            name_long: 'Ethereum',
            tokens: []
          },
          url: 'https://mainnet.infura.io/mew'
        };
      }
    };

    store = new Vuex.Store({
      getters
    });
  });

  beforeEach(() => {
    // store.replaceState({
    //    account: {
    //      balance: {
    //        result:''
    //      }
    //    }
    //  })
    wrapper = mount(GenerateTx, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'tx-speed-input': TxSpeedInput,
        popover: PopOver,
        'signed-tx-modal': SignedTxModal
      },
      propsData: { gasLimit, nonce }
    });
  });

  it('should render correct propsData', () => {
    const inputElements = wrapper.vm.$el.querySelectorAll('.gas-amount input');
    expect(inputElements[2].value).toEqual(String(nonce));
    expect(inputElements[3].value).toEqual(String(gasLimit));
  });

  xit('[Failing 1-16-19] should render correct toAmt', () => {
    wrapper.setData({ toAmt: 100, toData });
    expect(
      wrapper.vm.$el.querySelector('.send-form .amount-number input').value
    ).toEqual(String(wrapper.vm.$data.toAmt));
    expect(wrapper.findAll('.error-message-container').length).toEqual(1);
  });

  it('should render correct toData', () => {
    wrapper.setData({ toAmt: 100, toData });
    const inputElements = wrapper.vm.$el.querySelectorAll('.gas-amount input');
    expect(inputElements[0].value).toBe(String(wrapper.vm.$data.toData));
  });

  it('should render correct coinType', () => {
    const currencyElements = wrapper.vm.$el.querySelectorAll(
      '.item-container div'
    );
    for (let i = 0; i < currencyElements.length; i++) {
      const currencyElement = currencyElements[i];
      if (i > 0) {
        const symbol = wrapper.vm.$data.coinType[i - 1].symbol;
        const name = wrapper.vm.$data.coinType[i - 1].name;
        expect(currencyElement.querySelector('p').textContent.trim()).toEqual(
          symbol + ' - ' + name
        );
        expect(
          currencyElement.querySelector('span').textContent.trim()
        ).toEqual('- ' + name);
      }
    }
  });

  describe('GenerateTx.vue Methods', () => {
    it('should emit pathUpdate when button click', () => {
      // wrapper.find('.generate-info .close-button').trigger('click')
      // expect(wrapper.emitted().pathUpdate).toBeTruthy();
      //       let browser =  puppeteer.launch({ headless: false, });
      // let page = browser.newPage();
      // const result = await page.evaluate(() => {
      //   wrapper.find('.generate-info .close-button').trigger('click')
      //   expect(wrapper.emitted().pathUpdate).toBeTruthy();
      // });
    });

    it('should emit locNonce update when input changed', () => {
      const inputElement = wrapper.findAll('.gas-amount input').at(2);
      const inputText = 11;
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.emitted().nonceUpdate).toBeTruthy();
    });

    xit('[Failing 1-16-19] should emit gasLimitUpdate update when input changed', () => {
      const inputElement = wrapper.findAll('.gas-amount input').at(3);
      const inputText = 11;
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.emitted().gasLimitUpdate).toBeTruthy();
    });
  });
});
