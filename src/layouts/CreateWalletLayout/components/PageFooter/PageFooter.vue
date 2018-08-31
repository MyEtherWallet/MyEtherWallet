<template>
  <div class="page-footer">
    <div class="wrap">
      <div class="page-container">
        <p>{{ $t("createWallet.pageFooterTitle") }} <router-link to="/">{{ $t("common.faqs") }}</router-link></p>
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
@import 'PageFooter.scss';
</style>
