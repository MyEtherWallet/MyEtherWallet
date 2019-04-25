<template>
  <div class="popover-container">
    <div v-if="hasAccounts">
      <accounts-container :accounts="accounts" />
    </div>
    <div v-else>
      <welcome-container :add-wallet="addWallet" />
    </div>
  </div>
</template>

<script>
import WelcomeContainer from './containers/WelcomeContainer';
import AccountsContainer from './containers/AccountsContainer';
export default {
  components: {
    'welcome-container': WelcomeContainer,
    'accounts-container': AccountsContainer
  },
  data() {
    return {
      hasAccounts: false,
      accounts: {}
    };
  },
  created() {
    const chrome = window.chrome;
    const _this = this;
    chrome.storage.sync.get(null, res => {
      _this.hasAccounts = Object.keys(res).length > 0;
      _this.accounts = _this.hasAccounts ? res : {};
    });
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionPopup.scss';
</style>
