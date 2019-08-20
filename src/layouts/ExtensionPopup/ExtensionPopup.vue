<template>
  <div class="popover-container">
    <div v-if="hasAccounts">
      <accounts-container :add-wallet="addWallet" :accounts="accounts" />
    </div>
    <div v-else>
      <welcome-container :add-wallet="addWallet" />
    </div>
  </div>
</template>

<script>
/* eslint no-console:0 */
import WelcomeContainer from './containers/WelcomeContainer';
import AccountsContainer from './containers/AccountsContainer';
import { ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';

export default {
  components: {
    'welcome-container': WelcomeContainer,
    'accounts-container': AccountsContainer
  },
  data() {
    return {
      hasAccounts: false,
      accounts: []
    };
  },
  created() {
    window.chrome.storage.onChanged.addListener(() => {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    });
  },
  mounted() {
    ExtensionHelpers.getAccounts(this.getAccountsCb);
  },
  methods: {
    addWallet() {
      const chrome = window.chrome;
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        // eslint-disable-next-line
        window.open(chrome.runtime.getURL('index.html'));
      }
    },
    getAccountsCb(res) {
      const accounts = Object.keys(res)
        .filter(item => {
          return isAddress(item);
        })
        .map(item => {
          const newObj = {};
          newObj[item] = res[item];
          return newObj;
        });
      this.hasAccounts = accounts.length > 0;
      this.accounts = this.hasAccounts ? accounts : {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionPopup.scss';
</style>
