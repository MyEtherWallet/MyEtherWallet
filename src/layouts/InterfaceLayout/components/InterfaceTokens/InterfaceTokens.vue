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
        <div ref="tokenTableContainer" class="token-table-container">
          <table v-show="customTokens.length > 0">
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

          <table v-show="localTokens.length > 0">
            <tr v-for="(token, index) in localTokens" :key="token.name + index">
              <td>{{ token.name }}</td>
              <td
                v-if="token.balance === 'Load'"
                class="load-token"
                @click="getSpecificTokenBalance(token, index)"
              >
                {{ token.balance }}
              </td>
              <td v-else>{{ token.balance }}</td>
            </tr>
          </table>

          <div
            v-show="search === '' && localTokens.length === 0 && receivedTokens"
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
      <div class="bottom-image-container">
        <img class="icon" src="~@/assets/images/etc/mewconnectad.png" />
      </div>
    </div>
  </div>
</template>

<script>
import store from 'store';
import { mapGetters } from 'vuex';
import InterfaceTokensModal from '../InterfaceTokensModal';
import sortByBalance from '@/helpers/sortByBalance.js';
import utils from 'web3-utils';

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
    triggerAlert: {
      type: Function,
      default: function() {}
    },
    fetchTokens: {
      type: Function,
      default: function() {}
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
    ...mapGetters({
      network: 'network'
    })
  },
  watch: {
    tokens(newVal) {
      this.assignTokens(newVal, this.search);
    },
    search(newVal) {
      this.assignTokens(this.tokens, newVal);
    },
    customTokens(newVal) {
      this.customTokens = newVal;
    },
    network(newVal) {
      if (
        store.get('customTokens') !== undefined &&
        store.get('customTokens')[newVal.type.name] !== undefined
      ) {
        this.customTokens = store.get('customTokens')[newVal.type.name];
      } else {
        this.customTokens = [];
      }
    }
  },
  mounted() {
    this.assignTokens(this.tokens, this.search);
  },
  methods: {
    async getSpecificTokenBalance(token, idx) {
      this.tokens[idx].balance = await this.getTokenBalance(token);
      this.tokens.sort(sortByBalance);
    },
    addTokenModal() {
      this.$refs.tokenModal.$refs.token.show();
    },
    removeToken(idx) {
      const storedTokens = store.get('customTokens');
      this.customTokens.splice(idx, 1);
      storedTokens[this.network.type.name] = this.customTokens;
      store.set('customTokens', storedTokens);
    },
    async addToken(address, symbol, decimal) {
      if (
        this.localTokens.find(item => {
          return (
            utils.toChecksumAddress(item.address) ===
            utils.toChecksumAddress(address)
          );
        }) !== undefined
      ) {
        const localStorageName = {};
        const token = {
          address: address,
          decimals: decimal,
          email: '',
          name: symbol,
          symbol: symbol,
          website: '',
          type: 'custom'
        };
        let newArray = [];
        token['balance'] = await this.getTokenBalance(token);
        if (token['balance'] === undefined) {
          // eslint-disable-next-line
          console.error('Token Balance Returned Undefined');
        }

        if (this.customTokens.length > 0) {
          newArray = this.customTokens.map(item => item);
        }
        newArray.push(token);
        this.customTokens = newArray;
        localStorageName[this.network.type.name] = this.customTokens;

        store.set('customTokens', localStorageName);
        this.$refs.tokenModal.$refs.token.hide();
        this.triggerAlert('Successfully added token!');
      } else {
        this.$refs.tokenModal.$refs.token.hide();
        this.triggerAlert('Token Already Exists!', 'danger');
      }
    },
    tokenListExpend() {
      this.$refs.tokenTableContainer.classList.toggle('expanded');
      this.$refs.expendDown.classList.toggle('hidden');
      this.$refs.expendUp.classList.toggle('hidden');
    },
    async assignTokens(arr, query) {
      const oldArray = this.customTokens.slice();
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
        if (
          store.get('customTokens') !== undefined &&
          store.get('customTokens')[this.network.type.name] !== undefined
        ) {
          this.customTokens = store.get('customTokens')[this.network.type.name];
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceTokens.scss';
</style>
