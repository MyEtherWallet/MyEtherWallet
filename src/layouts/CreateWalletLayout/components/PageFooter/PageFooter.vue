<template>
  <div class="page-footer">
    <div class="wrap">
      <div class="page-container">
        <i18n path="createWallet.page-footer-title" tag="p">
          <router-link slot="faq" to="/#faqs">{{
            $t('common.faqs')
          }}</router-link>
        </i18n>
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
