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
    <div v-if="loading" class="loading-container">
      <div>
        <i class="fa fa-lg fa-spin fa-spinner" />
      </div>
      <p>Loading wallets....</p>
    </div>
    <div v-else-if="!hasAccounts" class="no-wallet-found">
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
                    :wallet="wallet.wallet"
                    :nickname="wallet.nickname"
                    :wallet-type="wallet.type"
                    @balanceUpdate="addToTotal"
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
                    :wallet="wallet.wallet"
                    :nickname="wallet.nickname"
                    :wallet-type="wallet.type"
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
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { toChecksumAddress } from '@/helpers/addressUtils';
import WalletInfoComponent from '../../components/WalletInfoComponent';
import WalletTitleAndSearchComponent from '../../components/WalletTitleAndSearchComponent';
import AddWalletModal from '../../components/AddWalletModal';
import ExtensionBrowserActionWrapper from '../../wrappers/ExtensionBrowserActionWrapper';
import { ExtensionHelpers, Misc } from '@/helpers';

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
      allAccounts: [],
      watchOnlyAddresses: [],
      myWallets: [],
      totalBalance: 0,
      search: '',
      showMyWallets: 0
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'linkQuery']),
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
      this.loading;
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
    myWallets: {
      handler: newVal => {
        if (newVal.length === 0 && this.watchOnlyAddresses.length > 0) {
          this.showMyWallets = 0;
        }
        this.myWallets = newVal;
      },
      deep: true
    },
    watchOnlyAddresses: {
      handler: newVal => {
        if (newVal.length === 0 && this.myWallets.length > 0) {
          this.showMyWallets = 1;
        }
        this.watchOnlyAddresses = newVal;
      },
      deep: true
    },
    wallets(newVal) {
      this.totalBalance = 0;
      this.processAccounts(newVal);
    },
    network() {
      this.totalBalance = 0;
      this.processAccounts(this.wallets);
    }
  },
  mounted() {
    if (this.linkQuery.hasOwnProperty('connectionRequest')) {
      this.addWallet();
    }
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
    addToTotal(e) {
      const total = BigNumber(this.totalBalance).plus(e);
      this.totalBalance = total;
    },
    processAccounts(accs) {
      if (accs.length > 0) {
        this.loading = true;
        const accounts = [];
        for (const account of accs) {
          if (account !== undefined) {
            const address = toChecksumAddress(account.address).toLowerCase();
            delete account['address'];
            const parsedItemWallet = JSON.parse(account.wallet);
            account['type'] = parsedItemWallet.type;
            account['address'] = address;
            account['nickname'] = parsedItemWallet.nick;
            accounts.push(account);
          }
        }

        this.myWallets = accounts.filter(item => {
          return item.type !== WATCH_ONLY;
        });
        this.watchOnlyAddresses = accounts.filter(item => {
          return item.type === WATCH_ONLY;
        });

        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    addWallet() {
      this.$refs.addWalletModal.$refs.addMyWallet.$refs.modalWrapper.show();
    },
    addWatchOnlyWalletCb(hasError) {
      this.loading = false;
      if (!hasError) {
        this.$refs.watchOnlyModal.$refs.watchOnlyWallet.$refs.modalWrapper.hide();
        this.$eventHub.$emit(
          'showSuccessModal',
          'Successfully added a watch only wallet!'
        );
      }
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
