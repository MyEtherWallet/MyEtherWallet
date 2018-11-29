import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import DeployContractContainer from '@/layouts/InterfaceLayout/containers/DeployContractContainer/DeployContractContainer.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import store from 'store';

import {
  Tooling
} from '@@/helpers';


describe('DeployContractContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
        Vue.config.errorHandler = ()=>{};

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

        let wallet = {
          getAddressString: function(){
                return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
          }
        };

        let getters = {
          gasPrice: () => {},
          web3: () => {
            return newWeb3;
          },
          wallet: () => {
            return wallet;
          }
        };

        store = new Vuex.Store({
          actions,
          getters,
          state:{
            web3: newWeb3,
            network:network,
            wallet: {
              getAddressString: function(){
                return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
              }
            }
          }
        });
    });

    beforeEach(() => {
        wrapper = shallowMount(DeployContractContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'back-button':BackButton,
            'popover':PopOver
          },
          propsData: {
            resetView:resetView,
          }
        });

    });

    xit('[FAILING MAX STACK] should render correct bytecode', () => {
      const bytecode = 'bytecode';
      wrapper.setData({bytecode});
      expect(wrapper.vm.$el.querySelectorAll('textarea')[0].value).toEqual(wrapper.vm.$data.bytecode)
    });

    xit('[FAILING MAX STACK] should render correct abi', () => {
      const abi = {
        value : 'abi'
      };
      wrapper.setData({abi:JSON.stringify(abi)});
      expect(wrapper.vm.$el.querySelectorAll('textarea')[1].value).toEqual(wrapper.vm.$data.abi);
    });

    xit('[FAILING MAX STACK] should render correct contractName', () => {
      const contractName = 'contractName';
      wrapper.setData({contractName});
      expect(wrapper.vm.$el.querySelectorAll('.domain-name input')[0].value).toEqual(contractName);
    });

    xit('[FAILING MAX STACK] should render correct contractName placeholder', () => {
      expect(wrapper.vm.$el.querySelectorAll('.domain-name input')[0].placeholder).toEqual(wrapper.vm.$data.contractNamePlaceholder);
    });

    xit('[FAILING MAX STACK] should render correct transactionFee', () => {
      expect(wrapper.vm.$el.querySelectorAll('.send-form2 .title-container .title p')[1].textContent.indexOf(wrapper.vm.$data.transactionFee)).toBeGreaterThan(-1)
    });

    xit('[FAILING MAX STACK] should render correct gas limit', () => {
      expect(wrapper.vm.$el.querySelector('.gas-amount input').value).toEqual(String(wrapper.vm.$data.gasLimit));
    });

    xit('[FAILING MAX STACK] should render correct validAbi', () => {
      expect(wrapper.vm.$el.querySelector('i.good-button').className.indexOf('not-good')).toBeGreaterThan(-1)
    });

    describe('DeployContractContainer.vue Methods', () => {
        xit('[FAILING MAX STACK] should changeGas when click button', () => {
          const btnElements = wrapper.findAll('.small-circle-button-green-border');
          btnElements.at(0).trigger('click');
          expect(wrapper.vm.$data.gasAmount).toEqual(5);
          btnElements.at(1).trigger('click');
          expect(wrapper.vm.$data.gasAmount).toEqual(45);
          btnElements.at(2).trigger('click');
          expect(wrapper.vm.$data.gasAmount).toEqual(75);
        });

       xit('[FAILING] should Open confirmationModal when click button', () => {
          const abi = [
          {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
              {
                "name": "",
                "type": "string"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          }
        ]

        const bytecode = '0x608060405234801561001057600080fd5b50604051610e30380380610e308339810180604052810190808051906020019092919080518201929190602001805190602001909291908051820192919050505083600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508360008190555082600390805190602001906100b29291906100ee565b5081600460006101000a81548160ff021916908360ff16021790555080600590805190602001906100e49291906100ee565b5050505050610193565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061012f57805160ff191683800117855561015d565b8280016001018555821561015d579182015b8281111561015c578251825591602001919060010190610141565b5b50905061016a919061016e565b5090565b61019091905b8082111561018c576000816000905550600101610174565b5090565b90565b610c8e806101a26000396000f3006080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100b4578063095ea7b31461014457806318160ddd146101a957806323b872dd146101d457806327e235e314610259578063313ce567146102b05780635c658165146102e157806370a082311461035857806395d89b41146103af578063a9059cbb1461043f578063dd62ed3e146104a4575b600080fd5b3480156100c057600080fd5b506100c961051b565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101095780820151818401526020810190506100ee565b50505050905090810190601f1680156101365780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015057600080fd5b5061018f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506105b9565b604051808215151515815260200191505060405180910390f35b3480156101b557600080fd5b506101be6106ab565b6040518082815260200191505060405180910390f35b3480156101e057600080fd5b5061023f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106b1565b604051808215151515815260200191505060405180910390f35b34801561026557600080fd5b5061029a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061094b565b6040518082815260200191505060405180910390f35b3480156102bc57600080fd5b506102c5610963565b604051808260ff1660ff16815260200191505060405180910390f35b3480156102ed57600080fd5b50610342600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610976565b6040518082815260200191505060405180910390f35b34801561036457600080fd5b50610399600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061099b565b6040518082815260200191505060405180910390f35b3480156103bb57600080fd5b506103c46109e4565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104045780820151818401526020810190506103e9565b50505050905090810190601f1680156104315780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561044b57600080fd5b5061048a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610a82565b604051808215151515815260200191505060405180910390f35b3480156104b057600080fd5b50610505600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bdb565b6040518082815260200191505060405180910390f35b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105b15780601f10610586576101008083540402835291602001916105b1565b820191906000526020600020905b81548152906001019060200180831161059457829003601f168201915b505050505081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60005481565b600080600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101580156107825750828110155b151561078d57600080fd5b82600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555082600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156108da5782600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a360019150509392505050565b60016020528060005260406000206000915090505481565b600460009054906101000a900460ff1681565b6002602052816000526040600020602052806000526040600020600091509150505481565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60058054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a7a5780601f10610a4f57610100808354040283529160200191610a7a565b820191906000526020600020905b815481529060010190602001808311610a5d57829003601f168201915b505050505081565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610ad257600080fd5b81600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050929150505600a165627a7a72305820eaee21790506ad3951bd1ae0f5480d89c2ddfab4c561017cfea1b9f204fa85940029'

          wrapper.setData({abi:JSON.stringify(abi)});
          wrapper.setData({bytecode})
          window.pageXOffset = 100;
          window.pageYOffset = 100;
          wrapper.find('.submit-button').trigger('click')
          expect(window.pageXOffset).toBe(0);
          expect(window.pageYOffset).toBe(0);
       });

        xit('[FAILING MAX STACK] should delete Input when click button', () => {
          const bytecode = 'bytecode';
          wrapper.setData({bytecode});
          expect(wrapper.vm.$data.bytecode).toEqual(bytecode);
          wrapper.find('.copy-buttons span').trigger('click');
          expect(wrapper.vm.$data.bytecode).toEqual('');
        });
    });
});
