<template>
  <div class="mobile-menu-content">
    <div class="menu-content-header">
      <i class="fa fa-angle-left" aria-hidden="true" @click="closeMenu"></i>
    </div>
    <div class="content-block">
      <mobile-balance-block class="mb-2" />
      <mobile-network-block :block-number="blockNumber" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MobileBalanceBlock from '../MobileBalanceBlock';
import MobileNetworkBlock from '../MobileNetworkBlock';

export default {
  components: {
    'mobile-balance-block': MobileBalanceBlock,
    'mobile-network-block': MobileNetworkBlock
  },
  props: {
    closeMenu: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(['blockNumber'])
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MobileMenuContent.scss';
</style>
