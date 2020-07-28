<template lang="html">
  <div class="position--relative">
    <div ref="identicon" class="address-identicon" />
    <div class="currency">
      <img src="@/assets/images/currencies/icon-eth-blue.svg" alt="currency" />
    </div>
  </div>
</template>

<script>
import { Blockies } from '@/common/helpers';

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
    },
    currency: {
      type: String,
      default: 'eth'
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
.address-identicon {
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  border: 3px solid white;
}

.currency {
  border: 1px solid white;
  border-radius: 100%;
  position: absolute;
  height: 18px;
  width: 18px;
  bottom: -2px;
  right: -2px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
