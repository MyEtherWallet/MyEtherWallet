<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="addressQrcode"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <p>AddressQrcodeModal</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'AddressQrcodeModal',
  data() {
    return {};
  },
  mounted() {
    //console.log(this.$refs);
    //this.$refs.addressQrcode.show();
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'AddressQrcodeModal.scss';
</style>
