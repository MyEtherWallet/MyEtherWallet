<template>
  <div class="button-nft-manager">
    <div class="content-container">
      <img v-if="!disabled" :src="kitties" class="kitties" />
      <img v-if="disabled" :src="kitties" class="kitties" />
      <p>NFT Manager</p>
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
