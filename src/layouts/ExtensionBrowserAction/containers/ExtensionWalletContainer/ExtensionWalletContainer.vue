<template>
  <extension-browser-action-wrapper>
    <template v-if="hasAccounts" v-slot:header>
      <wallet-title-and-search-component
        title="All Wallets"
        @search="e => (search = e)"
      />
    </template>
    <watch-only-modal
      ref="watchOnlyModal"
      :add-watch-only="addWatchOnlyWallet"
      :loading="loading"
    />

    <div v-if="!hasAccounts" class="no-wallet-found">
      <div class="text-and-img-container">
        <img src="@/assets/images/icons/alien.png" />
        <p>No wallet found, please...</p>
      </div>
      <div class="wallet-options">
        <button class="large-round-button-green-filled">
          Add My Wallet
        </button>
        <div class="button-border-container">
          <div class="button-border"></div>
          <span> OR </span>
          <div class="button-border"></div>
        </div>
        <button
          class="large-round-button-green-filled"
          @click="openWatchOnlyModal"
        >
          Add Watch Only Address
        </button>
      </div>
    </div>
    <div v-else>
      <div class="wallet-containers">
        <div class="wallet-container-header">
          <div class="add-and-wallet-count">
            <p>
              Total of
              {{
                showMyWallets === 0
                  ? myWallets.length
                  : watchOnlyAddresses.length
              }}
              wallets
            </p>
            <div
              class="add-wallet-button"
              @click="showMyWallets === 0 ? () => {} : openWatchOnlyModal()"
            >
              <i class="fa fa-plus" />
              Add
            </div>
          </div>
          <b-tabs
            v-model="showMyWallets"
            nav-class="wallet-nav"
            active-nav-item-class="wallet-nav-active"
            nav-wrapper-class="wallet-nav-wrapper"
          >
            <b-tab title="My Wallets" title-link-class="tab-default-style">
              <div v-if="myWallets.length > 0" class="wallet-display-container">
                <div
                  v-if="network.type.name === 'ETH'"
                  class="total-balance-container"
                >
                  <div>
                    <p class="portfolio-text">My Portfolio Balance</p>
                  </div>
                  <div>
                    <p class="total-amt">{{ totalDollarAmount }}</p>
                    <p class="eth-amt">
                      {{ totalBalance }} {{ network.type.currencyName }}
                    </p>
                  </div>
                </div>
                <keep-alive>
                  <wallet-info-component
                    v-for="wallet in searchResult"
                    :key="wallet.address"
                    :usd="ethPrice"
                    :address="wallet.address"
                    :balance="wallet.balance"
                    :wallet="wallet.wallet"
                    :nickname="wallet.nickname"
                    :wallet-type="wallet.type"
                    :prices="tokenPrices"
                  />
                </keep-alive>
              </div>
              <div v-else class="wallet-display-container">
                <div class="no-wallet-found empty-wallet">
                  <div class="text-and-img-container">
                    <img src="@/assets/images/icons/alien.png" />
                    <p>No wallet found, please...</p>
                  </div>
                  <div class="wallet-options">
                    <button class="large-round-button-green-filled">
                      Add My Wallet
                    </button>
                  </div>
                </div>
              </div>
            </b-tab>
            <b-tab
              title="Watch Only Address"
              title-link-class="tab-default-style"
            >
              <div
                v-if="watchOnlyAddresses.length > 0"
                class="wallet-display-container"
              >
                <keep-alive>
                  <wallet-info-component
                    v-for="wallet in searchResult"
                    :key="wallet.address"
                    :usd="ethPrice"
                    :address="wallet.address"
                    :balance="wallet.balance"
                    :wallet="wallet.wallet"
                    :nickname="wallet.nickname"
                    :wallet-type="wallet.type"
                    :prices="tokenPrices"
                  />
                </keep-alive>
              </div>
              <div v-else class="wallet-display-container">
                <div class="no-wallet-found empty-wallet">
                  <div class="text-and-img-container">
                    <img src="@/assets/images/icons/alien.png" />
                    <p>No wallet found, please...</p>
                  </div>
                  <div class="wallet-options">
                    <button
                      class="large-round-button-green-filled"
                      @click="openWatchOnlyModal"
                    >
                      Add Watch Only Address
                    </button>
                  </div>
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </extension-browser-action-wrapper>
</template>

