<template>
  <div class="footer-text">
    <p>
      <span>{{ $t("createWallet.doNotForget") }}</span>
      {{ $t("createWallet.doNotForgetDesc") }}
      <span>{{ $t("createWallet.keyPass") }}</span>
      {{ $t("createWallet.keyPassDesc") }}
    </p>
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
@import 'CreateWalletInputFooter.scss';
</style>
