<template functional>
  <div class="welcome-section">
    <div class="header">
      {{ parent.$t('mewCX.welcome-header') }}
    </div>
    <div class="content">
      <img src="@/assets/images/mew-cx-logo.png" width="75" />
      <div class="text-content">
        <h3>{{ parent.$t('mewCX.mew-cx-official') }}</h3>
        <p>
          {{ parent.$t('mewCX.no-wallet-add') }}
        </p>
      </div>
    </div>
    <div class="add-wallet-content" @click="props.addWallet">
      {{ parent.$t('mewCX.add-wallet') }}
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
