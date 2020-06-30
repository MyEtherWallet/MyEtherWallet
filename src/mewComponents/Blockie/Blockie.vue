<template>
  <div>
    <div
      ref="identicon"
      class="address-identicon"
    />
    <!-- will add currency icon after I get svg files -->
    <!-- <img
      alt="icon"
      class="currency-icon"
      src="@/assets/images/icons/footer/eth.png"
    > -->
  </div>
</template>
<script>
import Blockies from '@/helpers/blockies.js';
export default {
  name: 'Blockie',
  props: {
    /**
     * Currency type
     */
    currency: {
      type: String,
      default: ''
    },
    /**
     * Valid address
     */
    address: {
      type: String,
      default: ''
    },
    /**
     * Blockie width
     */
    width: {
      type: String,
      default: '64px'
    },
    /**
     * Blockie height
     */
    height: {
      type: String,
      default: '64px'
    },
    /**
     * Blockie size
     */
    size: {
      type: Number,
      default: 8
    },
    /**
     * Blockie scale
     */
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
        seed: this.address ? this.address.toLowerCase() : '',
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
  box-shadow: inset rgba(255, 255, 255, 0.25) 0 2px 2px,
    inset rgba(0, 0, 0, 0.6) 0 -1px 8px;
  height: 100%;
  width: 100%;
}
</style>
