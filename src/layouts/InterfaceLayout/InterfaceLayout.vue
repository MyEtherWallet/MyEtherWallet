<template>
  <div class="interface-layout">
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <wallet-password-modal />
    <enter-pin-number-modal />
    <mnemonic-modal
      ref="mnemonicPhraseModal"
      :mnemonic-phrase-password-modal-open="mnemonicphrasePasswordModalOpen"
    />

    <mnemonic-password-modal
      ref="mnemonicPhrasePassword"
      :hardware-wallet-open="toggleNetworkAddrModal"
      :phrase="phrase"
    />
    <network-and-address-modal
      ref="networkAddress"
      :hardware-wallet="hwInstance"
    />
    <hardware-password-modal
      ref="hardwareModal"
      :wallet-constructor="walletConstructor"
      :hardware-brand="hardwareBrand"
      @hardwareWalletOpen="toggleNetworkAddrModal"
    />
    <print-modal
      ref="printModal"
      :priv-key="wallet.privateKey"
      :address="account.address"
    />
    <address-qrcode-modal ref="addressQrcodeModal" :address="account.address" />
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <div class="mobile-interface-address-block">
      <mobile-interface-address
        :address="address"
        :trigger-alert="triggerAlert"
        :print="print"
        :switch-addr="switchAddress"
      />
    </div>

    <div class="wrap">
      <div class="sidemenu">
        <div
          :class="isSidemenuOpen && 'side-nav-open'"
          class="side-nav-background"
          @click="toggleSideMenu;"
        />
        <div :class="isSidemenuOpen && 'side-nav-open'" class="side-nav">
          <interface-side-menu />
        </div>
      </div>
      <div class="contents">
        <b-alert
          :show="alert.show"
          :variant="alert.type"
          fade
          @click.native="triggerAlert(null)"
          >{{ alert.msg }}</b-alert
        >
        <div class="tx-contents">
          <div class="content-container mobile-hide">
            <interface-address
              :address="address"
              :trigger-alert="triggerAlert"
              :print="print"
              :switch-addr="switchAddress"
              :qrcode="openAddressQrcode"
            />
          </div>
          <div class="content-container mobile-hide">
            <interface-balance :balance="balance" :get-balance="getBalance" />
          </div>
          <div class="content-container mobile-hide">
            <interface-network :block-number="blockNumber" />
          </div>
          <router-view
            :tokens-with-balance="tokensWithBalance"
            :get-balance="getBalance"
            :tokens="tokens"
            :highest-gas="highestGas"
          />
          <div v-if="online" class="tokens">
            <interface-tokens
              :fetch-tokens="setTokens"
              :get-token-balance="getTokenBalance"
              :tokens="tokens"
              :received-tokens="receivedTokens"
              :trigger-alert="triggerAlert"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ENS from 'ethereum-ens';
