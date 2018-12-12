<template>
  <div class="info-block-balance">
    <div class="block-wrap">
      <div class="block-header">
        <p class="block-title">Balance</p>
        <div class="icons"><img :src="imgMore" /></div>
        <!-- .icons -->
      </div>
      <!-- .block-header -->
      <div class="block-content"><p>7130.0000000 ETH</p></div>
      <!-- .block-content -->
    </div>
    <!-- .block-wrap -->
  </div>
  <!-- .info-block-address -->
</template>

<script>
import ImageMore from '@/assets/images/icons/more.svg';
import Blockie from '@/components/Blockie';

export default {
  components: {
    blockie: Blockie
  },
  data() {
    return {
      imgMore: ImageMore
    };
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'InfoBlockBalance.scss';
</style>
