<template>
  <div>
    <watch-only-modal
      ref="watchOnlyModal"
      :loading="loading"
      :add-watch-only="addWatchOnlyWallet"
    />
    <add-wallet-container
      v-show="addAccount || !hasAccounts"
      :open-watch-only-modal="openWatchOnlyModal"
    />
    <my-wallets
      v-show="!addAccount && hasAccounts"
      :open-watch-only-modal="openWatchOnlyModal"
    />
  </div>
</template>

<script>
import ExtensionAddWalletContainer from './containers/ExtensionAddWalletContainer';
import ExtensionWalletContainer from './containers/ExtensionWalletContainer';
import WatchOnlyModal from './components/WatchOnlyModal';
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import { Toast, ExtensionHelpers } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';

export default {
  components: {
    'add-wallet-container': ExtensionAddWalletContainer,
    'my-wallets': ExtensionWalletContainer,
    'watch-only-modal': WatchOnlyModal
  },
  data() {
    return {
      hasAccounts: false,
      accounts: [],
      loading: false,
      addAccount: false
    };
  },
  create() {
    ExtensionHelpers.getAccounts(this.getAccountsCb);
  },
  mounted() {
    ExtensionHelpers.getAccounts(this.getAccountsCb);
  },
  methods: {
    getAccountsCb(res) {
      this.hasAccounts = Object.keys(res).length > 0;
      const accounts = Object.keys(res).map(item => {
        if (item !== 'localTokens') return res[item];
      });
      this.accounts = this.hasAccounts ? accounts : {};
    },
    addWatchOnlyWalletCb() {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
      this.loading = false;
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.hide();
      Toast.responseHandler(
        `Added ${name} to watch only accounts!`,
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
      ExtensionHelpers.addWatchOnlyWallet(newAcc, this.addWatchOnlyWalletCb);
    },
    openWatchOnlyModal() {
      this.$refs.watchOnlyModal.$refs.watchOnlyWallet.show();
    }
  }
};
</script>
