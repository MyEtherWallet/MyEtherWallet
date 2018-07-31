<template lang="html">
  <b-modal ref="done" hide-footer centered hide-header class="bootstrap-modal done">
    <div class="d-block text-center">
      <i class="check-icon fa fa-check" aria-hidden="true"></i>
      <h2 class="title">{{ $t("createWallet.byMnemonicSuccess") }}</h2>
      <p class="content">{{ $t("createWallet.byMnemonicSuccessfullyCreated") }}</p>
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button">
        {{ $t("common.unlockWallet") }}
      </b-btn>
    </div>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  @import "FinishModal.scss";
</style>
