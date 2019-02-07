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
        <qrcode :value="address" :options="{ size: 200 }" />
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
  mounted() {
    //console.log(this.$refs);
    //this.$refs.addressQrcode.show();
  },
  methods: {
    copyToClipboard: function() {
      //console.log(str);
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
