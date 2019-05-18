<template>
  <div class="wallet-info-container">
    <edit-wallet-modal
      ref="editModal"
      :address="address"
      :name="parsedWallet.nick"
      :wallet="parsedWallet"
      :remove-wallet="openRemoveWallet"
    />
    <remove-wallet-modal
      ref="removeWalletModal"
      :cancel-remove="cancelRemove"
      :wallet-type="parsedWallet.type"
      :nickname="parsedWallet.nick"
      :address="address"
    />
    <b-modal ref="viewAllModal" hide-footer hide-header class="cx-token-modal">
      <div class="modal-header-contaier">
        <div>
          <h3>
            All Tokens
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
        <input v-model="search" placeholder="Search tokens" />
        <i class="fa fa-search" />
      </div>
      <div class="modal-tokens-container">
        <div v-show="loading" class="loading-container">
          <i class="fa fa-spinner fa-spin" /> Loading Tokens...
        </div>
        <div v-show="!loading" class="tokens-container">
          <div
            v-for="token in localVersion"
            :key="token.address"
            class="modal-token-item"
          >
            <div class="icon-name-container">
              <img :src="token.icon" />
              <p>
                {{ token.symbol }} <br />
                <span>{{ token.balance }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <div class="nickname-and-buttons">
      <p>
        {{ parsedWallet.nick }}
      </p>
      <div class="button-container">
        <div v-show="walletType !== 'watchOnly'" @click="access">Access</div>
        <div v-show="walletType !== 'watchOnly'" @click="detail">Detail</div>
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
              <input ref="addressInput" :value="address" />
            </div>
          </div>
          <div class="copy-button">
            <p @click="copyAddress">Copy</p>
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
          <p
            class="view"
            @click="
              () => {
                viewAllTokens(true);
              }
            "
          >
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
              <p>
                <img :src="token.icon" />
                {{ token.symbol }}
              </p>
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
import EditWalletModal from '../EditWalletModal';
import RemoveWalletModal from '../RemoveWalletModal';

export default {
  components: {
    blockie: Blockie,
    'edit-wallet-modal': EditWalletModal,
    'remove-wallet-modal': RemoveWalletModal
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
          if (token.symbol.toLowerCase().includes(newVal.toLowerCase())) {
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
    cancelRemove() {
      this.edit();
      this.$refs.removeWalletModal.$refs.removeWalletModal.hide();
    },
    edit() {
      this.$refs.editModal.$refs.editModal.show();
    },
    openRemoveWallet() {
      this.$refs.editModal.$refs.editModal.hide();
      this.$refs.removeWalletModal.$refs.removeWalletModal.show();
    },
    async fetchTokens() {
      this.loading = true;
      let tokens = [];
      const tb = new TokenBalance(window.web3.currentProvider);
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
          try {
            // eslint-disable-next-line
            token.icon = require(`@/assets/images/currency/coins/${token.symbol.toLowerCase()}.svg`);
          } catch (e) {
            token.icon = require('@/assets/images/currency/eth.svg');
          }
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
    },
    copyAddress() {
      this.$refs.addressInput.select();
      window.execCommand('copy');
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

<style lang="scss" scoped>
@import 'WalletInfoComponent.scss';
</style>
