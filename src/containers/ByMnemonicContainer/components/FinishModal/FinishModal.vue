<template lang="html">
  <b-modal ref="done" hide-footer centered hide-header class="bootstrap-modal done">
    <div class="d-block text-center">
      <i class="check-icon fa fa-check" aria-hidden="true"></i>
      <h2 class="title">{{ $t("byMnemonic.success") }}</h2>
      <p class="content">{{ $t("byMnemonic.successfullyCreated") }}</p>
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button">
        {{ $t("reused.unlockWallet") }}
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
