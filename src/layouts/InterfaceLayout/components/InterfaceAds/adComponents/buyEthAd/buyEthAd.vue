<template>
  <div class="buy-eth-ad">
    <div class="content-block">
      <div class="flex-vertical-center">
        <div class="top-block">{{ $t('interface.ads.buy-with-credit') }}</div>
        <div class="bottom-block">
          <standard-button
            :options="sendButton"
            @click.native="showSwapWidget"
          />
          <img alt class="cc-cards" src="@/assets/images/etc/visamaster.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SwapWidget from '@/components/SwapWidget';

export default {
  components: {
    'swap-widget': SwapWidget
  },
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
      },
      sendButton: {
        title: `${this.$t('accessWallet.hardware.modal.button-buy')}`,
        buttonStyle: 'green-border',
        helpCenter: false,
        noMinWidth: true,
        fullWidth: true,
        paddingSmall: true
      }
    };
  },
  computed: {
    ...mapState({
      account: 'main/account',
      network: 'main/network',
      web3: 'main/web3',
      online: 'main/online'
    })
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
