<template>
  <extension-browser-action-wrapper>
    <template v-if="hasAccounts" v-slot:header>
      <wallet-title-and-search-component
        title="Favorites"
        @search="e => (search = e)"
      />
    </template>
    <div>
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

    <!-- <div v-if="!hasAccounts" class="no-wallet-found">
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
    </div> -->
  </extension-browser-action-wrapper>
</template>

<script>
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
      favoriteWallets: [],
      search: '',
      showMyWallets: 0
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network']),
    hasAccounts() {
      return this.favoriteWallets.length > 0;
    },
    searchResult() {
      if (this.search !== '') {
        const searchedArray = this.favoriteWallets.filter(item => {
          return (
            item.address.toLowerCase().includes(this.search.toLowerCase()) ||
            item.nickname.toLowerCase().includes(this.search.toLowerCase())
          );
        });
        return searchedArray;
      }
      return this.favoriteWallets;
    }
  },
  watch: {
    wallets(newVal) {
      this.processAccounts(newVal);
    },
    network() {
      this.processAccounts(this.wallets);
    }
  },
  mounted() {
    this.processAccounts(this.wallets);
  },
  methods: {
    async processAccounts(accs) {
      this.loading = true;
      console.log(accs);
      window.chrome.storage.sync.get('favorites', item => {
        if (Object.keys(item).length > 0) {
          const storedFaves = JSON.parse(item.favorites);
          const favoritedWallets = [];
          storedFaves.forEach(storedAcc => {
            const actualAccount = accs.find(wallet => {
              return (
                toChecksumAddress(wallet.address).toLowerCase() ===
                toChecksumAddress(storedAcc.address).toLowerCase()
              );
            });

            if (actualAccount) {
              favoritedWallets.push(actualAccount);
            }
          });

          this.favoriteWallets = favoritedWallets.map(account => {
            const address = toChecksumAddress(account.address).toLowerCase();
            delete account['address'];
            const parsedItemWallet = JSON.parse(account.wallet);
            this.web3.eth.getBalance(address).then(res => {
              account['balance'] = web3utils.fromWei(res);
            });
            account['type'] = parsedItemWallet.type;
            account['address'] = address;
            account['nickname'] = parsedItemWallet.nick;
            return account;
          });
        }
      });

      // const watchOnlyAddresses = [];
      // const myWallets = [];
      // for (const account of accs) {
      //   if (account !== undefined) {
      //     const address = toChecksumAddress(account.address).toLowerCase();
      //     delete account['address'];
      //     const parsedItemWallet = JSON.parse(account.wallet);
      //     account['balance'] = await this.getBalance(address);
      //     account['type'] = parsedItemWallet.type;
      //     account['address'] = address;
      //     account['nickname'] = parsedItemWallet.nick;
      //     if (parsedItemWallet.type !== 'wallet') {
      //       watchOnlyAddresses.push(account);
      //     } else {
      //       myWallets.push(account);
      //     }
      //   }
      // }

      // this.totalBalance = balance.toString();
      // this.watchOnlyAddresses = watchOnlyAddresses;
      // this.myWallets = myWallets;
      // if (this.myWallets.length === 0 && this.watchOnlyAddresses.length > 0) {
      //   this.showMyWallets = 1;
      // }
      this.loading = false;
    },
    async getBalance(addr) {
      const balance = await this.web3.eth.getBalance(addr);
      return web3utils.fromWei(balance);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionFavoritesContainer.scss';
</style>
