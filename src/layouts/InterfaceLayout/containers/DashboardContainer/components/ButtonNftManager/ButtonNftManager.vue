<template>
  <div class="button-nft-manager">
    <div :class="disabled ? 'button-disabled' : ''" class="content-container">
      <img :src="kitties" class="kitties" alt="kitties" />
      <div class="text-content">
        <p class="title">NFT<br />Manager</p>
        <p v-if="disabled" class="button-disabled">
          This function is not available.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoKitties from '@/assets/images/buttons/nft-manager/crypto-kitties.png';

export default {
  name: 'ButtonNftManager',
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      kitties: CryptoKitties
    };
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import 'ButtonNftManager.scss';
</style>
