<template>
  <div class="extension-wallets-container">
    <wallet-side-menu :selected-view="label" :switch-view="switchView" />
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
      <div v-show="label === 'myWallets'" class="my-wallets-container">
        <div class="wallets-container-header">
          <div class="header-title-container">
            <div class="title-balance">
              <h2>{{ name }}</h2>
            </div>
            <div class="add-button" @click="addWallet">
              + Add More
            </div>
          </div>
          <div class="dropdown-container">
            <span class="network-text">NETWORK</span>
            <span class="current-network" @click="openNetworkModal">
              {{ network.type.name }} - {{ network.service }}
            </span>
          </div>
        </div>
        <div class="total-balance-container">
          <div class="title-name">
            Total Balance
          </div>
          <div class="balance-container">
            <p class="actual-balance">
              {{ totalBalance }} <span>{{ network.type.name }} </span>
            </p>
            <p v-if="network.type.name ==='ETH'" class="converted-balance">{{ convertedBalance }}</p>
          </div>
        </div>
        <div v-show="myWallets.length > 0 || loading" class="wallets">
          <wallet-info-component
            v-for="wallet in myWallets"
            :usd="ethPrice"
            :key="wallet.address"
            :address="wallet.address"
            :balance="wallet.balance"
            :wallet="wallet.wallet"
            :nickname="wallet.nickname"
            :wallet-type="wallet.type"
            :access="togglePasswordModal"
            :detail="togglePasswordModal"
          />
        </div>
        <div v-show="myWallets.length === 0 && !loading" class="wallets-info">
          <h2>No Wallet found...</h2>
        </div>
        <div v-show="loading && myWallets.length === 0" class="wallets-info">
          <h2>Loading Wallets...</h2>
        </div>
      </div>
      <div v-show="label === 'watchOnlyWallets'" class="watch-only-container">
        <div class="wallets-container-header">
          <div class="title-balance">
            <h2>{{ name }}</h2>
          </div>
          <div class="add-button" @click="openWatchOnlyModal">
            + Add More
          </div>
        </div>
        <div v-show="watchOnlyAddresses.length > 0 || loading" class="wallets">
          <wallet-info-component
            v-for="wallet in watchOnlyAddresses"
            :usd="ethPrice"
            :key="wallet.address"
            :address="wallet.address"
            :balance="wallet.balance"
            :wallet="wallet.wallet"
            :wallet-type="wallet.type"
          />
        </div>
        <div
          v-show="watchOnlyAddresses.length === 0 && !loading"
          class="wallets-info"
        >
          <h2>No Wallet found...</h2>
        </div>
        <div v-show="loading && myWallets.length === 0" class="wallets-info">
          <h2>Loading Wallets...</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import WalletSideMenu from '../../components/WalletSideMenu';
import WatchOnlyModal from '../../components/WatchOnlyModal';
import WalletInfoComponent from '../../components/WalletInfoComponent';
import PasswordOnlyModal from '../../components/PasswordOnlyModal';
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import { Toast, ExtensionHelpers } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { mapState } from 'vuex';
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal';
export default {
  components: {
    'wallet-side-menu': WalletSideMenu,
    'watch-only-modal': WatchOnlyModal,
    'wallet-info-component': WalletInfoComponent,
    'password-only-modal': PasswordOnlyModal,
    'interface-network-modal': InterfaceNetworkModal
  },
  data() {
    return {
      label: 'myWallets',
      name: 'My Wallets',
      loading: false,
      watchOnlyAddresses: [],
      myWallets: [],
      totalBalance: 0,
      file: '',
      path: '',
      password: '',
      nickname: '',
      hasAccounts: '',
      convertedBalance: '$ 0',
      ethPrice: 0
    };
  },
  computed: {
    ...mapState(['web3', 'network']),
    validInput() {
      return (
        (this.password !== '' || this.password.length > 0) &&
        this.walletRequirePass(this.file)
      );
    }
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.getAccounts);
  },
  mounted() {
    this.getAccounts();
  },
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.getAccounts);
  },
  methods: {
    openNetworkModal() {
      this.$refs.network.$refs.network.show();
    },
    async fetchEthBalance() {
      if (this.network.type.name === 'ETH') {
        const price = await fetch(
          'https://cryptorates.mewapi.io/ticker?filter=ETH'
        )
          .then(res => {
            return res.json();
          })
          .catch(e => {
            console.log(e);
          });

        this.convertedBalance = `$ ${new BigNumber(
          price.data.ETH.quotes.USD.price
        )
          .times(this.totalBalance)
          .toFixed(2)}`;

        this.ethPrice = price.data.ETH.quotes.USD.price;
      }
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
        this.processAccounts(accounts);
      } else {
        this.$router.push('/access-my-wallet');
      }
    },
    getAccounts() {
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
      this.$store.dispatch('decryptWallet', [wallet]);
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
      this.totalBalance = 0;
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
    switchView(val) {
      this.label = val.label;
      this.name = val.name;
    },
    addWatchOnlyWalletCb() {
      this.loading = false;
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.hide();
      Toast.responseHandler(
        'Added Watch-Only account successfully!',
        Toast.SUCCESS
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

<style lang="scss" scoped>
@import 'ExtensionWalletContainer.scss';
</style>
