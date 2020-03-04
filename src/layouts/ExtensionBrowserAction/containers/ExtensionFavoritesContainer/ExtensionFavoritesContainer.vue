<template>
  <extension-browser-action-wrapper>
    <template v-if="hasAccounts" v-slot:header>
      <wallet-title-and-search-component
        title="Favorites"
        @search="e => (search = e)"
      />
    </template>
    <div v-if="!hasAccounts" class="no-wallet-container">
      <img src="@/assets/images/icons/alien.png" />
      <h3>
        Looks like you don't have any favorite wallets yet. Click the heart next
        to your favorite wallet to save it here!
      </h3>

      <div class="wallet-options">
        <b-button
          class="large-round-button-green-filled"
          router-tag="button"
          to="/"
        >
          Go to My Wallets
        </b-button>
      </div>
    </div>
    <div v-else>
      <div v-for="wallet in searchResult" :key="wallet.address + 'favorites'">
        <wallet-info-component
          :prices="tokenPrices"
          :usd="ethPrice"
          :address="wallet.address"
          :balance="wallet.balance"
          :wallet="wallet.wallet"
          :nickname="wallet.nickname"
          :wallet-type="wallet.type"
          :wallet-token="wallet.tokenBalance"
          page="favorites"
        />
      </div>
    </div>
  </extension-browser-action-wrapper>
</template>

<script>
import web3utils from 'web3-utils';
import { mapState } from 'vuex';
import { toChecksumAddress } from '@/helpers/addressUtils';
import WalletInfoComponent from '../../components/WalletInfoComponent';
import WalletTitleAndSearchComponent from '../../components/WalletTitleAndSearchComponent';
import ExtensionBrowserActionWrapper from '../../wrappers/ExtensionBrowserActionWrapper';
import sortByBalance from '@/helpers/sortByBalance.js';
import BigNumber from 'bignumber.js';
import TokenBalance from '@myetherwallet/eth-token-balance';

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
    window.chrome.storage.onChanged.addListener(changed => {
      if (changed && changed.hasOwnProperty('favorites')) {
        this.processAccounts(this.wallets);
      }
    });
  },
  methods: {
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
    async processAccounts(accs) {
      this.loading = true;
      const accounts = [];
      for await (const account of accs) {
        if (account !== undefined) {
          const address = toChecksumAddress(account.address).toLowerCase();
          delete account['address'];
          const parsedItemWallet = JSON.parse(account.wallet);
          account['balance'] = await this.getBalance(address);
          account['type'] = parsedItemWallet.type;
          account['address'] = address;
          account['nickname'] = parsedItemWallet.nick;
          this.setToken(address).then(res => {
            account['tokenBalance'] = res;
          });
          accounts.push(account);
        }
      }
      window.chrome.storage.sync.get('favorites', item => {
        if (Object.keys(item).length > 0) {
          const storedFaves = JSON.parse(item.favorites);
          const favoritedWallets = [];
          storedFaves.forEach(storedAcc => {
            const actualAccount = accounts.find(wallet => {
              return (
                toChecksumAddress(wallet.address).toLowerCase() ===
                toChecksumAddress(storedAcc.address).toLowerCase()
              );
            });

            if (actualAccount) {
              favoritedWallets.push(actualAccount);
            }
          });
          this.favoriteWallets = favoritedWallets;
        }
      });
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
