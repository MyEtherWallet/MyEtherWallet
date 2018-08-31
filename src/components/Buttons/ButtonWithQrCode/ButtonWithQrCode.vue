<template>
  <div class="modal-container">
    <div class="wrap">
      <div class="the-button large-round-button-green-filled">{{buttonname}}</div>
      <div class="qrcode-container">
        <img class="dummy-qrcode" :src="qrcodeIconImage">
        <div class="real-qrcode">
          <img src="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeIcon from '@/assets/images/icons/qr-code.svg'

export default {
  props: ['qrcode', 'buttonname'],
  data () {
    return {
      qrcodeIconImage: QrcodeIcon
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "ButtonWithQrCode.scss";
</style>
