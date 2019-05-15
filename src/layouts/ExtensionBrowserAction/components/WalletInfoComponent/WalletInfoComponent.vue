<template>
  <div class="wallet-info-container">
    <div class="nickname-and-buttons">
      <p>
        {{ parsedWallet.nick }}
      </p>
      <div class="button-container">
        <div @click="access">Access</div>
        <div @click="detail">Detail</div>
        <div @click="edit">Edit</div>
      </div>
    </div>
    <div class="wallet-content">
      <div class="address-and-balance-container">
        <div class="address-content-container">
          <div class="address-info">
            <blockie :address="address" width="70px" height="70px" />
            <div class="actual-address">
              <p>Address</p>
              <p>{{ address }}</p>
            </div>
          </div>
          <div class="copy-button">
            <p>Copy</p>
          </div>
        </div>
        <div class="balance-container">
          <p>Balance</p>
          <p class="actual-balance">{{ balance }} <span>ETH</span></p>
        </div>
      </div>
      <div class="tokens-container">
        <div class="tokens-header">
          <p>
            Tokens
            <i class="fa fa-repeat fa-lg" @click="fetchTokens" />
          </p>
          <p class="view">
            View All
          </p>
        </div>
        <div class="token-search-container">
          <input v-model="search" placeholder="Search tokens" />
          <i class="fa fa-search" />
        </div>
        <div class="actual-tokens-container">
          <div v-show="loading" class="loading-container">
            <i class="fa fa-spinner fa-spin" /> Loading Tokens...
          </div>
          <div v-show="!loading">
            <div
              v-for="token in localVersion"
              :key="token.address"
              class="token-item"
            >
              <p>{{ token.name }}</p>
              <p>{{ token.balance }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import TokenBalance from '@myetherwallet/eth-token-balance';
import { ETH } from '@/networks/types';
import sortByBalance from '@/helpers/sortByBalance.js';
import BigNumber from 'bignumber.js';

export default {
  components: {
    blockie: Blockie
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
      default: 'Sample Name'
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
    edit: {
      type: Function,
      default: () => {}
    },
    balance: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tokens: [],
      search: '',
      localVersion: []
    };
  },
  computed: {
    parsedWallet() {
      return JSON.parse(this.wallet);
    }
  },
  watch: {
    search(newVal) {
      const oldVersion = this.tokens.slice();
      this.loading = true;
      if (newVal !== '') {
        this.localVersion = oldVersion.filter(token => {
          if (token.name.toLowerCase().includes(newVal.toLowerCase())) {
            return token;
          }
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.localVersion = this.tokens;
      }
    }
  },
  mounted() {
    this.fetchTokens();
  },
  methods: {
    async fetchTokens() {
      this.loading = true;
      let tokens = [];
      const tb = new TokenBalance(window.web3.currentProvider);
      try {
        tokens = await tb.getBalance(this.address);
        tokens = tokens.map(token => {
          const balance = token.balance;
          delete token.balance;
          token.balance = new BigNumber(balance)
            .div(new BigNumber(10).pow(token.decimals))
            .toFixed();
          token.address = token.addr;
          delete token.addr;
          return token;
        });
        this.loading = false;
        this.localVersion = tokens.sort(sortByBalance);
        this.tokens = tokens.sort(sortByBalance);
      } catch (e) {
        tokens = ETH.tokens.map(token => {
          token.balance = 'Load';
          return token;
        });
        this.loading = false;
        this.tokens = tokens;
        this.localVersion = tokens;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletInfoComponent.scss';
</style>
