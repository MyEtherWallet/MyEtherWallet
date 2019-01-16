<template>
  <div class="footer-text">
    <p>
      <span>{{ $t('createWallet.doNotForget') }}</span>
      {{ $t('createWallet.doNotForgetDesc') }}<span> {{ combo }}</span>
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
