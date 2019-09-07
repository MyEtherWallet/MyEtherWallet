<template lang="html">
  <div ref="identicon" class="address-identicon" />
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
      const data = Blockies({
        seed: this.address.toLowerCase(),
        size: this.size,
        scale: this.scale
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
