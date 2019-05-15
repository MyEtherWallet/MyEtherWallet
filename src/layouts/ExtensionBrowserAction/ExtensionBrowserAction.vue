<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import ExtensionAddWalletContainer from './containers/ExtensionAddWalletContainer';
import ExtensionWalletContainer from './containers/ExtensionWalletContainer';
import { ExtensionHelpers } from '@/helpers';

export default {
  components: {
    'add-wallet-container': ExtensionAddWalletContainer,
    'my-wallets': ExtensionWalletContainer
  },
  data() {
    return {
      hasAccounts: false
    };
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.getAccounts());
  },
  mounted() {
    this.getAccounts();
  },
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.getAccounts);
  },
  methods: {
    getAccountsCb(res) {
      this.hasAccounts = Object.keys(res).length > 0;
      if (!this.hasAccounts) {
        this.$router.push('/add-wallet');
      }
    },
    getAccounts() {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    }
  }
};
</script>
