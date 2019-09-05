<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="addressQrcode"
      hide-footer
      centered
      static
      lazy
      class="bootstrap-modal nopadding"
      title="Address"
    >
      <div class="modal-contents">
        <qrcode :value="address" :options="{ size: 160 }" />
        <textarea
          ref="addressInput"
          v-model="address"
          class="address"
          readonly
        ></textarea>
        <button @click="copyToClipboard">Copy</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'AddressQrcodeModal',
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    copyToClipboard: function() {
      this.$refs.addressInput.select();
      document.execCommand('copy');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddressQrcodeModal.scss';
</style>
