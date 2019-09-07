<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="ipadModal"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      title="Address"
    >
      <div class="modal-contents">
        MEWconnect is not compatible with iPads.
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
