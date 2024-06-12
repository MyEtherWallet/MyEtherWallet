<template>
  <canvas ref="qrCodeCanvas"></canvas>
</template>

<script setup>
import { defineProps, watch, onMounted, onBeforeUnmount, ref } from 'vue';
import QrCodeWithLogo from 'qrcode-with-logos';

// props
const props = defineProps({
  width: {
    type: Number,
    default: 150
  },
  data: {
    type: String,
    default: ''
  }
});

// data
const mewIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjEuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMTIgMTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMTIgMTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzE4OTZBNDt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxnPgoJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iNTYiIGN5PSI1NiIgcj0iNTQiLz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjIuNzUsNzIuODhjLTIuMDYsMC44Mi00LjI5LDEuMjktNi42NCwxLjI5Yy05Ljg4LDAtMTcuODktOC4wMS0xNy44OS0xNy44OWMwLTAuNzMsMC4wNi0xLjQ1LDAuMTQtMi4xNgoJCQkJbC0xOC4wMi0yLjkzQzIwLjEyLDUyLjc2LDIwLDU0LjM3LDIwLDU2YzAsMTkuODgsMTYuMTIsMzYsMzYsMzZjNi45NywwLDEzLjQ3LTEuOTksMTguOTgtNS40Mkw2Mi43NSw3Mi44OHoiLz4KCQk8L2c+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTcyLjk0LDUwLjE4TDQ5LDU1LjQ2bDQyLjA1LDguNzRDOTEuNjYsNjEuNTYsOTIsNTguODIsOTIsNTZjMC0xOS44OC0xNi4xMi0zNi0zNi0zNgoJCQljLTcuOTgsMC0xNS4zNCwyLjYtMjEuMzEsNi45OWwxMi40NCwxMy44MmMyLjY0LTEuNTQsNS43LTIuNDMsOC45OC0yLjQzQzYzLjg1LDM4LjM4LDcwLjQ1LDQzLjMsNzIuOTQsNTAuMTgiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K';
const qrCode = ref(null);
const qrCodeCanvas = ref(null);

// watch
watch(
  () => props.data,
  val => {
    if (val && val !== '') {
      generateQRCode();
    }
  }
);

// onMounted
onMounted(() => {
  generateQRCode();
});

// onBeforeUnmount
onBeforeUnmount(() => {
  qrCode.value = null;
});

// methods
const generateQRCode = () => {
  qrCode.value = new QrCodeWithLogo({
    canvas: qrCodeCanvas.value,
    content: props.data,
    width: props.width,
    logo: {
      borderRadius: 100,
      logoSize: 0.23,
      borderSize: 0,
      src: mewIcon
    }
  });
  qrCode.value.toCanvas();
};
</script>
