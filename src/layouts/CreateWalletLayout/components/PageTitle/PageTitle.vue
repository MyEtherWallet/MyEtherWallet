<template>
  <div class="page-title">
    <div class="wrap">
      <div class="page-container">
        <div class="page-title">
          <h2>{{ $t('createWallet.title') }}</h2>
          <h5>
            {{ $t('createWallet.sub-title') }}
            <router-link to="/access-my-wallet">{{
              $t('common.wallet.access-my')
            }}</router-link>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'PageTitle-desktop.scss';
@import 'PageTitle-tablet.scss';
@import 'PageTitle-mobile.scss';
</style>
