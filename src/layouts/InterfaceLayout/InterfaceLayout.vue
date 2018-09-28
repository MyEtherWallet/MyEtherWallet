<template>
  <div
    v-if="$store.state.wallet !== null"
    class="send-eth-and-tokens">
    <div class="wrap">
      <div class="side-nav">
        <interface-side-menu/>
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
          <router-view
            :tokens-with-balance="tokensWithBalance"
            :get-balance="getBalance"/>
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
import ENS from 'ethereum-ens';

import WalletNotFoundContainer from './containers/WalletNotFoundContainer';

import InterfaceAddress from './components/InterfaceAddress';
import InterfaceBalance from './components/InterfaceBalance';
import InterfaceNetwork from './components/InterfaceNetwork';
import InterfaceSideMenu from './components/InterfaceSideMenu';
import InterfaceTokens from './components/InterfaceTokens';
import { Web3Wallet } from '@/wallets/software';
import * as networkTypes from '@/networks/types';

import store from 'store';

export default {
  components: {
    'interface-side-menu': InterfaceSideMenu,
    'interface-address': InterfaceAddress,
    'interface-balance': InterfaceBalance,
    'interface-network': InterfaceNetwork,
    'interface-tokens': InterfaceTokens,
    'wallet-not-found-container': WalletNotFoundContainer
  },
  data() {
    return {
      balance: '0',
      blockNumber: 0,
      tokens: [],
      receivedTokens: false,
      tokensWithBalance: [],
      pollNetwork: () => {},
      pollBlock: () => {},
      pollAddress: () => {}
    };
  },
  computed: {
    address() {
      if (this.wallet !== null) {
        return this.wallet.getAddressString();
      }
    },
    ...mapGetters({
      network: 'network',
      wallet: 'wallet'
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
    this.setupOnlineEnvironment();
  },
  destroyed() {
    this.clearIntervals();
  },
  methods: {
    async fetchTokens() {
      this.receivedTokens = true;
      const abi = [
        {
          constant: true,
          inputs: [
            {
              name: '_owner',
              type: 'address'
            },
            {
              name: 'name',
              type: 'bool'
            },
            {
              name: 'website',
              type: 'bool'
            },
            {
              name: 'email',
              type: 'bool'
            },
            {
              name: '_count',
              type: 'uint256'
            }
          ],
          name: 'getAllBalance',
          outputs: [
            {
              name: '',
              type: 'bytes'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ];
      const contract = new this.$store.state.web3.eth.Contract(abi);
      const data = contract.methods
        .getAllBalance(this.wallet.getAddressString(), true, true, true, 0)
        .encodeABI();
      const response = this.$store.state.web3.eth
        .call({
          to: '0xdAFf2b3BdC710EB33A847CCb30A24789c0Ef9c5b',
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
        .balanceOf(this.wallet.getAddressString())
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
      const utils = this.$store.state.web3.utils;
      if (this.network.type.chainID === 1) {
        this.receivedTokens = false;
        const hex = await this.fetchTokens();
        const parsedTokens = parseTokensHex(hex)
          .sort((a, b) => {
            if (a.name.toUpperCase() < b.name.toUpperCase()) {
              return -1;
            } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
              return 1;
            }
            return 0;
          })
          .map(token => {
            const convertedToken = {
              addr: token.addr,
              balance: token.balance,
              decimals: token.decimals,
              email: utils.hexToAscii(token.email),
              name: utils.hexToAscii(token.name),
              symbol: utils.hexToAscii(token.symbol),
              website: utils.hexToAscii(token.website)
            };

            return convertedToken;
          });
        this.tokens = parsedTokens;
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
    checkWeb3WalletAddrChange() {
      this.pollAddress = setInterval(() => {
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
          if (
            this.wallet !== null &&
            address !== this.wallet.getAddressString()
          ) {
            const wallet = new Web3Wallet(address);
            this.$store.dispatch('setWeb3Wallet', wallet);
            clearInterval(this.pollAddress);
          }
        });
      }, 500);
    },
    matchWeb3WalletNetwork() {
      this.pollNetwork = setInterval(() => {
        window.web3.version.getNetwork((err, netId) => {
          if (err) return;
          if (this.$store.state.network.type.chainID.toString() !== netId) {
            Object.keys(networkTypes).forEach(net => {
              if (networkTypes[net].chainID.toString() === netId) {
                this.$store.dispatch(
                  'switchNetwork',
                  this.$store.state.Networks[net][0]
                );
                clearInterval(this.pollNetwork);
              }
            });
          }
        });
      }, 500);
    },
    clearIntervals() {
      const self = this;
      if (self.wallet === null) {
        clearInterval(self.pollNetwork);
        clearInterval(self.pollBlock);
        clearInterval(self.pollAddress);
      }
    },
    setupOnlineEnvironment() {
      if (this.$store.state.online === true) {
        if (this.wallet !== null) {
          if (this.wallet.identifier === 'Web3') {
            this.checkWeb3WalletAddrChange();
            this.matchWeb3WalletNetwork();
          }
          this.getBalance();
          this.pollBlock = setInterval(this.getBlock, 10000);
          this.setTokens();
          this.setENS();
        }
      }
    },
    setENS() {
      if (this.wallet.identifier === 'Web3') {
        this.$store.dispatch('setENS', new ENS(window.web3.currentProvider));
      } else {
        this.$store.dispatch(
          'setENS',
          new ENS(this.$store.state.web3.currentProvider)
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceLayout.scss';
</style>
