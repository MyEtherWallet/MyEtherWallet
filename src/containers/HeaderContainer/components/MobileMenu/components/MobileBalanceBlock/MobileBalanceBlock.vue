<template>
  <div class="mobile-address-block">
    <interface-balance-modal ref="balanceModal" />
    <div class="wrap">
      <div class="top-block">
        <div class="block-title">
          Balance
        </div>
        <button class="show-balance-button" @click="showBalanceModal">
          <img src="~@/assets/images/icons/more.svg" />
        </button>
      </div>
      <div class="bottom-block">
        <p class="the-address">4000.340000 ETH</p>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBalanceModal from '@/layouts/InterfaceLayout/components/InterfaceBalanceModal';

export default {
  name: 'MobileBalanceBlock',
  components: {
    'interface-balance-modal': InterfaceBalanceModal
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    showBalanceModal() {
      this.$refs.balanceModal.$refs.balance.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileBalanceBlock.scss';
</style>
