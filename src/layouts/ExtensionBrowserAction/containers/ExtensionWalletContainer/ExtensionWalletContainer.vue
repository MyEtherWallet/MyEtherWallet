<template>
  <div class="extension-wallets-container">
    <wallet-side-menu :selected-view="label" :switch-view="switchView" />
    <div class="wallets-container">
      <watch-only-modal
        ref="watchOnlyModal"
        :add-watch-only="addWatchOnlyWallet"
      />
      <password-only-modal
        ref="passwordOnlyModal"
        :path="path"
        :submit="path !== 'view' ? accessWallet : viewWallet"
        :disabled="validInput"
        @password="updatePassword"
      />
      <div v-show="label === 'myWallets'">
        <div class="wallets-container-header">
          <div class="title-balance">
            <h3>{{ name }}</h3>
            <p v-show="!loading">
              {{ totalBalance }} <span>ETH</span>
              <span class="total-balance"> (Total Balance) </span>
            </p>
            <i v-show="loading" class="fa fa-spin fa-spinner" />
          </div>
          <div class="add-button" @click="addWallet">
            + Add
          </div>
        </div>
        <div v-show="myWallets.length > 0" class="wallets">
          <wallet-info-component
            v-for="wallet in myWallets"
            :key="wallet.address"
            :address="wallet.address"
            :balance="wallet.balance"
            :wallet="wallet.wallet"
            :wallet-type="wallet.type"
            :access="togglePasswordModal"
            :detail="togglePasswordModal"
          />
        </div>
        <div v-show="myWallets.length === 0 && !loading">
          <h2>No Wallet found...</h2>
        </div>
        <div v-show="loading && file === ''">
          <h2>Loading Wallets...</h2>
        </div>
      </div>
      <div v-show="label === 'watchOnlyWallets'">
        <div class="wallets-container-header">
          <div class="title-balance">
            <h3>{{ name }}</h3>
          </div>
          <div class="add-button" @click="openWatchOnlyModal">
            + Add
          </div>
        </div>
        <div v-show="watchOnlyAddresses.length > 0" class="wallets">
          <wallet-info-component
            v-for="wallet in watchOnlyAddresses"
            :key="wallet.address"
            :address="wallet.address"
            :balance="wallet.balance"
            :wallet="wallet.wallet"
            :wallet-type="wallet.type"
          />
        </div>
        <div v-show="watchOnlyAddresses.length === 0 && !loading">
          <h2>No Wallet found...</h2>
        </div>
        <div v-show="loading">
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
import { toChecksumAddress } from '@/helpers/addressUtils';
import { Toast, ExtensionHelpers } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';

export default {
  components: {
    'wallet-side-menu': WalletSideMenu,
    'watch-only-modal': WatchOnlyModal,
    'wallet-info-component': WalletInfoComponent,
    'password-only-modal': PasswordOnlyModal
  },
  props: {
    accounts: {
      type: Array,
      default: () => {
        return [];
      }
    }
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
      password: ''
    };
  },
  computed: {
    validInput() {
      return (
        (this.password !== '' || this.password.length > 0) &&
        this.walletRequirePass(this.file)
      );
    }
  },
  watch: {
    accounts() {
      this.processAccounts();
    }
  },
  mounted() {
    this.$refs.passwordOnlyModal.$refs.passwordOnlyModal.$on('hidden', () => {
      this.file = '';
      this.path = '';
    });
  },
  methods: {
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
      const worker = new walletWorker();
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = e => {
        this.setWallet(
          new WalletInterface(Buffer.from(e.data._privKey), false, keyStoreType)
        );
        this.loading = false;
      };
      worker.onerror = e => {
        e.preventDefault();
        this.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    },
    setWallet(wallet) {
      this.$store.dispatch('decryptWallet', [wallet]);
      this.loading = false;
      this.password = '';
      this.$router.push({
        path: 'interface'
      });
    },
    viewWallet() {
      console.log(this.path);
    },
    togglePasswordModal(file, path) {
      const parseFile = JSON.parse(file);
      this.file = JSON.parse(parseFile.priv);
      this.path = path;
      this.$refs.passwordOnlyModal.$refs.passwordOnlyModal.show();
    },
    async processAccounts() {
      this.totalBalance = 0;
      this.loading = true;
      let balance = new BigNumber(this.totalBalance);
      const watchOnlyAddresses = [];
      const myWallets = [];
      for (const account of this.accounts) {
        const address = toChecksumAddress(account.address).toLowerCase();
        delete account['address'];
        const parsedItemWallet = JSON.parse(account.wallet);
        account['balance'] = await this.getBalance(address);
        account['type'] = parsedItemWallet.type;
        account['address'] = address;
        if (parsedItemWallet.type !== 'wallet') {
          watchOnlyAddresses.push(account);
        } else {
          balance = balance.plus(new BigNumber(account.balance));
          myWallets.push(account);
        }
      }

      this.totalBalance = balance.toString();
      this.watchOnlyAddresses = watchOnlyAddresses;
      this.myWallets = myWallets;
      this.loading = false;
    },
    async getBalance(addr) {
      const balance = await window.web3.eth.getBalance(addr);
      return web3utils.fromWei(balance);
    },
    addWallet() {
      this.$router.push('add-wallet');
    },
    switchView(val) {
      this.label = val.label;
      this.name = val.name;
    },
    addWatchOnlyWalletCb() {
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.hide();
      Toast.responseHandler(
        'Added watch only account successfully!',
        Toast.SUCCESS
      );
    },
    addWatchOnlyWallet(name, address) {
      const newAcc = {};
      const addr = toChecksumAddress(address);
      const foundAddr = this.accounts.find(item => {
        return toChecksumAddress(item.address) === toChecksumAddress(address);
      });
      if (foundAddr) {
        Toast.responseHandler('Address already added!', Toast.ERROR);
      } else {
        newAcc[addr] = JSON.stringify({
          nick: name,
          type: WATCH_ONLY
        });
        ExtensionHelpers.addWalletToStore(
          address,
          null,
          name,
          WATCH_ONLY,
          this.addWatchOnlyWalletCb
        );
      }
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
