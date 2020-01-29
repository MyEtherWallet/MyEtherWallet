<template>
  <div class="extension-wallets-container">
    <div class="wallets-container">
      <interface-network-modal ref="network" />
      <watch-only-modal
        ref="watchOnlyModal"
        :add-watch-only="addWatchOnlyWallet"
        :loading="loading"
      />
      <password-only-modal
        ref="passwordOnlyModal"
        :path="path"
        :submit="accessWallet"
        :disabled="validInput"
        :loading="loading"
        @password="updatePassword"
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
        <wallet-title-and-search-component
          title="All Wallets"
          @search="e => (search = e)"
        />
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
                <div
                  v-if="myWallets.length > 0"
                  class="wallet-display-container"
                >
                  <div class="total-balance-container">
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
                      :access="togglePasswordModal"
                      :detail="togglePasswordModal"
                      :prices="prices"
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
                      :access="togglePasswordModal"
                      :detail="togglePasswordModal"
                      :prices="prices"
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
    </div>
  </div>
</template>

<script>
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import WatchOnlyModal from '../../components/WatchOnlyModal';
import PasswordOnlyModal from '../../components/PasswordOnlyModal';
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import { Toast, ExtensionHelpers, Misc } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { mapState, mapActions } from 'vuex';
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal';
import WalletInfoComponent from '../../components/WalletInfoComponent';
import WalletTitleAndSearchComponent from '../../components/WalletTitleAndSearchComponent';
export default {
  components: {
    'watch-only-modal': WatchOnlyModal,
    'password-only-modal': PasswordOnlyModal,
    'interface-network-modal': InterfaceNetworkModal,
    'wallet-info-component': WalletInfoComponent,
    'wallet-title-and-search-component': WalletTitleAndSearchComponent
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
      convertedBalance: '$ 0',
      ethPrice: 0,
      hasAccounts: false,
      search: '',
      showMyWallets: 0,
      prices: {}
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network']),
    totalDollarAmount() {
      const totalDollarAmt = new BigNumber(this.totalBalance).times(
        this.ethPrice
      );
      return Misc.toDollar(totalDollarAmt.toNumber());
    },
    validInput() {
      return (
        (this.password !== '' || this.password.length > 0) &&
        this.walletRequirePass(this.file)
      );
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
    }
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.getAccounts);
  },
  mounted() {
    this.$refs.watchOnlyModal.$refs.watchOnlyWallet.$on('hidden', () => {
      this.loading = false;
    });
    this.fetchTokenRates();
    this.getAccounts();
  },
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.getAccounts);
  },
  methods: {
    ...mapActions('main', [
      'switchNetwork',
      'setWeb3Instance',
      'decryptWallet'
    ]),
    async fetchTokenRates() {
      try {
        const prices = await fetch('https://cryptorates.mewapi.io/ticker')
          .then(res => {
            return res.json();
          })
          .catch(e => {
            console.error(e);
          });
        this.prices = Object.assign({}, prices.data);
      } catch (e) {
        console.error(e);
      }
    },
    clearSearch() {
      this.search = '';
    },
    async fetchEthBalance() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          // eslint-disable-next-line
          console.error(e);
        });

      this.convertedBalance = `$ ${new BigNumber(
        price.data.ETH.quotes.USD.price
      )
        .times(this.totalBalance)
        .toFixed(2)}`;

      this.ethPrice = price.data.ETH.quotes.USD.price;
    },
    getAccountsCb(res) {
      const accounts = Object.keys(res)
        .filter(item => {
          if (isAddress(item)) {
            return item;
          }
        })
        .map(item => {
          const newObj = Object.assign(
            {},
            { address: toChecksumAddress(item), wallet: res[item] }
          );

          return newObj;
        });
      if (accounts.length > 0) {
        this.hasAccounts = true;
        this.processAccounts(accounts);
      } else {
        this.hasAccounts = false;
      }
    },
    getAccounts(changed) {
      if (changed && changed.hasOwnProperty('defNetwork')) {
        const networkProps = JSON.parse(changed['defNetwork'].newValue);
        const network = this.$store.state.main.Networks[networkProps.key].find(
          actualNetwork => {
            return actualNetwork.service === networkProps.service;
          }
        );
        this.switchNetwork(
          !network ? this.$store.state.Networks[networkProps.key][0] : network
        ).then(() => {
          this.setWeb3Instance();
        });
      } else {
        this.setWeb3Instance();
      }
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    },
    walletRequirePass(ethjson) {
      if (ethjson.encseed != null) return true;
      else if (ethjson.Crypto != null || ethjson.crypto != null) return true;
      else if (ethjson.hash != null && ethjson.locked) return true;
      else if (ethjson.hash != null && !ethjson.locked) return false;
      else if (ethjson.publisher == 'MyEtherWallet' && !ethjson.encrypted)
        return false;
      return true;
    },
    accessWallet() {
      this.loading = true;
      const nickname =
        this.nickname !== null && this.nickname.length > 0 ? this.nickname : '';
      const worker = new walletWorker();
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = e => {
        const obj = {
          file: this.file,
          name: e.data.filename
        };

        this.setWallet(
          new WalletInterface(
            Buffer.from(e.data._privKey),
            false,
            keyStoreType,
            nickname,
            JSON.stringify(obj)
          )
        );
        this.loading = false;
        this.nickname = '';
      };
      worker.onerror = e => {
        e.preventDefault();
        this.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    },
    setWallet(wallet) {
      const navTo = this.path !== 'access' ? 'view-wallet-info' : 'interface';
      this.decryptWallet([wallet]);
      this.loading = false;
      this.password = '';
      this.file = '';
      this.path = '';
      this.nickname = '';

      this.$router.push({
        path: navTo
      });
    },
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
      this.fetchEthBalance();
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
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.hide();
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
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.show();
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
