<template>
  <div class="transaction-tokens">
    <interface-tokens-modal ref="tokenModal" :add-token="addToken" />
    <div class="wrap">
      <div class="tokens-container">
        <div class="token-search">
          <div class="block-title">
            <div class="title-container">
              <h4>{{ $t('interface.tokens') }}</h4>
              <img
                src="~@/assets/images/icons/change.svg"
                @click="fetchTokens"
              />
            </div>
            <p @click="addTokenModal">+ {{ $t('interface.customToken') }}</p>
          </div>
          <div class="search-block">
            <input v-model="search" placeholder="Search" autocomplete="off" />
            <i class="fa fa-search" aria-hidden="true" />
          </div>
        </div>
        <div v-show="!online" class="cant-load">
          Can't load balances on offline mode
        </div>
        <div ref="tokenTableContainer" class="token-table-container">
          <table v-show="customTokens.length > 0 && receivedTokens">
            <tr
              v-for="(token, index) in customTokens"
              :key="token.name + index"
            >
              <td>{{ token.name }}</td>
              <td>
                {{ token.balance }}
                <i
                  class="fa fa-times-circle clickable"
                  @click="removeToken(index)"
                />
              </td>
            </tr>
          </table>

          <table v-show="localTokens.length > 0 && receivedTokens">
            <tr v-for="(token, index) in localTokens" :key="token.name + index">
              <td>{{ token.name }}</td>
              <td
                v-if="token.balance === 'Load' && online"
                class="load-token"
                @click="online ? getSpecificTokenBalance(token) : () => {}"
              >
                {{ token.balance }}
              </td>
              <td v-else>{{ token.balance }}</td>
            </tr>
          </table>

          <div
            v-show="
              search === '' && localTokens.length === 0 && !receivedTokens
            "
            class="spinner-container"
          >
            <i class="fa fa-spinner fa-spin" />
          </div>
          <div
            v-show="
              search !== '' &&
                localTokens.length === 0 &&
                customTokens.length === 0
            "
            class="spinner-container"
          >
            No tokens found :(
          </div>
        </div>
        <div
          v-if="customTokens.length + localTokens.length > 15"
          class="expend-bar"
          @click="tokenListExpend"
        >
          <p ref="expendDown" class="down">
            <i class="fa fa-angle-double-down" aria-hidden="true" />
          </p>
          <p ref="expendUp" class="up hidden">
            <i class="fa fa-angle-double-up" aria-hidden="true" />
          </p>
        </div>
      </div>
      <div v-show="ads" class="bottom-image-container">
        <a
          rel="noopener noreferrer"
          href="https://mewconnect.myetherwallet.com/#/"
          target="_blank"
        >
          <img class="icon" src="~@/assets/images/etc/mewconnect.jpeg" />
        </a>
      </div>
      <div v-show="!ads" class="address-qr-display">
        <div class="qr-container">
          <qrcode :options="{ size: 100 }" :value="address" />
        </div>
        <div class="address-container">
          <h4>Address QR Code</h4>
          <p>{{ address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'store';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';
import InterfaceTokensModal from '../InterfaceTokensModal';
import sortByBalance from '@/helpers/sortByBalance.js';
import utils from 'web3-utils';
import * as networkTypes from '@/networks/types';

export default {
  components: {
    'interface-tokens-modal': InterfaceTokensModal
  },
  props: {
    tokens: {
      type: Array,
      default: function() {
        return [];
      }
    },
    receivedTokens: {
      type: Boolean,
      default: false
    },
    getTokenBalance: {
      type: Function,
      default: function() {}
    },
    fetchTokens: {
      type: Function,
      default: function() {}
    },
    resetTokenSelection: {
      type: Function,
      default: function() {}
    },
    ads: {
      type: Boolean,
      default: true
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: '',
      localTokens: [],
      customTokens: [],
      util: utils,
      tokenExists: false
    };
  },
  computed: {
    ...mapState(['network', 'web3', 'online'])
  },
  watch: {
    receivedTokens() {
      this.getCustomTokens();
    },
    tokens(newVal) {
      this.assignTokens(newVal, this.search);
      this.getCustomTokens();
    },
    search(newVal) {
      this.assignTokens(this.tokens, newVal);
      this.getCustomTokens();
    }
  },
  methods: {
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
    getCustomTokens() {
      if (store.get('localTokens') !== undefined) {
        this.getV3Tokens();
      }
      const storedTokens = store.get('customTokens') || {};
      this.customTokens = storedTokens.hasOwnProperty(this.network.type.name)
        ? storedTokens[this.network.type.name]
        : [];
    },
    async getSpecificTokenBalance(token) {
      for (let i = 0; i < this.tokens.length; i++) {
        if (
          toChecksumAddress(this.tokens[i].address) ===
          toChecksumAddress(token.address)
        ) {
          this.tokens[i].balance = await this.getTokenBalance(token);
        }
      }
      this.tokens.sort(sortByBalance);
      this.resetTokenSelection();
    },
    addTokenModal() {
      this.$refs.tokenModal.$refs.token.show();
    },
    removeToken(idx) {
      const storedTokens = store.get('customTokens');
      this.customTokens.splice(idx, 1);
      storedTokens[this.network.type.name] = this.customTokens;
      store.set('customTokens', storedTokens);
      this.fetchTokens();
    },
    searchBySymbol(symbol) {
      const searchNetwork = this.localTokens.find(item => {
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
      const searchNetwork = this.localTokens.find(item => {
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
        this.$refs.tokenModal.$refs.token.hide();
        Toast.responseHandler(
          'A default or custom token with this contract address already exists!',
          Toast.ERROR
        );
        return false;
      } else if (!findTokenBySymbol && addType !== '') {
        this.$refs.tokenModal.$refs.token.hide();
        Toast.responseHandler(
          "A default or custom token with this symbol already exists! The token in our list may have the same symbol but a different contract address, try adding it again with a '2' after the symbol!",
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
        const currentCustomToken = store.get('customTokens');
        this.customTokens =
          this.customTokens.length > 0 ? this.customTokens : [];
        this.customTokens.push(token);
        currentCustomToken[this.network.type.name] = this.customTokens;
        store.set('customTokens', currentCustomToken);
        this.$refs.tokenModal.$refs.token.hide();
        await this.fetchTokens();
        Toast.responseHandler('Successfully added token!', Toast.SUCCESS);
      }
    },
    tokenListExpend() {
      this.$refs.tokenTableContainer.classList.toggle('expanded');
      this.$refs.expendDown.classList.toggle('hidden');
      this.$refs.expendUp.classList.toggle('hidden');
    },
    async assignTokens(arr, query) {
      const oldArray = this.customTokens ? this.customTokens.slice() : [];
      if (query !== '') {
        this.customTokens = oldArray
          .filter(token => {
            if (token.name.toLowerCase().includes(query.toLowerCase())) {
              return token;
            }
          })
          .sort(sortByBalance);
        this.localTokens = this.tokens
          .filter(token => {
            if (token.name.toLowerCase().includes(query.toLowerCase())) {
              return token;
            }
          })
          .sort(sortByBalance);
      } else {
        this.localTokens = arr;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceTokens.scss';
</style>
