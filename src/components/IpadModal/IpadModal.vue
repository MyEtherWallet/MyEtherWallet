<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="ipadModal"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      :title="$t('common.addr')"
      static
      lazy
    >
      <div class="modal-contents">
        {{ this.$t('accessWallet.mewconnect.warning')}}
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
