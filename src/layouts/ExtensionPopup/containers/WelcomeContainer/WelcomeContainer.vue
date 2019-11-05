<template functional>
  <div class="welcome-section">
    <div class="header">
      {{$t('mewCx.welcome-header')}}
    </div>
    <div class="content">
      <img src="@/assets/images/mew-cx-logo.png" width="75" />
      <div class="text-content">
        <h3>{{$t('mewCx.mew-cx-official')}}</h3>
        <p>
          {{$t('mewCx.no-wallet-add')}}
        </p>
      </div>
    </div>
    <div class="add-wallet-content" @click="props.addWallet">
      {{$t('mewCx.add-wallet')}}
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
