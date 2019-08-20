<template>
  <div>
    <keep-alive>
      <router-view :accounts="accounts" :get-accounts="getAccounts" />
    </keep-alive>
  </div>
</template>

<script>
import ExtensionAddWalletContainer from './containers/ExtensionAddWalletContainer';
import ExtensionWalletContainer from './containers/ExtensionWalletContainer';
import { ExtensionHelpers } from '@/helpers';
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';
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
    window.chrome.storage.onChanged.addListener(this.getAccounts);
  },
  mounted() {
    this.getAccounts();
  },
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.getAccounts);
  },
  methods: {
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
      this.hasAccounts = accounts.length > 0;
      if (this.hasAccounts) {
        this.accounts = accounts;
      } else {
        this.accounts = [];
        this.$router.push('/access-my-wallet');
      }
    },
    getAccounts() {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    }
  }
};
</script>