<script>
import WatchOnlyModal from '../../components/WatchOnlyModal';
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { toChecksumAddress } from '@/helpers/addressUtils';
import WalletInfoComponent from '../../components/WalletInfoComponent';
import WalletTitleAndSearchComponent from '../../components/WalletTitleAndSearchComponent';
import ExtensionBrowserActionWrapper from '../../wrappers/ExtensionBrowserActionWrapper';
import { ExtensionHelpers, Misc } from '@/helpers';
export default {
  components: {
    'watch-only-modal': WatchOnlyModal,
    'wallet-info-component': WalletInfoComponent,
    'wallet-title-and-search-component': WalletTitleAndSearchComponent,
    'extension-browser-action-wrapper': ExtensionBrowserActionWrapper
  },
  props: {
    tokenPrices: {
      type: Object,
      default: () => {}
    },
    ethPrice: {
      type: Number,
      default: 0
    },
    wallets: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      watchOnlyAddresses: [],
      myWallets: [],
      totalBalance: '0',
      file: '',
      path: '',
      password: '',
      nickname: '',
      search: '',
      showMyWallets: 0
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network']),
    hasAccounts() {
      return this.wallets.length > 0;
    },
    totalDollarAmount() {
      const totalDollarAmt = new BigNumber(this.totalBalance).times(
        this.ethPrice
      );
      return Misc.toDollar(totalDollarAmt.toNumber());
    },
    searchResult() {
      if (this.search !== '') {
        if (this.showMyWallets === 0) {
          const searchedArray = this.myWallets.filter(item => {
            return (
              item.address.toLowerCase().includes(this.search.toLowerCase()) ||
              item.nickname.toLowerCase().includes(this.search.toLowerCase())
            );
          });
          return searchedArray;
        }
        const searchedArray = this.watchOnlyAddresses.filter(item => {
          return (
            item.address.toLowerCase().includes(this.search.toLowerCase()) ||
            item.nickname.toLowerCase().includes(this.search.toLowerCase())
          );
        });
        return searchedArray;
      }
      return this.showMyWallets === 0
        ? this.myWallets
        : this.watchOnlyAddresses;
    },
    convertedBalance() {
      return `$ ${new BigNumber(this.ethPrice)
        .times(this.totalBalance)
        .toFixed(2)}`;
    }
  },
  watch: {
    watchOnlyAddresses(newVal) {
      if (newVal.length === 0 && this.myWallets.length > 0) {
        this.showMyWallets = 0;
      }
    },
    myWallets(newVal) {
      if (newVal.length === 0 && this.watchOnlyAddresses.length > 0) {
        this.showMyWallets = 1;
      }
    },
    wallets(newVal) {
      this.processAccounts(newVal);
    },
    network() {
      this.processAccounts(this.wallets);
    }
  },
  mounted() {
    this.$refs.watchOnlyModal.$refs.watchOnlyWallet.$on('hidden', () => {
      this.loading = false;
    });
  },
  methods: {
    togglePasswordModal(file, path, nickname) {
      const parseFile = JSON.parse(file);
      this.file = JSON.parse(parseFile.priv);
      if (typeof nickname !== 'undefined') {
        this.nickname = nickname.length > 0 ? nickname : null;
      }
      this.path = path;
      this.$refs.passwordOnlyModal.$refs.passwordOnlyModal.show();
    },
    async processAccounts(accs) {
      this.totalBalance = '0';
      this.loading = true;
      let balance = new BigNumber(this.totalBalance);
      const watchOnlyAddresses = [];
      const myWallets = [];
      for (const account of accs) {
        if (account !== undefined) {
          const address = toChecksumAddress(account.address).toLowerCase();
          delete account['address'];
          const parsedItemWallet = JSON.parse(account.wallet);
          account['balance'] = await this.getBalance(address);
          account['type'] = parsedItemWallet.type;
          account['address'] = address;
          account['nickname'] = parsedItemWallet.nick;
          if (parsedItemWallet.type !== 'wallet') {
            watchOnlyAddresses.push(account);
          } else {
            balance = balance.plus(new BigNumber(account.balance));
            myWallets.push(account);
          }
        }
      }

      this.totalBalance = balance.toString();
      this.watchOnlyAddresses = watchOnlyAddresses;
      this.myWallets = myWallets;
      if (this.myWallets.length === 0 && this.watchOnlyAddresses.length > 0) {
        this.showMyWallets = 1;
      }
      this.loading = false;
    },
    async getBalance(addr) {
      const balance = await this.web3.eth.getBalance(addr);
      return web3utils.fromWei(balance);
    },
    addWallet() {
      this.$router.push('access-my-wallet');
    },
    addWatchOnlyWalletCb() {
      this.loading = false;
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.$refs.modalWrapper.hide();
      this.$eventHub.$emit(
        'showSuccessModal',
        'Successfully added a watch only wallet!'
      );
    },
    addWatchOnlyWallet(name, address) {
      this.loading = true;
      const newAcc = {};
      const addr = toChecksumAddress(address);
      newAcc[addr] = JSON.stringify({
        nick: name,
        type: WATCH_ONLY
      });
      ExtensionHelpers.addWalletToStore(
        address,
        null,
        name,
        WATCH_ONLY,
        'add',
        this.addWatchOnlyWalletCb
      );
    },
    openWatchOnlyModal() {
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.$refs.modalWrapper.show();
    },
    updatePassword(e) {
      this.password = e;
    }
  }
};
</script>

<style lang="scss">
@import '~@/scss/GlobalVariables';
.wallet-nav-wrapper {
  height: 62px;
}

.wallet-nav {
  border: none !important;
  height: 62px;
  display: flex;
  align-items: center;

  li {
    margin-right: 65px;
  }
}

.wallet-nav-active {
  font-weight: bold;
  border: none !important;
  border-bottom: 2px solid $dark-blue-2 !important;
}

.tab-default-style {
  color: $dark-blue-2 !important;
  font-size: 20px !important;
  border: none;
  background-color: $light-grey-2 !important;
  border-bottom: 2px solid $light-grey-2;
  padding: 0 0 10px;

  &:hover {
    border: none !important;
    border-bottom: 2px solid $dark-blue-2 !important;
  }
}
</style>

<style lang="scss" scoped>
@import 'ExtensionWalletContainer.scss';
</style>
