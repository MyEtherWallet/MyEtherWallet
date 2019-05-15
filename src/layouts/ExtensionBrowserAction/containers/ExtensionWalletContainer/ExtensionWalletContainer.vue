<template>
  <div class="extension-wallets-container">
    <wallet-side-menu :selected-view="label" :switch-view="switchView" />
    <div class="wallets-container">
      <watch-only-modal ref="watchOnlyModal" :add-watch-only="addWatchOnlyWallet" />
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
      </div>
    </div>
  </div>
</template>

<script>
import WalletSideMenu from '../../components/WalletSideMenu';
import WatchOnlyModal from '../../components/WatchOnlyModal';
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import { toChecksumAddress } from '@/helpers/addressUtils';
import { Toast, ExtensionHelpers } from '@/helpers';

export default {
  components: {
    'wallet-side-menu': WalletSideMenu,
    'watch-only-modal': WatchOnlyModal
  },
  data() {
    return {
      label: 'myWallets',
      name: 'My Wallets',
      loading: false
    };
  },
  computed: {
    totalBalance() {
      return 0;
    }
  },
  methods: {
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
