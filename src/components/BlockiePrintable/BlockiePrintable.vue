<template lang="html">
  <div v-if="blockieImage" ref="identicon" class="address-identicon">
    <img :src="blockieImage" alt="Address identicon" />
  </div>
</template>
<script>
import { Blockies } from '@/helpers';
export default {
  props: {
    address: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '64px'
    },
    height: {
      type: String,
      default: '64px'
    },
    size: {
      type: Number,
      default: 8
    },
    scale: {
      type: Number,
      default: 16
    }
  },
  data() {
    return {
      blockieImage: undefined
    };
  },
  watch: {
    address() {
      this.setBlockie();
    },
    width() {
      this.setBlockie();
    },
    height() {
      this.setBlockie();
    },
    scale() {
      this.setBlockie();
    },
    size() {
      this.setBlockie();
    }
  },
  mounted() {
    this.setBlockie();
  },
  methods: {
    setBlockie() {
      this.blockieImage = Blockies({
        seed: this.address ? this.address.toLowerCase() : '',
        size: 8,
        scale: 16
      }).toDataURL();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'BlockiePrintable.scss';
</style>
