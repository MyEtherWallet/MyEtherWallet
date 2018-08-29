<template lang="html">
  <div
    ref="identicon"
    class="address-identicon"/>
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
      default: '32'
    },
    height: {
      type: String,
      default: '32'
    }
  },
  data() {
    return {};
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
    }
  },
  mounted() {
    this.setBlockie();
  },
  methods: {
    setBlockie() {
      const data = Blockies({
        seed: this.address.toLowerCase(),
        size: 8,
        scale: 16
      }).toDataURL();
      this.$refs.identicon.style.width = this.width;
      this.$refs.identicon.style.height = this.height;
      this.$refs.identicon.style.backgroundImage = `url('${data}')`;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'Blockie.scss';
</style>
