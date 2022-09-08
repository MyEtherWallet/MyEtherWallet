<template functional>
  <div class="welcome-section">
    <div class="header">
      <p class="title">{{ parent.$t('mewcx.mewcx') }}</p>
      <p class="title-description">{{ parent.$t('mewcx.welcome-header') }}</p>
    </div>
    <div class="content">
      <div class="deprecation-notice">
        MEW CX will no longer be supported on
        <b>October 4th, 2022</b>
      </div>
      <img class="logo-ex" src="@/assets/images/mew-cx-logo.png" width="75" />
      <img class="logo-mew" src="@/assets/images/logo.png" height="25" />
      <div class="text-content">
        <h3>{{ parent.$t('mewcx.mew-cx-official') }}</h3>
        <p>
          {{ parent.$t('mewcx.no-wallet-add') }}
        </p>
      </div>
    </div>
    <i class="down-arrow fa fa-arrow-down" aria-hidden="true"></i>
    <div class="add-wallet-content" @click="props.addWallet">
      {{ parent.$t('mewcx.add-wallet') }}
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
}
@import 'WelcomeContainer.scss';
</style>
