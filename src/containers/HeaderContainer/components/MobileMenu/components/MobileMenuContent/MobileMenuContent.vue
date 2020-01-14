<template>
  <div class="mobile-menu-content">
    <div class="menu-content-header">
      <i class="fa fa-times" aria-hidden="true" @click="closeMenu"></i>
    </div>
    <div class="content-block">
      <mobile-balance-block class="mb-2" />
      <mobile-network-block :block-number="blockNumber" />
      <interface-mobile-menu />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceMobileMenu from '@/layouts/InterfaceLayout/components/InterfaceMobileMenuComponent';
import MobileBalanceBlock from '../MobileBalanceBlock';
import MobileNetworkBlock from '../MobileNetworkBlock';

export default {
  components: {
    'interface-mobile-menu': InterfaceMobileMenu,
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
