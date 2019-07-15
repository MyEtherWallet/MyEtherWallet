<template>
  <div>
    <div class="bottom-image-container">
      <a
        rel="noopener noreferrer"
        href="https://mewconnect.myetherwallet.com/#/"
        target="_blank"
      >
        <img class="icon" src="~@/assets/images/ads/buyEth.png" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(['network', 'web3', 'online'])
  },
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'buyEthAd.scss';
</style>
