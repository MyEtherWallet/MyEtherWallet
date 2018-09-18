<template>
  <div
    v-if="$store.state.wallet !== null"
    class="send-eth-and-tokens">
    <div class="wrap">
      <div class="side-nav">
        <interface-side-menu
          :current-tab="currentTab"
          :switch-tabs="switchTabs"/>
      </div>
      <div class="contents">
        <div class="tx-contents">
          <div>
            <interface-address :address="address" />
          </div>
          <div>
            <interface-balance :balance="balance"/>
          </div>
          <div>
            <interface-network :block-number="blockNumber" />
          </div>
          <send-currency-container
            v-show="currentTab === 'send' || currentTab === ''"
            :tokens-with-balance="tokensWithBalance"
            :get-balance="getBalance"/>
          <send-offline-container v-show="currentTab === 'offline'"/>
          <swap-container v-show="currentTab === 'swap'"/>
          <dapps-container v-show="currentTab === 'dapps'"/>
          <interact-with-contract-container v-show="currentTab === 'interactC'"/>
          <sign-message-container v-show="currentTab === 'signMessage'"/>
          <verify-message-container v-show="currentTab === 'verifyMessage'"/>
          <deploy-contract-container v-show="currentTab === 'deployC'"/>
          <div
            v-if="$store.state.online"
            class="tokens">
            <interface-tokens
              :get-token-balance="getTokenBalance"
              :tokens="tokens"
              :received-tokens="receivedTokens"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <wallet-not-found-container/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { parseTokensHex } from '@/helpers';

import DappsContainer from './containers/DappsContainer';
import DeployContractContainer from './containers/DeployContractContainer';
import InteractWithContractContainer from './containers/InteractWithContractContainer';
import SendCurrencyContainer from './containers/SendCurrencyContainer';
import SendOfflineContainer from './containers/SendOfflineContainer';
import SwapContainer from './containers/SwapContainer';
import SignMessageContainer from './containers/SignMessageContainer';
import VerifyMessageContainer from './containers/VerifyMessageContainer';
import WalletNotFoundContainer from './containers/WalletNotFoundContainer';

import InterfaceAddress from './components/InterfaceAddress';
import InterfaceBalance from './components/InterfaceBalance';
import InterfaceNetwork from './components/InterfaceNetwork';
import InterfaceSideMenu from './components/InterfaceSideMenu';
import InterfaceTokens from './components/InterfaceTokens';
import { MetamaskWallet } from '@/wallets/software';
import * as networkTypes from '@/networks/types';

import store from 'store';