import WalletPasswordModal from '@/components/WalletPasswordModal';
import EnterPinNumberModal from '@/components/EnterPinNumberModal';
import NetworkAndAddressModal from '@/layouts/AccessWalletLayout/components/NetworkAndAddressModal';
import HardwarePasswordModal from '@/layouts/AccessWalletLayout/components/HardwarePasswordModal';
import MnemonicPasswordModal from '@/layouts/AccessWalletLayout/components/MnemonicPasswordModal';
import MnemonicModal from '@/layouts/AccessWalletLayout/components/MnemonicModal';
import InterfaceAddress from './components/InterfaceAddress';
import InterfaceBalance from './components/InterfaceBalance';
import InterfaceNetwork from './components/InterfaceNetwork';
import InterfaceSideMenu from './components/InterfaceSideMenu';
import InterfaceTokens from './components/InterfaceTokens';
import MobileInterfaceAddress from './components/MobileInterfaceAddress';
import PrintModal from './components/PrintModal';
import { Web3Wallet } from '@/wallets/software';
import { ErrorHandler, Misc } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';
import * as networkTypes from '@/networks/types';
import { BigNumber } from 'bignumber.js';
import store from 'store';
import TokenBalance from '@myetherwallet/eth-token-balance';
import sortByBalance from '@/helpers/sortByBalance.js';
import AddressQrcodeModal from '@/components/AddressQrcodeModal';
import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet,
  KeepkeyWallet
} from '@/wallets';
import {
  WEB3_WALLET as WEB3_TYPE,
  LEDGER as LEDGER_TYPE,
  TREZOR as TREZOR_TYPE,
  BITBOX as BITBOX_TYPE,
  SECALOT as SECALOT_TYPE,
  KEEPKEY as KEEPKEY_TYPE,
  MNEMONIC as MNEMONIC_TYPE
} from '@/wallets/bip44/walletTypes';
export default {
  components: {
    'interface-side-menu': InterfaceSideMenu,
    'interface-address': InterfaceAddress,
    'interface-balance': InterfaceBalance,
    'interface-network': InterfaceNetwork,
    'interface-tokens': InterfaceTokens,
    'wallet-password-modal': WalletPasswordModal,
    'print-modal': PrintModal,
    'network-and-address-modal': NetworkAndAddressModal,
    'hardware-password-modal': HardwarePasswordModal,
    'mnemonic-modal': MnemonicModal,
    'mnemonic-password-modal': MnemonicPasswordModal,
    'enter-pin-number-modal': EnterPinNumberModal,
    'mobile-interface-address': MobileInterfaceAddress,
    'address-qrcode-modal': AddressQrcodeModal
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
      pollAddress: () => {},
      highestGas: 0,
      alert: {
        show: false,
        msg: ''
      },
      hws: {
        ledger: LedgerWallet,
        trezor: TrezorWallet,
        bitbox: BitBoxWallet,
        secalot: SecalotWallet
      },
      hwInstance: {},
      walletConstructor: () => {},
      hardwareBrand: '',
      phrase: ''
    };
  },
  computed: {
    isSidemenuOpen() {
      return this.sidemenuOpen;
    },
    address() {
      if (this.wallet !== null) {
        return toChecksumAddress(this.account.address);
      }
    },
    ...mapGetters({
      network: 'network',
      wallet: 'wallet',
      account: 'account',
      online: 'online',
      web3: 'web3',
      Networks: 'Networks',
      sidemenuOpen: 'sidemenuOpen'
    })
  },
  watch: {
    web3() {
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
    openAddressQrcode() {
      this.$refs.addressQrcodeModal.$refs.addressQrcode.show();
    },
    mnemonicphrasePasswordModalOpen(phrase) {
      this.phrase = phrase;
      this.$refs.mnemonicPhraseModal.$refs.mnemonicPhrase.hide();
      this.$refs.mnemonicPhrasePassword.$refs.password.show();
    },
    toggleNetworkAddrModal(walletInstance) {
      this.$refs.hardwareModal.$refs.password.hide();
      this.$refs.mnemonicPhrasePassword.$refs.password.hide();
      this.hwInstance = walletInstance;
      this.$refs.networkAddress.$refs.networkAndAddress.show();
    },
    togglePasswordModal(construct, brand) {
      this.walletConstructor = construct;
      this.hardwareBrand = brand;
      this.$refs.hardwareModal.$refs.password.show();
    },

    switchAddress() {
      switch (this.account.identifier) {
        case LEDGER_TYPE:
          LedgerWallet().then(_newWallet => {
            this.toggleNetworkAddrModal(_newWallet);
          });
          break;
        case TREZOR_TYPE:
          TrezorWallet().then(_newWallet => {
            this.toggleNetworkAddrModal(_newWallet);
          });
          break;
        case BITBOX_TYPE:
          this.togglePasswordModal(BitBoxWallet, 'DigitalBitbox');
          break;
        case SECALOT_TYPE:
          this.togglePasswordModal(SecalotWallet, 'Secalot');
          break;
        case MNEMONIC_TYPE:
          this.$refs.mnemonicPhraseModal.$refs.mnemonicPhrase.show();
          break;
        case KEEPKEY_TYPE:
          KeepkeyWallet(false, this.$eventHub).then(_newWallet => {
            this.toggleNetworkAddrModal(_newWallet);
          });
          break;
        default:
          ErrorHandler(
            new Error(
              `Wallet type ${this.account.identifier} can't switch addresses`
            ),
            false
          );
      }
    },
    print() {
      this.$refs.printModal.$refs.print.show();
    },
    triggerAlert(msg, type) {
      let timeout;
      if (msg !== null) {
        this.alert = {
          show: true,
          msg: msg,
          type: type ? type : 'info'
        };
        timeout = setTimeout(() => {
          this.alert = {
            show: false,
            msg: '',
            type: type ? type : 'info'
          };
        }, 3000);
      } else {
        clearTimeout(timeout);
        this.alert = {
          show: false,
          msg: ''
        };
      }
    },
    toggleSideMenu() {
      this.$store.commit('TOGGLE_SIDEMENU');
    },
    async fetchTokens() {
      this.receivedTokens = true;
      let tokens = [];
      if (this.network.type.chainID === 1 || this.network.type.chainID === 3) {
        const tb = new TokenBalance(this.web3.currentProvider);
        try {
          tokens = await tb.getBalance(this.account.address);
          tokens = tokens.map(token => {
            token.address = token.addr;
            delete token.addr;
            return token;
          });
        } catch (e) {
          tokens = this.network.type.tokens.map(token => {
            token.balance = 'Load';
            return token;
          });
        }
      } else {
        tokens = this.network.type.tokens.map(token => {
          token.balance = 'Load';
          return token;
        });
      }
      return tokens;
    },
    async setNonce() {
      const nonce = await this.web3.eth.getTransactionCount(
        this.account.address
      );
      store.set(this.web3.utils.sha3(this.account.address), {
        nonce: Misc.sanitizeHex(new BigNumber(nonce).toString(16)),
        timestamp: +new Date()
      });
    },
    async getTokenBalance(token) {
      const web3 = this.web3;
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
      const data = contract.methods.balanceOf(this.account.address).encodeABI();
      const balance = await web3.eth
        .call({
          to: token.address,
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
        .catch(e => {
          ErrorHandler(e, false);
        });
      return balance;
    },
    setCustomTokenStore() {
      const customTokenStore = store.get('customTokens');
      Object.keys(networkTypes).forEach(network => {
        if (customTokenStore[networkTypes[network].name] === undefined) {
          customTokenStore[networkTypes[network].name] = [];
        }
      });
      store.set('customTokens', customTokenStore);
    },
    async setTokens() {
      this.receivedTokens = false;
      this.tokens = [];
      let tokens = await this.fetchTokens();
      tokens = tokens
        .sort((a, b) => {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        })
        .map(token => {
          const balanceCheck = new BigNumber(token.balance);
          const balance = balanceCheck.isNaN()
            ? token.balance
            : balanceCheck.div(new BigNumber(10).pow(token.decimals)).toFixed();
          const convertedToken = {
            address: token.address,
            balance: balance,
            decimals: token.decimals,
            email: token.email,
            name: token.name,
            symbol: token.symbol,
            website: token.website
          };
          return convertedToken;
        });

      this.tokens = tokens.sort(sortByBalance);
      let customTokens = [];
      if (
        store.get('customTokens') !== undefined &&
        store.get('customTokens')[this.network.type.name] !== undefined &&
        store.get('customTokens')[this.network.type.name].length > 0
      ) {
        customTokens = store.get('customTokens')[
          // eslint-disable-next-line
          this.network.type.name
        ].filter(token => token.balance > 0);
      }
      const allTokens = this.tokens
        .filter(token => token.balance > 0)
        .concat(customTokens);
      this.tokensWithBalance = allTokens;
    },
    getBlock() {
      this.web3.eth
        .getBlockNumber()
        .then(res => {
          this.blockNumber = res;
        })
        .catch(e => {
          ErrorHandler(e, false);
        });
    },
    getBalance() {
      const web3 = this.web3;
      web3.eth
        .getBalance(this.address.toLowerCase())
        .then(res => {
          this.balance = web3.utils.fromWei(res, 'ether');
          this.$store.dispatch('setAccountBalance', res);
        })
        .catch(e => {
          ErrorHandler(e, false);
        });
    },
    checkWeb3WalletAddrChange() {
      this.pollAddress = setInterval(() => {
        window.web3.eth.getAccounts((err, accounts) => {
          if (err) {
            return ErrorHandler(err, false);
          }
          if (!accounts.length) {
            return ErrorHandler(new Error('Please unlock metamask'), false);
          }
          const address = accounts[0];
          if (
            this.wallet !== null &&
            address.toLowerCase() !== this.account.address.toLowerCase()
          ) {
            const wallet = new Web3Wallet(address);
            this.$store.dispatch('decryptWallet', [
              wallet,
              window.web3.currentProvider
            ]);
            clearInterval(this.pollAddress);
          }
        });
      }, 500);
    },
    matchWeb3WalletNetwork() {
      this.pollNetwork = setInterval(() => {
        window.web3.eth.net
          .getId()
          .then(netId => {
            if (this.network.type.chainID.toString() !== netId) {
              Object.keys(networkTypes).some(net => {
                if (networkTypes[net].chainID === netId && this.Networks[net]) {
                  this.$store.dispatch('switchNetwork', this.Networks[net][0]);
                  clearInterval(this.pollNetwork);
                  return true;
                }
              });
            }
          })
          .catch(e => {
            ErrorHandler(e, false);
          });
      }, 500);
    },
    clearIntervals() {
      clearInterval(this.pollNetwork);
      clearInterval(this.pollBlock);
      clearInterval(this.pollAddress);
    },
    setupOnlineEnvironment() {
      this.clearIntervals();
      if (store.get('customTokens') === undefined) {
        store.set('customTokens', {});
        this.setCustomTokenStore();
      } else {
        this.setCustomTokenStore();
      }
      if (this.online === true) {
        if (this.wallet !== null) {
          if (this.account.identifier === WEB3_TYPE) {
            this.checkWeb3WalletAddrChange();
            this.matchWeb3WalletNetwork();
          }
          this.getBlock();
          this.getBalance();
          this.pollBlock = setInterval(this.getBlock, 14000);
          this.setTokens();
          this.setENS();
          this.setNonce();
          this.getHighestGas();
        }
      }
    },
    getHighestGas() {
      this.web3.eth
        .getGasPrice()
        .then(res => {
          this.highestGas = new BigNumber(
            this.web3.utils.fromWei(res, 'gwei')
          ).toNumber();
        })
        .catch(e => {
          ErrorHandler(e, false);
        });
    },
    setENS() {
      if (this.network.type.ens) {
        this.$store.dispatch(
          'setENS',
          new ENS(this.web3.currentProvider, this.network.type.ens.resolver)
        );
      } else {
        this.$store.dispatch('setENS', null);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceLayout-desktop.scss';
@import 'InterfaceLayout-tablet.scss';
@import 'InterfaceLayout-mobile.scss';
</style>
