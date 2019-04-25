<template>
  <div class="welcome-section">
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
</template>

<script>
export default {
  props: {
    addWallet: {
      type: Function,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WelcomeContainer.scss';
</style>
