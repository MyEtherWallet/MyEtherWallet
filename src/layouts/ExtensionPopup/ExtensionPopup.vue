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
import WelcomeContainer from './containers/WelcomeContainer';
import AccountsContainer from './containers/AccountsContainer';
import { ExtensionHelpers } from '@/helpers';

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
      this.hasAccounts = Object.keys(res).length > 0;
      const accounts = Object.keys(res).map(item => {
        const newObj = {};
        newObj[`${item}`] = res[`${item}`];
        if (item !== 'localTokens') return newObj;
      });
      this.accounts = this.hasAccounts ? accounts : {};
    },
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionPopup.scss';
</style>
