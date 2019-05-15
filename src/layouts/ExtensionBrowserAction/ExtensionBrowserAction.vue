<template>
  <div>
    <router-view :accounts="accounts" />
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
      hasAccounts: false,
      accounts: []
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
      const accounts = Object.keys(res).map(item => {
        const newObj = Object.assign({}, { address: item, wallet: res[item] });
        if (item !== 'localTokens') return newObj;
      });
      if (this.hasAccounts) {
        this.accounts = accounts;
      } else {
        this.accounts = [];
        this.$router.push('/add-wallet');
      }
    },
    getAccounts() {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    }
  }
};
</script>
