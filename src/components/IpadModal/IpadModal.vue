<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="ipadModal"
      :title="$t('common.addr')"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
    >
      <div class="modal-contents">
        {{ this.$t('accessWallet.mewconnect.warning') }}
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'IpadModal'
};
</script>

<style lang="scss" scoped>
@import 'IpadModal.scss';
</style>
