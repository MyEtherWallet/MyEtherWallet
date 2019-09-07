<template lang="html">
  <b-modal
    ref="done"
    hide-footer
    centered
    hide-header
    class="bootstrap-modal done no-padding"
  >
    <div class="modal-container-block">
      <div class="d-block text-center">
        <i class="check-icon fa fa-check" aria-hidden="true" />
        <h2 class="title">{{ $t('createWallet.byMnemonicSuccess') }}</h2>
        <p>{{ $t('createWallet.byMnemonicSuccessfullyCreated') }}</p>
      </div>
      <div class="button-container">
        <b-btn
          class="mid-round-button-green-filled close-button"
          @click="unlock"
        >
          {{ $t('common.unlockWallet') }}
        </b-btn>
      </div>
    </div>
    <!-- modal-container-block -->
  </b-modal>
</template>

<script>
export default {
  props: {
    unlock: {
      type: Function,
      default: function() {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FinishModal.scss';
</style>
