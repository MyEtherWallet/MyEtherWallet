<template>
  <div class="buy-eth-ad">
    <div class="content-block">
      <div class="flex-vertical-center">
        <div class="top-block">{{ $t('interface.ads.buy-with-credit') }}</div>
        <div class="bottom-block">
          <standard-button
            :options="{
              title: $t('accessWallet.hardware.modal.button-buy'),
              buttonStyle: 'green-border',
              helpCenter: false,
              noMinWidth: true,
              fullWidth: true,
              paddingSmall: true
            }"
            :click-function="showSwapWidget"
          />
          <img alt class="cc-cards" src="@/assets/images/etc/visamaster.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {},
  data() {
    return {
      showWidget: false,
      suppliedFromAmount: 100,
      suppliedTo: {
        symbol: 'ETH',
        name: ''
      },
      suppliedFrom: {
        symbol: 'USD',
        name: ''
      }
    };
  },
  computed: {
    ...mapState(['account', 'network', 'web3', 'online'])
  },
  watch: {},
  mounted() {},
  methods: {
    showSwapWidget() {
      if (this.online) {
        this.$eventHub.$emit(
          'showSwapWidgetTo',
          this.account.address,
          'USD',
          'ETH',
          1
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'buyEthAd.scss';
</style>
