<template>
  <div ref="container" />
</template>

<script>
import mewIcon from '@/assets/images/icons/icon-mew-logo.png';
import QRCodeStyling from 'qr-code-styling';
export default {
  props: {
    width: {
      type: Number,
      default: 150
    },
    height: {
      type: Number,
      default: 150
    },
    data: {
      type: String,
      default: ''
    },
    /**
     * Options: square, dots, rounded, extra rounded, classy, classy rounded
     */
    dotStyle: {
      type: String,
      default: 'square'
    },
    dotsColor: {
      type: String,
      default: '#000000'
    },
    /**
     * Options: square, dot, extra rounded
     */
    cornersSquareStyle: {
      type: String,
      default: 'square'
    },
    cornersSquareColor: {
      type: String,
      default: '#000000'
    },
    /**
     * Options: square, dot
     */
    cornerDotStyle: {
      type: String,
      default: 'square'
    },
    cornerDotColor: {
      type: String,
      default: '#000000'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    margin: {
      type: Number,
      default: 0
    },
    typeNumber: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      qrCode: null
    };
  },
  computed: {
    options() {
      return {
        width: this.width,
        height: this.height,
        type: 'canvas',
        data: this.data,
        image: mewIcon,
        margin: this.margin,
        qrOptions: {
          errorCorrectionLevel: 'H',
          mode: 'Byte',
          typeNumber: this.typeNumber
        },
        dotsOptions: {
          color: this.dotsColor,
          type: this.dotStyle
        },
        backgroundOptions: {
          color: this.backgroundColor
        },
        cornersSquareOptions: {
          color: this.cornersSquareColor,
          type: this.cornersSquareStyle
        },
        cornersDotsOptions: {
          color: this.cornerDotColor,
          type: this.cornerDotStyle
        }
      };
    }
  },
  watch: {
    data() {
      this.qrCode.update(this.options);
    }
  },
  mounted() {
    this.qrCode = new QRCodeStyling(this.options);
    this.qrCode.append(this.$refs.container);
  }
};
</script>

<style></style>
