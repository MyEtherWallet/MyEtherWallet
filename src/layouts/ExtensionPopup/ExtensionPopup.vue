<template>
  <div class="popover-container">
    <div v-if="hasAccounts">
      Has Accounts
    </div>
    <div v-else class="welcome-section">
      <div class="header">
        MEW | Chrome Extension
      </div>
      <div class="content">
        <img src="@/assets/images/logo-small.png" width="75" />
        <div class="text-content">
          <h3>MyEtherWallet Official Chrome Extension</h3>
          <p>
            You don't have any wallet saved. Click Add Wallet to get started
          </p>
        </div>
      </div>
      <div class="add-wallet-content" @click="addWallet">
        Add Wallet
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasAccounts: false
    };
  },
  mounted() {
    const chrome = window.chrome;
    const _this = this;
    chrome.storage.sync.get(['accounts'], res => {
      _this.hasAccounts = Object.keys(res).length > 0;
    });
  },
  methods: {
    addWallet() {
      const chrome = window.chrome;
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('index.html'));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionPopup.scss';
</style>