export default {
  components: {
    'send-currency-container': SendCurrencyContainer,
    'send-offline-container': SendOfflineContainer,
    'swap-container': SwapContainer,
    'dapps-container': DappsContainer,
    'interact-with-contract-container': InteractWithContractContainer,
    'deploy-contract-container': DeployContractContainer,
    'sign-message-container': SignMessageContainer,
    'verify-message-container': VerifyMessageContainer,
    'interface-side-menu': InterfaceSideMenu,
    'interface-address': InterfaceAddress,
    'interface-balance': InterfaceBalance,
    'interface-network': InterfaceNetwork,
    'interface-tokens': InterfaceTokens,
    'wallet-not-found-container': WalletNotFoundContainer
  },
  data() {
    return {
      currentTab: this.$store.state.pageStates.interface.sideMenu,
      balance: '0',
      blockNumber: 0,
      tokens: [],
      receivedTokens: false,
      tokensWithBalance: []
    };
  },
  computed: {
    address() {
      if (this.$store.state.wallet !== null) {
        return this.$store.state.wallet.getAddressString();
      }
    },
    ...mapGetters({
      network: 'network'
    })
  },
  watch: {
    network() {
      this.setupOnlineEnvironment();
    },
    address() {
      this.setupOnlineEnvironment();
    }
  },
  mounted() {
    if (store.get('sideMenu') !== undefined) {
      this.currentTab = store.get('sideMenu');
      this.$store.dispatch('updatePageState', [
        'interface',
        'sideMenu',
        store.get('sideMenu')
      ]);
    }

    this.setupOnlineEnvironment();
  },
  methods: {
    switchTabs(param) {
      this.currentTab = param;
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', param]);
      store.set('sideMenu', param);
    },
    async fetchTokens() {
      this.receivedTokens = true;
      const abi = [
        {
          constant: true,
          inputs: [
            { name: '_owner', type: 'address' },
            { name: 'name', type: 'bool' },
            { name: 'website', type: 'bool' },
            { name: 'email', type: 'bool' },
            { name: 'count', type: 'uint256' }
          ],
          name: 'getAllBalance',
          outputs: [{ name: '', type: 'bytes' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ];
      const contract = new this.$store.state.web3.eth.Contract(abi);
      const data = contract.methods
        .getAllBalance(
          this.$store.state.wallet.getAddressString(),
          true,
          true,
          true,
          0
        )
        .encodeABI();
      const response = this.$store.state.web3.eth
        .call({
          to: '0xBE1ecF8e340F13071761e0EeF054d9A511e1Cb56',
          data: data
        })
        .then(response => {
          return response;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err); // todo replace with proper error
        });

      return response;
    },
    async getTokenBalance(token) {
      const web3 = this.$store.state.web3;
      const contractAbi = [
        {
          name: 'balanceOf',
          type: 'function',
          constant: true,
          inputs: [{ name: 'address', type: 'address' }],
          outputs: [{ name: 'out', type: 'uint256' }]
        }
      ];
      const contract = new web3.eth.Contract(contractAbi);
      const data = contract.methods
        .balanceOf(this.$store.state.wallet.getAddressString())
        .encodeABI();
      const balance = await web3.eth
        .call({
          to: token.address
            ? web3.utils.toChecksumAddress(token.address)
            : web3.utils.toChecksumAddress(token.addr),
          data: data
        })
        .then(res => {
          let tokenBalance;
          if (Number(res) === 0 || res === '0x') {
            tokenBalance = 0;
          } else {
            const denominator = web3.utils
              .toBN(10)
              .pow(web3.utils.toBN(token.decimals));
            tokenBalance = web3.utils
              .toBN(res)
              .div(denominator)
              .toString(10);
          }
          return tokenBalance;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      return balance;
    },
    async setTokens() {
      if (this.network.type.chainID === 1) {
        this.receivedTokens = false;
        const hex = await this.fetchTokens();
        this.tokens = parseTokensHex(hex).sort((a, b) => {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        });
      } else {
        const tokenWithBalance = [];
        this.network.type.tokens.map(async token => {
          token.balance = await this.getTokenBalance(token);
          tokenWithBalance.push(token);
        });
        this.receivedTokens = false;
        this.tokens = tokenWithBalance;
      }

      let customTokens = [];
      if (
        store.get('customTokens') !== undefined &&
        store.get('customTokens')[this.network.type.name] !== undefined &&
        store.get('customTokens')[this.network.type.name].length > 0
      ) {
        // eslint-disable-next-line
        customTokens = store.get('customTokens')[this.network.type.name]
        .filter(token => token.balance > 0);
      }
      const allTokens = this.tokens
        .filter(token => token.balance > 0)
        .concat(customTokens);
      this.tokensWithBalance = allTokens;
    },
    getBlock() {
      this.$store.state.web3.eth
        .getBlockNumber()
        .then(res => {
          this.blockNumber = res;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    },
    getBalance() {
      const web3 = this.$store.state.web3;
      web3.eth
        .getBalance(this.address)
        .then(res => {
          this.balance = web3.utils.fromWei(res, 'ether');
          this.$store.dispatch('setAccountBalance', this.balance);
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    },
    checkMetamaskAddrChange() {
      const self = this;
      const pollAddress = setInterval(function() {
        window.web3.eth.getAccounts((err, accounts) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            return;
          }
          if (!accounts.length) {
            // eslint-disable-next-line no-console
            console.error('Please unlock metamask');
            return;
          }
          const address = accounts[0];
          if (address !== self.$store.state.wallet.getAddressString()) {
            const wallet = new MetamaskWallet(address);
            self.$store.dispatch('setMetamaskWallet', wallet);
            clearInterval(pollAddress);
          }
        });
      }, 500);
    },
    matchMetamaskNetwork() {
      const self = this;
      const pollNetwork = setInterval(function() {
        window.web3.version.getNetwork((err, netId) => {
          if (err) return;
          if (self.$store.state.network.type.chainID.toString() !== netId) {
            Object.keys(networkTypes).forEach(net => {
              if (networkTypes[net].chainID.toString() === netId) {
                self.$store.dispatch(
                  'switchNetwork',
                  self.$store.state.Networks[net][0]
                );
                clearInterval(pollNetwork);
              }
            });
          }
        });
      }, 500);
    },
    setupOnlineEnvironment() {
      if (this.$store.state.online === true) {
        if (this.$store.state.wallet !== null) {
          if (this.$store.state.wallet.type === 'Web3') {
            this.checkMetamaskAddrChange();
            this.matchMetamaskNetwork();
          }
          this.getBalance();
          setInterval(this.getBlock, 14000);
          this.setTokens();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceLayout.scss';
</style>
