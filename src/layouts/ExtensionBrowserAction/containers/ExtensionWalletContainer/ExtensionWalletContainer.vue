<template>
  <div class="extension-wallets-container">
    <wallet-side-menu :selected-view="label" :switch-view="switchView" />
    <div class="wallets-container">
      <watch-only-modal
        ref="watchOnlyModal"
        :add-watch-only="addWatchOnlyWallet"
      />
      <div v-show="label === 'myWallets'">
        <div class="wallets-container-header">
          <div class="title-balance">
            <h3>{{ name }}</h3>
            <p>
              {{ totalBalance }} <span>ETH</span>
              <span class="total-balance"> (Total Balance) </span>
            </p>
          </div>
          <div class="add-button" @click="addWallet">
            + Add
          </div>
        </div>
        <div class="wallet-info-container">
          <wallet-info-component
            v-for="wallet in myWallets"
            :key="wallet.address"
            :address="wallet.address"
            :balance="wallet.balance"
            :wallet="wallet.wallet"
            :wallet-type="label"
          />
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
        <div class="wallet-info-container">
          <wallet-info-component
            v-for="wallet in watchOnlyAddresses"
            :key="wallet.address"
            :address="wallet.address"
            :balance="wallet.balance"
            :wallet="wallet.wallet"
            :wallet-type="label"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WalletSideMenu from '../../components/WalletSideMenu';
import WatchOnlyModal from '../../components/WatchOnlyModal';
import WalletInfoComponent from '../../components/WalletInfoComponent';
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import { toChecksumAddress } from '@/helpers/addressUtils';
import { Toast, ExtensionHelpers } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'wallet-side-menu': WalletSideMenu,
    'watch-only-modal': WatchOnlyModal,
    'wallet-info-component': WalletInfoComponent
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
      totalBalance: 0
    };
  },
  watch: {
    accounts() {
      this.processAccounts();
    }
  },
  methods: {
    async processAccounts() {
      this.totalBalance = 0;
      let balance = new BigNumber(this.totalBalance);
      const watchOnlyAddresses = [];
      const myWallets = [];
      for (const account of this.accounts) {
        const parsedItemWallet = JSON.parse(account.wallet);
        account['balance'] = await this.getBalance(account.address);
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
      ExtensionHelpers.getAccounts(this.getAccountsCb);
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.hide();
      Toast.responseHandler(
        `Added ${name} to watch only accounts!`,
        Toast.SUCCESS
      );
    },
    addWatchOnlyWallet(name, address) {
      const newAcc = {};
      const addr = toChecksumAddress(address);
      newAcc[addr] = JSON.stringify({
        nick: name,
        type: WATCH_ONLY
      });
      ExtensionHelpers.addWatchOnlyWallet(newAcc, this.addWatchOnlyWalletCb);
    },
    openWatchOnlyModal() {
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionWalletContainer.scss';
</style>
