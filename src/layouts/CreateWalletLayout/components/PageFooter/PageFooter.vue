<template>
  <div class="page-footer">
    <div class="wrap">
      <div class="page-container">
        <p class="footer-text">
          {{ $t('createWallet.pageFooterTitle') }}
          <router-link to="/#faqs">{{ $t('common.faqs') }}</router-link>
        </p>
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
@import 'PageFooter-desktop.scss';
@import 'PageFooter-tablet.scss';
@import 'PageFooter-mobile.scss';
</style>
