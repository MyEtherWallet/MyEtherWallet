<template>
  <b-modal 
    ref="myModalRef" 
    hide-footer 
    hide-header 
    class="bootstrap-modal">
    <div class="d-block text-center">
      <h2 class="title">{{ $t("createWallet.title") }}</h2>
      <p class="content">
        {{ $t("createWallet.subheading") }}
      </p>
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button">
        {{ $t("createWallet.firstTime") }}
      </b-btn>
      <b-btn class="mid-round-button-green-border close-button">
        {{ $t("createWallet.veteran") }}
      </b-btn>
    </div>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.$refs.myModalRef.show();
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletModal.scss';
</style>
