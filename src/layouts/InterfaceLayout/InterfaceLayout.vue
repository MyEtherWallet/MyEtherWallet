<template>
  <div class="interface-layout">
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <wallet-password-modal />
    <enter-pin-number-modal />
    <ledger-app-modal
      ref="ledgerAppModal"
      :networks="Networks"
      @hardwareWalletOpen="toggleNetworkAddrModal"
    />
    <mnemonic-modal
      ref="mnemonicPhraseModal"
      :hardware-wallet-open="toggleNetworkAddrModal"
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
      :priv-key="!wallet.isPubOnly"
      :address="account.address"
    />
    <address-qrcode-modal ref="addressQrcodeModal" :address="account.address" />
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <!-- Modals ******************************************************** -->
    <div class="mobile-interface-address-block">
      <mobile-interface-address
        :address="address"
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
        <div class="tx-contents">
          <div class="content-container mobile-hide">
            <interface-address
              :address="address"
              :print="print"
              :switch-addr="switchAddress"
              :display-addr="wallet.displayAddress"
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
            :nonce="nonce"
          />
          <div class="tokens">
            <interface-tokens
              :fetch-tokens="setTokens"
              :get-token-balance="getTokenBalance"
              :tokens="tokens"
              :received-tokens="receivedTokens"
              :reset-token-selection="setTokensWithBalance"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ENS from 'ethereum-ens';
