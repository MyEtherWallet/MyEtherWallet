<template>
  <div class="wallet-info-container">
    <div class="wallet-info-header">
      <div class="address-and-blockie">
        <div class="blockie-container">
          <blockie :address="address" width="50px" height="50px" />
        </div>
        <div class="address-and-nickname-container">
          <p>
            <b> {{ nickname }} </b>
          </p>
          <p>{{ concattedAddr }}</p>
          <input ref="addressInput" v-model="address" />
        </div>
      </div>
      <div class="wallet-options">
        <b-dropdown
          toggle-class="wallet-options-toggle"
          no-caret
          offset="-60"
          menu-class="wallet-options-menu"
        >
          <template v-slot:button-content>
            <i class="fa fa-ellipsis-v fa-lg" />
          </template>
          <b-dropdown-text
            @click="
              () => {
                access(wallet, 'access');
              }
            "
            >Access</b-dropdown-text
          >
          <b-dropdown-text @click="edit">Rename</b-dropdown-text>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-text class="remove-text" @click="openRemoveWallet"
            >Remove</b-dropdown-text
          >
        </b-dropdown>
        <i :class="['fa fa-lg', 'fa-heart-o']" />
      </div>
    </div>
    <div class="wallet-info-body">
      <div class="main-wallet-content">
        <div class="main-wallet-content-container">
          <div class="wallet-value-with-img">
            <div class="wallet-img-container">
              <img alt class="icon" src="~@/assets/images/icons/wallet.svg" />
            </div>
            <div class="wallet-value-container">
              <p class="title">Total Wallet Value</p>
              <p class="dollar-amt">
                {{ walletTokensWithBalance.totalWalletBalance }}
              </p>
            </div>
          </div>
          <div class="wallet-value-container">
            <p class="title">ETH Balance</p>
            <p class="dollar-amt">{{ convertedBalance }}</p>
            <p class="value">{{ fixedEthBalance }}</p>
          </div>
          <div class="wallet-value-container">
            <p class="title">Value of Token</p>
            <p class="dollar-amt">{{ walletTokensWithBalance.total }}</p>
            <p class="value">
              {{ walletTokensWithBalance.tokensWDollarAmtLength }} tokens
            </p>
          </div>
        </div>
        <div class="view-all-container" @click="showTokens = !showTokens">
          <p>View all tokens</p>
          <i :class="['fa', showTokens ? 'fa-angle-up' : 'fa-angle-down']" />
        </div>
      </div>
      <div v-show="showTokens" class="wallet-tokens">
        <div
          v-for="(token, idx) in walletTokensWithBalance.tokensWDollarAmt"
          :key="token.symbol + `${idx}`"
        >
          {{ token.tokenMew.symbol }} - {{ token.tokenMew.balance }}
        </div>
      </div>
    </div>
    <!-- <interface-tokens-modal ref="tokenModal" :add-token="addToken" /> -->
    <edit-wallet-modal
      ref="editModal"
      :address="address"
      :name="parsedWallet.nick"
      :wallet="parsedWallet"
    />
    <remove-wallet-modal
      ref="removeWalletModal"
      :cancel-remove="cancelRemove"
      :wallet-type="parsedWallet.type"
      :nickname="parsedWallet.nick"
      :address="address"
    />
    <!-- <b-modal
      ref="viewAllModal"
      hide-footer
      hide-header
      modal-class="cx-token-modal"
    >
      <div class="modal-header-contaier">
        <div>
          <h3>
            {{ $t('mewcx.all-tokens') }}
            <span class="token-count"> {{ tokens.length }} </span>
          </h3>
          <div class="modal-nickname">
            <p>{{ parsedWallet.nick }}</p>
          </div>
        </div>
        <div class="header-buttons">
          <div class="header-button">
            <i class="fa fa-repeat fa-lg" @click="fetchTokens" />
          </div>
          <div class="header-button">
            <i
              class="fa fa-times fa-lg"
              @click="
                () => {
                  viewAllTokens(false);
                }
              "
            />
          </div>
        </div>
      </div>
      <div class="token-search-container">
        <input v-model="search" :placeholder="$t('mewcx.search-tokens')" />
        <i class="fa fa-search" />
      </div>
      <div class="modal-tokens-container">
        <div v-show="loading" class="loading-container">
          <i class="fa fa-spinner fa-spin" />
          {{ $t('mewcx.loading-tokens') }}...
        </div>
        <div v-show="!loading" class="tokens-container">
          <div
            v-for="(token, idx) in localCustomTokens"
            :key="token.address + address + idx"
            class="modal-token-item"
          >
            <div class="icon-name-container">
              <img :src="token.logo.src" />
              <p>
                {{ token.name }} ({{ $t('mewcx.custom') }}) <br />
                <span>{{ token.balance }}</span>
              </p>
            </div>
          </div>
          <div
            v-for="(token, idx) in localTokenVersion"
            :key="token.address + address + idx"
            class="modal-token-item"
          >
            <div class="icon-name-container">
              <img :src="token.logo.src" />
              <p>
                {{ token.name }} <br />
                <span>{{ token.balance }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </b-modal> -->
    <!-- <div class="nickname-and-buttons">
      <p>
        {{ parsedWallet.nick }}
      </p>
      <div class="button-container">
        <div
          v-show="walletType !== 'watchOnly'"
          class="clickable"
          @click="
            () => {
              access(wallet, 'access');
            }
          "
        >
          {{ $t('mewcx.access') }}
        </div>
        <div
          v-show="walletType !== 'watchOnly'"
          class="clickable"
          @click="
            () => {
              detail(wallet, 'view', nickname);
            }
          "
        >
          {{ $t('mewcx.details') }}
        </div>
        <div class="clickable" @click="edit">{{ $t('mewcx.edit') }}</div>
      </div>
    </div>
    <div class="wallet-content">
      <div class="address-and-balance-container">
        <div class="address-content-container">
          <div class="address-info">
            <div class="blockie-container">
              <blockie :address="address" width="50px" height="50px" />
            </div>
            <div class="actual-address">
              <p>{{ $t('common.addr') }}</p>
              <p class="d-none d-xl-block">{{ address }}</p>
              <p class="d-block d-xl-none">{{ address | concatAddress }}</p>
              <input ref="addressInput" :value="address" />
            </div>
          </div>
          <div class="copy-button">
            <p @click="copyAddress">{{ $t('common.copy') }}</p>
          </div>
        </div>
        <div class="balance-container">
          <p>{{ $t('common.balance.string') }}</p>
          <div>
            <p class="actual-balance">
              {{ balance }} <span>{{ network.type.name }}</span>
            </p>
            <p v-if="network.type.name === 'ETH'" class="dollar-balance">
              {{ convertedBalance }}
            </p>
          </div>
        </div>
      </div>
      <div class="tokens-container">
        <div class="tokens-header">
          <p>
            {{ $t('mewcx.tokens') }}
          </p>
          <b-dropdown :no-caret="true" class="cx-dropdown">
            <template slot="button-content">
              <i class="fa fa-lg fa-ellipsis-h" />
            </template>
            <b-dropdown-item @click="openAddCustom">{{
              $t('mewcx.add')
            }}</b-dropdown-item>
            <b-dropdown-item @click="fetchTokens">{{
              $t('mewcx.refresh')
            }}</b-dropdown-item>
            <b-dropdown-item
              @click="
                () => {
                  viewAllTokens(true);
                }
              "
              >{{ $t('mewcx.view-all') }}</b-dropdown-item
            >
          </b-dropdown>
        </div>
        <div class="token-search-container">
          <input v-model="search" :placeholder="$t('mewcx.search-tokens')" />
          <i class="fa fa-search" />
        </div>
        <div class="actual-tokens-container">
          <div v-show="loading" class="loading-container">
            <i class="fa fa-spinner fa-spin" />
            {{ $t('mewcx.loading-tokens') }}...
          </div>
          <div v-show="!loading">
            <div
              v-for="(token, idx) in localCustomTokens"
              :key="token.address + idx"
              class="token-item"
            >
              <p>
                {{ token.name }}
              </p>
              <div class="balance-container">
                <p
                  :class="[token.balance !== 'Load' ? '' : 'manual-load']"
                  @click="
                    token.balance !== 'Load'
                      ? () => {}
                      : fetchTokenBalance(token)
                  "
                >
                  {{ token.balance }}
                </p>
                <i class="fa fa-times" @click="removeCustomToken(token)" />
              </div>
            </div>
            <div
              v-for="(token, idx) in localTokenVersion"
              :key="token.address + idx"
              class="token-item"
            >
              <p>
                {{ token.name }}
              </p>
              <p
                :class="[token.balance !== 'Load' ? '' : 'manual-load']"
                @click="
                  token.balance !== 'Load' ? () => {} : fetchTokenBalance(token)
                "
              >
                {{ token.balance }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import TokenBalance from '@myetherwallet/eth-token-balance';
import sortByBalance from '@/helpers/sortByBalance.js';
import BigNumber from 'bignumber.js';
import EditWalletModal from '../EditWalletModal';
import RemoveWalletModal from '../RemoveWalletModal';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import store from 'store';
import * as networkTypes from '@/networks/types';
import utils from 'web3-utils';
import InterfaceTokensModal from '@/layouts/InterfaceLayout/components/InterfaceTokensModal';
export default {
  components: {
    blockie: Blockie,
    'edit-wallet-modal': EditWalletModal,
    'remove-wallet-modal': RemoveWalletModal,
    'interface-tokens-modal': InterfaceTokensModal
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    wallet: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    walletType: {
      type: String,
      default: 'watchOnly'
    },
    access: {
      type: Function,
      default: () => {}
    },
    detail: {
      type: Function,
      default: () => {}
    },
    balance: {
      type: String,
      default: ''
    },
    usd: {
      type: Number,
      default: 0
    },
    prices: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      tokens: [],
      search: '',
      localTokenVersion: [],
      customTokens: [],
      localCustomTokens: [],
      showTokens: false
    };
  },
  computed: {
    ...mapState('main', ['network', 'web3']),
    parsedWallet() {
      return JSON.parse(this.wallet);
    },
    convertedBalance() {
      const balance = new BigNumber(this.balance).times(this.usd).toNumber();
      return this.toDollar(balance);
    },
    concattedAddr() {
      return (
        this.address.substr(0, 18) +
        '...' +
        this.address.substr(this.address.length - 6, this.address.length)
      );
    },
    fixedEthBalance() {
      const currencyBalance = new BigNumber(this.balance).toFixed(2);
      return `${currencyBalance} ${this.network.type.currencyName}`;
    },
    walletTokensWithBalance() {
      const tokensWithBalance = this.tokens.filter(item => {
        return item.balance !== 'Load' && item.balance > 0;
      });
      let totalTokenAmt = 0;
      const tokensWithDollarAmt = [];
      tokensWithBalance.forEach(item => {
        if (this.prices[item.symbol]) {
          totalTokenAmt +=
            this.prices[item.symbol].quotes.USD.price * item.balance;
          tokensWithDollarAmt.push({
            tokenMew: item,
            tokenData: this.prices[item.symbol]
          });
        }
      });

      const currencyDollar = new BigNumber(this.balance).times(this.usd);
      const totalWalletBalance = currencyDollar.plus(totalTokenAmt).toNumber();

      return {
        tokens: tokensWithBalance,
        length: tokensWithBalance.length,
        tokensWDollarAmt: tokensWithDollarAmt,
        tokensWDollarAmtLength: tokensWithDollarAmt.length,
        total: this.toDollar(new BigNumber(totalTokenAmt).toNumber()),
        totalWalletBalance: this.toDollar(totalWalletBalance)
      };
    }
  },
  watch: {
    search(newVal) {
      this.loading = true;
      if (newVal !== '') {
        this.localTokenVersion = this.tokens.slice().filter(token => {
          if (token.symbol.toLowerCase().includes(newVal.toLowerCase())) {
            return token;
          }
        });

        this.localCustomTokens = this.customTokens.slice().filter(token => {
          if (token.symbol.toLowerCase().includes(newVal.toLowerCase())) {
            return token;
          }
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.localTokenVersion = this.tokens.slice();
        this.localCustomTokens = this.customTokens.slice();
      }
    }
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.fetchTokens);
  },
  mounted() {
    this.fetchTokens();
  },
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.fetchTokens);
  },
  methods: {
    toDollar(val) {
      return `${val
        .toLocaleString('en-GB', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          currencyDisplay: 'symbol'
        })
        .replace('US', '')
        .replace('$', '$ ')}`;
    },
    removeCustomToken(token) {
      const idx = this.customTokens.findIndex(item => {
        return item.address.toLowerCase() === token.address.toLowerCase();
      });
      const storedTokens = store.get('customTokens');
      this.customTokens.splice(idx, 1);
      this.localCustomTokens = this.customTokens.splice();
      storedTokens[this.network.type.name] = this.customTokens;
      store.set('customTokens', storedTokens);
      this.fetchTokens();
    },
    searchBySymbol(symbol) {
      const searchNetwork = this.localTokenVersion.find(item => {
        return item.symbol.toLowerCase() === symbol.toLowerCase();
      });

      const searchCustom = this.customTokens.find(item => {
        return item.symbol.toLowerCase() === symbol.toLowerCase();
      });

      if (searchNetwork !== undefined || searchCustom !== undefined) {
        return false;
      }
      return true;
    },
    searchByAddr(addr) {
      const searchNetwork = this.localTokenVersion.find(item => {
        return (
          utils.toChecksumAddress(item.address) ===
          utils.toChecksumAddress(addr)
        );
      });

      const searchCustom = this.customTokens.find(item => {
        return (
          utils.toChecksumAddress(item.address) ===
          utils.toChecksumAddress(addr)
        );
      });

      if (searchNetwork !== undefined || searchCustom !== undefined) {
        return false;
      }
      return true;
    },
    tokenError(address, symbol, addType) {
      const findTokenBySymbol = this.searchBySymbol(symbol);
      const findTokenByAddr = this.searchByAddr(address);
      if (!findTokenByAddr && addType !== '') {
        this.$refs.tokenModal.$refs.tokenModal.hide();
        Toast.responseHandler(
          'A default or custom token with this contract address already exists!',
          Toast.ERROR
        );
        return false;
      } else if (!findTokenBySymbol && addType !== '') {
        this.$refs.tokenModal.$refs.tokenModal.hide();
        Toast.responseHandler(
          `A default or custom token with this symbol already exists! The token in our list may have the same symbol but a different contract address, try adding it again with a '2' after the symbol!`,
          Toast.ERROR
        );
        return false;
      }
      return findTokenByAddr || findTokenBySymbol;
    },
    async addToken(address, symbol, decimal) {
      if (this.tokenError(address, symbol, 'manual')) {
        const token = {
          address: address,
          decimals: decimal,
          email: '',
          name: symbol,
          symbol: symbol,
          website: '',
          type: 'custom'
        };
        token['balance'] = await this.fetchTokenBalance(token);
        const currentCustomToken = store.get('customTokens');
        this.customTokens =
          this.customTokens.length > 0 ? this.customTokens : [];
        this.customTokens.push(token);
        this.localCustomTokens = this.customTokens.splice();
        currentCustomToken[this.network.type.name] = this.customTokens;
        store.set('customTokens', currentCustomToken);
        this.$refs.tokenModal.$refs.tokenModal.hide();
        this.fetchTokenBalance(token);
        await this.fetchTokens();
        Toast.responseHandler(
          this.$t('mewcx.token-added-success'),
          Toast.SUCCESS
        );
      }
    },
    openAddCustom() {
      this.$refs.tokenModal.$refs.tokenModal.show();
    },
    cancelRemove() {
      this.edit();
      this.$refs.removeWalletModal.$refs.removeWalletModal.hide();
    },
    edit() {
      this.$refs.editModal.$refs.editModal.show();
    },
    async fetchTokenBalance(token) {
      const tokenIndex = this.tokens.findIndex(element => {
        return element.address.toLowerCase() === token.address.toLowerCase();
      });
      const customIdx = this.customTokens.findIndex(element => {
        return element.address.toLowerCase() === token.address.toLowerCase();
      });
      const contractAbi = [
        {
          name: 'balanceOf',
          type: 'function',
          constant: true,
          inputs: [{ name: 'address', type: 'address' }],
          outputs: [{ name: 'out', type: 'uint256' }]
        }
      ];
      const contract = new this.web3.eth.Contract(contractAbi);
      const data = contract.methods.balanceOf(this.address).encodeABI();
      const balance = await this.web3.eth
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
      this.localTokenVersion = this.localTokenVersion.map((item, idx) => {
        if (idx === tokenIndex) {
          item.balance = balance;
        }
        return item;
      });

      this.localCustomTokens = this.localCustomTokens.map((item, idx) => {
        if (idx === customIdx) {
          item.balance = balance;
        }
        return item;
      });

      return balance;
    },
    openRemoveWallet() {
      this.$refs.editModal.$refs.editModal.hide();
      this.$refs.removeWalletModal.$refs.removeWalletModal.show();
    },
    async fetchTokens() {
      this.loading = true;
      let tokens = [];
      const tb = new TokenBalance(this.web3.currentProvider);
      const newLogo = {
        // eslint-disable-next-line
        src: require(`@/assets/images/networks/eth-logo.svg`)
      };
      try {
        tokens = await tb.getBalance(this.address);
        tokens = tokens.map(token => {
          const balance = token.balance;
          delete token.balance;
          token.balance = new BigNumber(balance).gt(0)
            ? new BigNumber(balance)
                .div(new BigNumber(10).pow(token.decimals))
                .toFixed(3)
            : 0;
          token.address = token.addr;
          token['logo'] = newLogo;
          delete token.addr;
          return token;
        });
        this.loading = false;
        this.localTokenVersion = tokens.sort(sortByBalance);
        this.tokens = tokens.sort(sortByBalance);
      } catch (e) {
        tokens = this.network.type.tokens.map(token => {
          token.balance = 'Load';
          token['logo'] = newLogo;
          return token;
        });
        this.loading = false;
        this.tokens = tokens;
        this.localTokenVersion = tokens;
      }
      this.getCustomTokens();
    },
    getCustomTokens() {
      if (store.get('localTokens') !== undefined) {
        this.getV3Tokens();
      }
      const storedTokens = store.get('customTokens') || {};
      const tokens = storedTokens.hasOwnProperty(this.network.type.name)
        ? storedTokens[this.network.type.name]
        : [];

      this.customTokens = tokens.map(token => {
        const newLogo = {
          // eslint-disable-next-line
          src: require(`@/assets/images/networks/eth-logo.svg`)
        };
        token['logo'] = newLogo;
        return token;
      });

      this.localCustomTokens = this.customTokens.slice();
    },
    getV3Tokens() {
      const v3Tokens = store.get('localTokens');
      const v5CustomTokens = store.get('customTokens');
      v3Tokens.forEach(token => {
        const newObj = {
          address: token.contractAddress,
          decimals: token.decimal,
          email: '',
          name: token.symbol,
          symbol: token.symbol,
          website: '',
          type: 'custom'
        };
        Object.keys(networkTypes).forEach(network => {
          if (
            token.network &&
            (networkTypes[network].name.toLowerCase() ===
              token.network.toLowerCase() ||
              networkTypes[network].name_long.toLowerCase() ===
                token.network.toLowerCase())
          ) {
            if (this.tokenError(newObj.address, newObj.symbol, '')) {
              v5CustomTokens[networkTypes[network].name].push(newObj);
            }
          }
        });
      });
      store.set('customTokens', v5CustomTokens);
      store.remove('localTokens');
    },
    copyAddress() {
      this.$refs.addressInput.select();
      document.execCommand('copy');
      Toast.responseHandler(this.$t('mewcx.copy-success'), Toast.SUCCESS);
    },
    viewAllTokens(bool) {
      if (bool) {
        this.$refs.viewAllModal.show();
      } else {
        this.$refs.viewAllModal.hide();
      }
    }
  }
};
</script>

<style lang="scss">
@import '~@/scss/GlobalVariables';

.show {
  .wallet-options-toggle {
    background: none !important;
  }
}

.wallet-options-toggle {
  border: none;
  background: none !important;
  padding: 0;
}

.wallet-options-menu {
  padding: 10px;
  min-width: 60px;

  .b-dropdown-text {
    text-align: center !important;
    color: $dark-blue-2 !important;
    font-weight: normal !important;
    cursor: pointer;
  }
  .remove-text {
    p {
      color: $red-5 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
@import 'WalletInfoComponent.scss';
</style>
