<template functional>
  <div class="welcome-section">
    <div class="header">
      <p class="title">{{ parent.$t('mewcx.mewcx') }}</p>
      <p class="title-description">{{ parent.$t('mewcx.welcome-header') }}</p>
    </div>
    <div class="content">
      <!-- <div class="deprecation-notice">
        MEW CX is no longer being maintained by the MEW team.
        <br />
        <a
          href="https://help.myetherwallet.com/en/articles/6434663-migrating-from-mew-cx-to-enkrypt"
          target="_blank"
        >
          Migrate wallet to new extension</a
        >
      </div> -->
      <img class="logo-ex" src="@/assets/images/mew-cx-logo.png" width="75" />
      <div class="text-content">
        <h3>{{ parent.$t('mewcx.mew-cx-official') }}</h3>
      </div>
    </div>
    <i class="down-arrow fa fa-arrow-down" aria-hidden="true"></i>
    <div class="add-wallet-content" @click="props.addWallet">
      Download Enkrypt
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
.deprecation-notice {
  margin: 0 !important;
  width: 100%;
}

@import 'WelcomeContainer.scss';

.content {
  padding: 41px 0;
}
</style>