import WalletPasswordModal from '@/components/WalletPasswordModal';
import EnterPinNumberModal from '@/components/EnterPinNumberModal';
import NetworkAndAddressModal from '@/layouts/AccessWalletLayout/components/NetworkAndAddressModal';
import HardwarePasswordModal from '@/layouts/AccessWalletLayout/components/HardwarePasswordModal';
import MnemonicPasswordModal from '@/layouts/AccessWalletLayout/components/MnemonicPasswordModal';
import MnemonicModal from '@/layouts/AccessWalletLayout/components/MnemonicModal';
import LedgerAppModal from '@/layouts/AccessWalletLayout/components/LedgerAppModal';
import InterfaceAddress from './components/InterfaceAddress';
import InterfaceBalance from './components/InterfaceBalance';
import InterfaceNetwork from './components/InterfaceNetwork';
import InterfaceSideMenu from './components/InterfaceSideMenu';
import InterfaceTokens from './components/InterfaceTokens';
import MobileInterfaceAddress from './components/MobileInterfaceAddress';
import PrintModal from './components/PrintModal';
import { Web3Wallet } from '@/wallets/software';
import { Toast } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';
import * as networkTypes from '@/networks/types';
import { BigNumber } from 'bignumber.js';
import store from 'store';
import TokenBalance from '@myetherwallet/eth-token-balance';
import sortByBalance from '@/helpers/sortByBalance.js';
import AddressQrcodeModal from '@/components/AddressQrcodeModal';
import web3Utils from 'web3-utils';
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
  name: 'Interface',
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
    'address-qrcode-modal': AddressQrcodeModal,
    'ledger-app-modal': LedgerAppModal
  },
  data() {
    return {
      balance: '0',
      blockNumber: 0,
      tokens: [],
      receivedTokens: false,
      tokensWithBalance: [],
      pollBlock: () => {},
      pollNetwork: () => {},
      pollddress: () => {},
      highestGas: '0',
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
      phrase: '',
      nonce: '0'
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
    ...mapState([
      'network',
      'account',
      'online',
      'web3',
      'Networks',
      'sidemenuOpen',
      'wallet'
    ])
  },
  watch: {
    web3() {
      this.setupOnlineEnvironment();
    },
    address(val) {
      if (val) this.setupOnlineEnvironment();
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
    ledgerAppModalOpen() {
      this.$refs.ledgerAppModal.$refs.ledgerApp.show();
    },
    switchAddress() {
      switch (this.account.identifier) {
        case LEDGER_TYPE:
          this.ledgerAppModalOpen();
          break;
        case TREZOR_TYPE:
          TrezorWallet()
            .then(_newWallet => {
              this.toggleNetworkAddrModal(_newWallet);
            })
            .catch(TrezorWallet.errorHandler);
          break;
        case BITBOX_TYPE:
          this.togglePasswordModal(BitBoxWallet, 'BitBox');
          break;
        case SECALOT_TYPE:
          this.togglePasswordModal(SecalotWallet, 'Secalot');
          break;
        case MNEMONIC_TYPE:
          this.$refs.mnemonicPhraseModal.$refs.mnemonicPhrase.show();
          break;
        case KEEPKEY_TYPE:
          KeepkeyWallet(false, this.$eventHub)
            .then(_newWallet => {
              this.toggleNetworkAddrModal(_newWallet);
            })
            .catch(KeepkeyWallet.errorHandler);
          break;
        default:
          Toast.responseHandler(
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
    toggleSideMenu() {
      this.$store.commit('TOGGLE_SIDEMENU');
    },
    async fetchTokens() {
      this.receivedTokens = false;
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
      store.set(this.web3.utils.sha3(this.account.address), {
        nonce: '0x00',
        timestamp: 0
      });
      const fetchedNonce = await this.web3.eth
        .getTransactionCount(this.account.address)
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.nonce = new BigNumber(fetchedNonce).toString();
    },
    async getTokenBalance(token) {
      try {
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
        const data = contract.methods
          .balanceOf(this.account.address)
          .encodeABI();
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
              const denominator = new BigNumber(10).pow(token.decimals);
              tokenBalance = new BigNumber(res).div(denominator).toString();
            }
            return tokenBalance;
          })
          .catch(e => {
            Toast.responseHandler(e, false);
          });

        return balance;
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
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
      this.setTokensWithBalance();
    },
    setTokensWithBalance() {
      const customStore = store.get('customTokens');
      if (
        customStore !== undefined &&
        customStore[this.network.type.name] !== undefined &&
        customStore[this.network.type.name].length > 0
      ) {
        new Promise(resolve => {
          const newArr = customStore[this.network.type.name].map(
            async token => {
              token.balance = await this.getTokenBalance(token);
              return token;
            }
          );
          Promise.all(newArr).then(res => {
            customStore[this.network.type.name] = res;
            store.set('customTokens', customStore);
            resolve(res);
          });
        })
          .then(res => {
            const allTokens = this.tokens
              .filter(token => token.balance > 0)
              .concat(res.filter(token => token.balance > 0));
            this.tokensWithBalance = allTokens;
            this.receivedTokens = true;
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } else {
        this.receivedTokens = true;
        this.tokensWithBalance = this.tokens.filter(token => token.balance > 0);
      }
    },
    getBlock() {
      this.web3.eth
        .getBlockNumber()
        .then(res => {
          this.blockNumber = res;
          this.$store.dispatch('updateBlockNumber', res);
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
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
          Toast.responseHandler(e, Toast.ERROR);
        });
    },
    checkMetamaskAddrChange() {
      const web3 = this.web3;
      window.ethereum.on('accountsChanged', account => {
        if (account.length > 1) {
          const wallet = new Web3Wallet(account[0]);
          this.$store.dispatch('decryptWallet', [wallet, web3]);
        }
      });
    },
    matchMetamaskNetwork() {
      window.ethereum.on('networkChanged', netId => {
        if (this.network.type.chainID.toString() !== netId) {
          Object.keys(networkTypes).some(net => {
            if (
              networkTypes[net].chainID.toString() === netId &&
              this.Networks[net]
            ) {
              this.$store.dispatch('switchNetwork', this.Networks[net][0]);
              return true;
            }
          });
        }
      });
    },
    setupOnlineEnvironment: web3Utils._.debounce(function() {
      this.clearIntervals();
      if (store.get('customTokens') === undefined) {
        store.set('customTokens', {});
        this.setCustomTokenStore();
      } else {
        this.setCustomTokenStore();
      }
      if (this.online) {
        if (this.account.address !== null) {
          if (this.account.identifier === WEB3_TYPE) {
            if (window.web3.currentProvider.isMetaMask) {
              this.checkMetamaskAddrChange();
              this.matchMetamaskNetwork();
            } else {
              if (!window.web3.currentProvider.isMew) {
                this.web3WalletPollNetwork();
                this.web3WalletPollAddress();
              }
            }
          }
          this.setENS();
          this.getBlock();
          this.getBalance();
          this.setTokens();
          this.setNonce();
          this.getHighestGas();
          this.getBlockUpdater().then(_sub => {
            this.pollBlock = _sub;
          });
        }
      }
    }),
    async getBlockUpdater() {
      return new Promise(resolve => {
        let subscription = this.web3.eth
          .subscribe('newBlockHeaders', err => {
            if (err) {
              subscription = setInterval(this.getBlock, 14000);
            }
            resolve(subscription);
          })
          .on('data', headers => {
            this.blockNumber = headers.number;
          });
      });
    },
    getHighestGas() {
      this.web3.eth
        .getGasPrice()
        .then(res => {
          this.highestGas = new BigNumber(
            this.web3.utils.fromWei(res, 'gwei')
          ).toString();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
    },
    setENS() {
      if (this.network.type.ens) {
        this.$store.dispatch(
          'setENS',
          new ENS(this.web3.currentProvider, this.network.type.ens.registry)
        );
      } else {
        this.$store.dispatch('setENS', null);
      }
    },
    clearIntervals() {
      if (this.pollBlock.unsubscribe) this.pollBlock.unsubscribe();
      else clearInterval(this.pollBlock);
      clearInterval(this.pollNetwork);
      clearInterval(this.pollAddress);
    },
    web3WalletPollNetwork() {
      if (
        !window.web3.eth.net ||
        typeof window.web3.eth.net.getId !== 'function'
      )
        return;
      this.pollNetwork = setInterval(() => {
        window.web3.eth.net
          .getId()
          .then(id => {
            if (this.network.type.chainID.toString() !== id) {
              Object.keys(networkTypes).some(net => {
                if (networkTypes[net].chainID === id && this.Networks[net]) {
                  this.$store.dispatch('switchNetwork', this.Networks[net]);
                  clearInterval(this.pollNetwork);
                  return true;
                }
              });
            }
          })
          .catch(e => {
            Toast.responseHandler(e, false);
          });
      }, 500);
    },
    web3WalletPollAddress() {
      this.pollAddress = setInterval(() => {
        if (!window.web3.eth) {
          Toast.responseHandler(
            new Error('Web3 Instance not found!'),
            Toast.ERROR
          );
          clearInterval(this.pollAddress);
        }

        window.web3.eth.getAccounts((err, accounts) => {
          if (err) {
            Toast.responseHandler(err, false);
            clearInterval(this.pollAddress);
          }
          if (!accounts.length) {
            Toast.responseHandler(
              new Error('Please make sure that your Web3 Wallet is unlocked'),
              Toast.ERROR
            );
            clearInterval(this.pollAddress);
          }
          const address = accounts[0];

          if (
            this.account.address !== null &&
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceLayout-desktop.scss';
@import 'InterfaceLayout-tablet.scss';
@import 'InterfaceLayout-mobile.scss';
</style>
