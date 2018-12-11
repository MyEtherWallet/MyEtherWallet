<template>
  <div class="info-block-address">
    <div class="block-wrap">
      <div class="block-header">
        <p class="block-title">Address</p>
        <div class="icons">
          <img :src="imgPrt" /><img :src="imgCpy" /><img :src="imgChange" />
        </div>
        <!-- .icons -->
      </div>
      <!-- .block-header -->
      <div class="block-content">
        <div class="block-content-left">
          <p>0x8DF56e9D5d62FF8046f8A55c21AbF26C7A8F18A2</p>
        </div>
        <div class="block-content-right">
          <blockie
            address="0x8DF56e9D5d62FF8046f8A55c21AbF26C7A8F18A2"
            width="35px"
            height="35px"
          />
        </div>
      </div>
      <!-- .block-content -->
    </div>
    <!-- .block-wrap -->
  </div>
  <!-- .info-block-address -->
</template>

<script>
import ImagePrinter from '@/assets/images/icons/printer-white.svg';
import ImageCopy from '@/assets/images/icons/copy.svg';
import ImageChange from '@/assets/images/icons/change.svg';
import Blockie from '@/components/Blockie';

export default {
  components: {
    blockie: Blockie
  },
  data() {
    return {
      imgPrt: ImagePrinter,
      imgCpy: ImageCopy,
      imgChange: ImageChange
    };
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'InfoBlockAddress.scss';
</style>
