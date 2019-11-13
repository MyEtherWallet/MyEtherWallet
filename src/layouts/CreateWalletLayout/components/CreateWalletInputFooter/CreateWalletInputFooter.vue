<template functional>
  <div class="footer-text">
    <p>
      <span>{{ parent.$t('createWallet.password.do-not-forget') }}</span>
      {{ parent.$t('createWallet.password.do-not-forget-desc')
      }}<span> {{ parent.$t('createWallet.password.key-pass') }}</span>
      {{ parent.$t('createWallet.password.key-pass-desc') }}
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'CreateWalletInputFooter.scss';
</style>
