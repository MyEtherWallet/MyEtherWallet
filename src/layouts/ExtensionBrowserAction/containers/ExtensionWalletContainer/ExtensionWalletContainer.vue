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
        <p>{{ $t('mewcx.no-wallet-found') }}</p>
      </div>
      <div class="wallet-options">
        <button class="large-round-button-green-filled" @click="addWallet">
          {{ $t('mewcx.add-my-wallet') }}
        </button>
        <div class="button-border-container">
          <div class="button-border"></div>
          <span> {{ $t('mewcx.or') }} </span>
          <div class="button-border"></div>
        </div>
        <button
          class="large-round-button-green-filled"
          @click="openWatchOnlyModal"
        >
          {{ $t('mewcx.add-watch-only') }}
        </button>
      </div>
    </div>
    <div v-else>
      <div class="wallet-containers">
        <div class="wallet-container-header">
          <div class="add-and-wallet-count">
            <p>
              {{
                $tc('mewcx.wallet-count', pickTranslations, {
                  total: showLength
                })
              }}
            </p>
            <div
              class="add-wallet-button"
              @click="showMyWallets === 0 ? addWallet() : openWatchOnlyModal()"
            >
              <i class="fa fa-plus" />
              {{ $t('mewcx.add') }}
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
                    <p class="portfolio-text">
                      {{ $t('mewcx.portfolio-balance') }}
                    </p>
                  </div>
                  <div>
                    <p class="total-amt">{{ totalDollarAmount }}</p>
                    <p class="eth-amt">
                      {{ totalBalance }} {{ network.type.currencyName }}
                    </p>
                  </div>
                </div>
                <div
                  v-for="wallet in myWalletsSearchResult"
                  :key="wallet.address"
                >
                  <wallet-info-component
                    :prices="tokenPrices"
                    :usd="ethPrice"
                    :address="wallet.address"
                    :balance="wallet.balance"
                    :wallet="wallet.wallet"
                    :nickname="wallet.nickname"
                    :wallet-type="wallet.type"
                    :wallet-token="wallet.tokenBalance"
                  />
                </div>
              </div>
              <div v-else class="wallet-display-container">
                <div class="no-wallet-found empty-wallet">
                  <div class="text-and-img-container">
                    <img src="@/assets/images/icons/alien.png" />
                    <p>{{ $t('mewcx.no-wallet-found') }}</p>
                  </div>
                  <div class="wallet-options">
                    <button
                      class="large-round-button-green-filled"
                      @click="addWallet"
                    >
                      {{ $t('mewcx.add-my-wallet') }}
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
                <div
                  v-for="wallet in watchOnlySearchResult"
                  :key="wallet.address"
                >
                  <wallet-info-component
                    :prices="tokenPrices"
                    :usd="ethPrice"
                    :address="wallet.address"
                    :balance="wallet.balance"
                    :wallet="wallet.wallet"
                    :nickname="wallet.nickname"
                    :wallet-type="wallet.type"
                    :wallet-token="wallet.tokenBalance"
                  />
                </div>
              </div>
              <div v-else class="wallet-display-container">
                <div class="no-wallet-found empty-wallet">
                  <div class="text-and-img-container">
                    <img src="@/assets/images/icons/alien.png" />
                    <p>{{ $t('mewcx.no-wallet-found') }}</p>
                  </div>
                  <div class="wallet-options">
                    <button
                      class="large-round-button-green-filled"
                      @click="openWatchOnlyModal"
                    >
                      {{ $t('mewcx.add-watch-only') }}
                    </button>
                  </div>
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
    <add-wallet-modal ref="addWalletModal" :usd="ethPrice" />
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
import AddWalletModal from '../../components/AddWalletModal';
import ExtensionBrowserActionWrapper from '../../wrappers/ExtensionBrowserActionWrapper';
import { ExtensionHelpers, Misc, Toast } from '@/helpers';
import TokenBalance from '@myetherwallet/eth-token-balance';
import sortByBalance from '@/helpers/sortByBalance.js';

