<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="addressQrcode"
      :title="$t('common.addr')"
      hide-footer
      centered
      static
      lazy
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <qrcode :value="address" :options="{ size: 160 }" />
        <textarea
          ref="addressInput"
          v-model="address"
          class="address"
          readonly
        ></textarea>
        <button @click="copyToClipboard">{{ $t('common.copy') }}</button>
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
    copyToClipboard: function () {
      this.$refs.addressInput.select();
      document.execCommand('copy');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddressQrcodeModal.scss';
</style>
