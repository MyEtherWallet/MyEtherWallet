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
    <b-modal
      ref="viewAllModal"
      hide-footer
      hide-header
      modal-class="cx-token-modal"
    >
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
            v-for="(token, idx) in localVersion"
            :key="token.address + address + idx"
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
        <div
          v-show="walletType !== 'watchOnly'"
          class="clickable"
          @click="
            () => {
              access(wallet, 'access');
            }
          "
        >
          Access
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
          Details
        </div>
        <div class="clickable" @click="edit">Edit</div>
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
          <p class="actual-balance">{{ balance }} <span>{{ network.type.name }}</span></p>
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
              v-for="(token, idx) in localVersion"
              :key="token.address + idx"
              class="token-item"
            >
              <p>
                {{ token.symbol }}
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
import { mapState } from 'vuex';
import { Toast } from '@/helpers';

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
    ...mapState(['web3', 'network']),
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
    async fetchTokenBalance(token) {
      const tokenIndex = this.tokens.findIndex(element => {
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
      this.localVersion = this.localVersion.map((item, idx) => {
        if (idx === tokenIndex) {
          item.balance = balance;
        }
        return item;
      });
    },
    openRemoveWallet() {
      this.$refs.editModal.$refs.editModal.hide();
      this.$refs.removeWalletModal.$refs.removeWalletModal.show();
    },
    async fetchTokens() {
      this.loading = true;
      let tokens = [];
      const tb = new TokenBalance(this.web3.currentProvider);
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
