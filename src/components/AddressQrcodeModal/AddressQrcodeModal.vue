<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="addressQrcode"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      title="Address"
    >
      <div class="modal-contents">
        <qrcode :value="address" :options="{ size: 160 }" />
        <textarea v-model="address" class="address" readonly></textarea>
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
      const el = document.querySelector('.address');
      el.select();
      document.execCommand('copy');
      el.select();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddressQrcodeModal.scss';
</style>
