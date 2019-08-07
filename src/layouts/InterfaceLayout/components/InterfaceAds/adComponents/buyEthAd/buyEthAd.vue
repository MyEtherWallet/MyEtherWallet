<template>
  <div>
    <div class="bottom-image-container">
      <div class="content">
        <div class="buy-text">
          <p>Buy ETH with Credit Card</p>
        </div>
        <div class="send-button-container">
          <standard-button
            :options="sendButton"
            @click.native="showSwapWidget"
          />
        </div>
        <img class="cc-cards" src="@/assets/images/etc/visamaster.png" />
        <img class="background-eth" src="@/assets/images/ads/eth.png" />
      </div>
    </div>
    <div v-if="showWidget">
<!--      <swap-widget-->
<!--        ref="swapWidget"-->
<!--        :supplied-from="suppliedFrom"-->
<!--        :supplied-to="suppliedTo"-->
<!--        :supplied-from-amount="suppliedFromAmount"-->
<!--        :dest-address="account.address"-->
<!--      ></swap-widget>-->
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
        title: 'Buy Now',
        buttonStyle: 'green-border',
        helpCenter: false,
        noMinWidth: true,
        fullWidth: true
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
        // this.$emit('pauseAds');
        this.showWidget = true;
        const vals = { from: 'USD', to: 'ETH', amt: 100, rate: 0 };
        // this.suppliedFromAmount = vals.amt;
        // this.suppliedFrom = {
        //   symbol: vals.from,
        //   name: ''
        // };
        // this.suppliedTo = {
        //   symbol: vals.to,
        //   name: ''
        // };
        this.$eventHub.$emit('showSwapWidgetTo', this.account.address, 'USD', 'ETH', 1)
        //
        // this.$nextTick(() => {
        //   // showSwapWidget
        //   // this.$refs.swapWidget.$refs.modal.show();
        // });
        // this.$nextTick(() => {
        //   this.$refs.swapWidget.$refs.modal.$on('hidden', () => {
        //     // this.$emit('pauseAds');
        //   });
        //   this.$refs.swapWidget.$refs.modal.show();
        // });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'buyEthAd.scss';
</style>
