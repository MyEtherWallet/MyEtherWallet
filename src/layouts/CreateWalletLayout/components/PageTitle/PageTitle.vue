<template>
  <div class="page-title">
    <div class="wrap">
      <div class="page-container">
        <div class="page-title">
          <h2>{{ $t('home.getANewWallet') }}</h2>
          <h5>
            {{ $t('createWallet.pageTitleAlreadyHave') }}
            <router-link to="/access-my-wallet">{{
              $t('common.accessMyWallet')
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