export default {
  components: {
    'watch-only-modal': WatchOnlyModal,
    'wallet-info-component': WalletInfoComponent,
    'wallet-title-and-search-component': WalletTitleAndSearchComponent,
    'extension-browser-action-wrapper': ExtensionBrowserActionWrapper,
    'add-wallet-modal': AddWalletModal
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
      search: '',
      showMyWallets: 0
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network']),
    showLength() {
      return this.showMyWallets === 0
        ? this.myWallets.length
        : this.watchOnlyAddresses.length;
    },
    pickTranslations() {
      if (this.showMyWallets === 0) {
        return this.myWallets.length > 1 ? 2 : 1;
      }
      return this.watchOnlyAddresses.length > 1 ? 2 : 1;
    },
    hasAccounts() {
      return this.wallets.length > 0;
    },
    totalDollarAmount() {
      const totalDollarAmt = new BigNumber(this.totalBalance).times(
        this.ethPrice
      );
      return Misc.toDollar(totalDollarAmt.toNumber());
    },
    myWalletsSearchResult() {
      if (this.search !== '') {
        const searchedArray = this.myWallets.filter(item => {
          return (
            item.address.toLowerCase().includes(this.search.toLowerCase()) ||
            item.nickname.toLowerCase().includes(this.search.toLowerCase())
          );
        });
        return searchedArray;
      }

      return this.myWallets;
    },
    watchOnlySearchResult() {
      if (this.search !== '') {
        const searchedArray = this.watchOnlyAddresses.filter(item => {
          return (
            item.address.toLowerCase().includes(this.search.toLowerCase()) ||
            item.nickname.toLowerCase().includes(this.search.toLowerCase())
          );
        });
        return searchedArray;
      }
      return this.watchOnlyAddresses;
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
    this.$refs.watchOnlyModal.$refs.watchOnlyWallet.$refs.modalWrapper.$on(
      'hidden',
      () => {
        this.loading = false;
      }
    );

    if (this.wallets.length > 0) {
      this.processAccounts(this.wallets);
    }
  },
  methods: {
    async processAccounts(accs) {
      this.totalBalance = '0';
      this.loading = true;
      let balance = new BigNumber(this.totalBalance);
      const watchOnlyAddresses = [];
      const myWallets = [];
      for await (const account of accs) {
        if (account !== undefined) {
          const address = toChecksumAddress(account.address).toLowerCase();
          delete account['address'];
          const parsedItemWallet = JSON.parse(account.wallet);
          account['type'] = parsedItemWallet.type;
          account['address'] = address;
          account['nickname'] = parsedItemWallet.nick;
          await this.setToken(address).then(res => {
            account['tokenBalance'] = res;
          });
          await this.getBalance(address)
            .then(res => {
              const locBalance = web3utils.fromWei(res);
              account['balance'] = new BigNumber(locBalance).toString();
              balance = balance.plus(locBalance);
              if (parsedItemWallet.type === 'wallet') {
                this.totalBalance = balance.toString();
              }
            })
            .catch(() => {
              Toast.responseHandler(
                this.$t('mewcx.balance-fetch-error'),
                Toast.WARN
              );
              account['balance'] = 0;
            });
          if (parsedItemWallet.type !== 'wallet') {
            watchOnlyAddresses.push(account);
          } else {
            myWallets.push(account);
          }
        }
      }

      this.watchOnlyAddresses = watchOnlyAddresses;
      this.myWallets = myWallets;
      if (this.myWallets.length === 0 && this.watchOnlyAddresses.length > 0) {
        this.showMyWallets = 1;
      }
      this.loading = false;
    },
    setToken(address) {
      const tokens = [];
      const tb = new TokenBalance(this.web3.currentProvider);
      const newLogo = {
        // eslint-disable-next-line
          src: require(`@/assets/images/networks/eth-logo.svg`)
      };
      return tb
        .getBalance(address)
        .then(res => {
          res.forEach(token => {
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
            tokens.push(token);
          });
          this.loading = false;
          return tokens.sort(sortByBalance);
        })
        .catch(() => {
          this.network.type.tokens.map(token => {
            token.balance = 'Load';
            token['logo'] = newLogo;
            tokens.push(token);
          });
          this.loading = false;
          return tokens;
        });
    },
    getBalance(addr) {
      return this.web3.eth.getBalance(addr);
    },
    addWallet() {
      this.$refs.addWalletModal.$refs.addMyWallet.$refs.modalWrapper.show();
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
  border-bottom: 2px solid $light-grey-2 !important;
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
