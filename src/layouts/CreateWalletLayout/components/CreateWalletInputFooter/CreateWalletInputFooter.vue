<template>
  <div class="footer-text">
    <p>
      <span>{{ $t('createWallet.password.do-not-forget') }}</span>
      {{ $t('createWallet.password.do-not-forget-desc') }}<span> {{ combo }}</span>
      {{ desc }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    combo: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletInputFooter.scss';
</style>
