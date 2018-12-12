<template>
  <div class="info-block-network">
    <div class="block-wrap">
      <div class="block-header">
        <p class="block-title">Network</p>
        <div class="icons"><img :src="imgChng" /></div>
        <!-- .icons -->
      </div>
      <!-- .block-header -->
      <div class="block-content">
        <p>myetherapi.com(ETH)</p>
        <p>Last Block#: 5699679</p>
      </div>
      <!-- .block-content -->
    </div>
    <!-- .block-wrap -->
  </div>
  <!-- .info-block-address -->
</template>

<script>
import ImageChange from '@/assets/images/icons/change.svg';

export default {
  components: {},
  data() {
    return {
      imgChng: ImageChange
    };
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'InfoBlockNetwork.scss';
</style>
