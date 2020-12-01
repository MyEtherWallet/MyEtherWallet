<template functional>
  <div class="footer-text">
    <i18n tag="p" path="createWallet.password.do-not-forget-save-pw">
      <span slot="do-not-forget">{{
        parent.$t('createWallet.password.do-not-forget')
      }}</span>
      <span slot="key-pass">{{
        parent.$t('createWallet.password.key-pass')
      }}</span>
    </i18n>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'CreateWalletInputFooter.scss';
</style>
