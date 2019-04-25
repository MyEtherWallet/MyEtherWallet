<template>
  <div class="popover-container">
    <div v-if="hasAccounts">
      Has Accounts
    </div>
    <div v-else>
      <welcome-container :add-wallet="addWallet" />
    </div>
  </div>
</template>

<script>
import WelcomeContainer from './containers/WelcomeContainer';
export default {
  components: {
    'welcome-container': WelcomeContainer
  },
  data() {
    return {
      hasAccounts: false
    };
  },
  created() {
    const chrome = window.chrome;
    const _this = this;
    chrome.storage.sync.get(null, res => {
      _this.hasAccounts = Object.keys(res).length > 0;
    });
    console.log(_this.hasAccounts);
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
