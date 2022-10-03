<template>
  <canvas ref="qrCodeCanvas"></canvas>
</template>

<script>
import mewIcon from '@/assets/images/icons/icon-mew-logo.svg';
import QrCodeWithLogo from 'qrcode-with-logos';

export default {
  props: {
    width: {
      type: Number,
      default: 150
    },
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      qrCode: null
    };
  },
  watch: {
    data(val) {
      if (val !== '') {
        this.generateQRCode();
      }
    }
  },
  mounted() {
    this.generateQRCode();
  },
  beforeDestroy() {
    this.qrCode = null;
  },
  methods: {
    generateQRCode() {
      this.qrCode = new QrCodeWithLogo({
        canvas: this.$refs.qrCodeCanvas,
        content: this.data,
        width: this.width,
        logo: {
          borderRadius: 100,
          logoSize: 0.23,
          borderSize: 0,
          src: mewIcon
        }
      });
      this.qrCode.toCanvas();
    }
  }
};
</script>
