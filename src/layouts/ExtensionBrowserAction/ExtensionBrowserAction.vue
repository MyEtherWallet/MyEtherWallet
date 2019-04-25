<template>
  <div>
    <watch-only-modal
      ref="watchOnlyModal"
      :loading="loading"
      :add-watch-only="addWatchOnlyWallet"
    />
    <add-wallet-container v-show="!hasAccounts" />
  </div>
</template>

<script>
import ExtensionAddWalletContainer from './containers/ExtensionAddWalletContainer';
import WatchOnlyModal from './components/WatchOnlyModal';
// import { WalletInterface } from '@/wallets';
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import { Toast } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';

export default {
  components: {
    'add-wallet-container': ExtensionAddWalletContainer,
    'watch-only-modal': WatchOnlyModal
  },
  data() {
    return {
      hasAccounts: false,
      accounts: [],
      loading: false
    };
  },
  mounted() {
    this.getAccounts();
  },
  methods: {
    getAccounts() {
      const chrome = window.chrome;
      const _this = this;
      chrome.storage.sync.get(null, res => {
        if (Object.keys(res).length > 0) {
          _this.accounts = res;
          _this.hasAccounts = true;
          return;
        }
        _this.accounts = {};
      });
    },
    addWatchOnlyWallet(name, address) {
      const _this = this;
      _this.loading = true;
      const chrome = window.chrome;
      const newAcc = {};
      const addr = toChecksumAddress(address);
      newAcc[addr] = {
        name: name,
        type: WATCH_ONLY
      };

      try {
        chrome.storage.sync.set(newAcc, () => {
          _this.$refs.watchOnlyModal.$refs.watchOnlyWallet.hide();
          Toast.responseHandler(
            `Added ${name} to watch only accounts!`,
            Toast.SUCCESS
          );
          _this.getAccounts();
          _this.loading = false;
        });
      } catch (e) {
        Toast.responseHandler('Something went wrong!', Toast.ERROR);
      }
    }
  }
};
</script>
