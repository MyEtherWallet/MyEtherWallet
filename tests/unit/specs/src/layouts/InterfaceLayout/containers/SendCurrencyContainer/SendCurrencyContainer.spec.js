import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils'
import SendCurrencyContainer from '@/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
// import GenerateInfo from '@/layouts/InterfaceLayout/components/GenerateInfo/GenerateInfo.vue';
// import GenerateTx from '@/layouts/InterfaceLayout/components/GenerateTx/GenerateTx.vue';
// import SendTx from '@/layouts/InterfaceLayout/components/SendTx/SendTx.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';

import {
  Tooling
} from '@@/helpers';


describe('SendCurrencyContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
        Vue.config.errorHandler = ()=>{};
    });

    afterAll(() => setTimeout(() => process.exit(), 1000))

    beforeEach(() => {
        let actions = {
          setGasPrice: jest.fn()
        };



        const network = nodeList['ETH'][3];
        const hostUrl = url.parse(network.url);

        const newWeb3 = new Web3(
          `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
            hostUrl.pathname
          }`
        );

          const wallet = {
              getChecksumAddressString: jest.fn(x=> 0),
              getAddressString: function(){
                return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
              }
        };


        let getters = {
          gasPrice : ()=>{},
          wallet: () => {
            return wallet;
          },
          web3: ()=> {
            return newWeb3
          },
          account: () => {
              return  {balance: {
                  result:''
                }
              }
            }
          };

        store = new VueX.Store({
          getters,
          actions,
          state: {
            web3: newWeb3,
            network:network,
            wallet: {
              getAddressString: ()=> { return '0x72ea3508d9d817a91465abb59be10fef9857a055'; }
            }
          }
        });

        wrapper = shallowMount(SendCurrencyContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            // 'send-tx':SendTx,
            // 'generate-tx':GenerateTx,
            // 'generate-info':GenerateInfo,
            'interface-container-title':InterfaceContainerTitle,
            'popover':PopOver,
            'currency-picker':CurrencyPicker
          }
        });
    });

    xit('[FAILING MAX STACK] should render correct advancedExpend data', () => {
      wrapper.setData({ advancedExpend:true });
      expect(wrapper.find('.input-container').exists()).toBe(true);
      wrapper.setData({ advancedExpend:false });
      expect(wrapper.find('.input-container').exists()).toBe(false);
    });

    xit('[FAILING MAX STACK] should render correct address data' , () => {
      // FAILING
      // const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      // wrapper.setData({address});
      // expect(wrapper.vm.$el.querySelector('.address-block textarea').value).toEqual(address);
    });

    xit('[FAILING MAX STACK] should render correct validAddress data' , () => {
       const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      wrapper.setData({address});
      expect(wrapper.vm.$data.validAddress).toBe(true);
    });


    xit('[FAILING MAX STACK] should render correct amount data', () => {
      const amount = 100;
      wrapper.setData({amount})
      expect(wrapper.vm.$el.querySelector('.amount-number input').value).toEqual(String(amount));
    });

    xit('[FAILING MAX STACK] should render correct "data" data', () => {
      const data = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      wrapper.setData({advancedExpend: true, data:data});
      expect(wrapper.vm.$el.querySelector('.user-input input').value).toEqual(data);
    });

    xit('[FAILING MAX STACK] should render correct gasAmount data', () => {
      const gasAmount = 231122;
      wrapper.setData({advancedExpend: true, gasAmount:gasAmount});
      expect(wrapper.vm.$el.querySelector('.gas-amount input').value).toEqual(String(gasAmount));
    });

    xit('[FAILING MAX STACK] should render correct transactionFee data', () => {
      const transactionFee = 100;
      wrapper.setData({transactionFee});
      expect(wrapper.findAll('.title-container .title p').at(1).text()).toEqual('Transaction Fee: ' + wrapper.vm.transactionFee+ ' ETH');
    });

    xit('[FAILING MAX STACK] should render correct gasLimit data', () => {
      const gasLimit = 30000;
      wrapper.setData({ gasLimit});
      wrapper.setData({advancedExpend: true});
      expect(wrapper.vm.$el.querySelectorAll('.user-input input')[1].value).toEqual(String(gasLimit));
    });

    describe('SendCurrencyContainer.vue Methods', () => {
      xit('[FAILING MAX STACK] should render correct verifyAddr method', () => {
        const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
        wrapper.setData({address});
        expect(wrapper.vm.verifyAddr()).toBe(false);
      });

      xit('[FAILING MAX STACK] should render correct selectedCurrency data', () => {
        const currencyElements =  wrapper.findAll('.currency-picker-container .item-container div');
        for(var i=0; i<currencyElements.length; i++) {
          const currencyElement = currencyElements.at(i);
          currencyElement.trigger('click');
          const selectedCurrency = wrapper.vm.$data.selectedCurrency;
          expect(selectedCurrency.symbol + ' - ' + selectedCurrency.name).toEqual(currencyElement.find('p').text());
        }
      });

      xit('[FAILING MAX STACK] should open confirm modal when button click', () => {
        window.pageXOffset = 100;
        window.pageYOffset = 100;
        wrapper.find('.submit-button-container .submit-button').trigger('click');
        expect(window.pageXOffset).toBe(0);
        expect(window.pageYOffset).toBe(0);
      });

    });
});
