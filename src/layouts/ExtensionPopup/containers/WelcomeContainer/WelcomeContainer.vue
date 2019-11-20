<template functional>
  <div class="welcome-section">
    <div class="header">
      {{ parent.$t('mewcx.welcome-header') }}
    </div>
    <div class="content">
      <img src="@/assets/images/mew-cx-logo.png" width="75" />
      <div class="text-content">
        <h3>{{ parent.$t('mewcx.mew-cx-official') }}</h3>
        <p>
          {{ parent.$t('mewcx.no-wallet-add') }}
        </p>
      </div>
    </div>
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
@import 'WelcomeContainer.scss';
</style>
