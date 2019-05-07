<template>
  <div class="sign-message-container">
    <swap-widget
      ref="swapWidget"
      :supplied-from="suppliedFrom"
      :supplied-to="suppliedTo"
      :supplied-to-amount="suppliedToAmount"
      :dest-address="destAddress"
    ></swap-widget>
    <button @click="openSwapWidget">OPEN</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SwapWidget from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapWidget';

export default {
  name: 'DevContainer',
  components: {
    'swap-widget': SwapWidget
  },
  data() {
    return {
      suppliedFrom: {
        name: 'Ethereum',
        symbol: 'ETH'
      },
      suppliedTo: {
        name: 'AdEx',
        symbol: 'ADX'
      },
      suppliedToAmount: 5,
      destAddress: '0x7676E10eefc7311970A12387518442136ea14D81',
      message: '',
      signature: ''
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      web3: 'web3'
    })
  },
  methods: {
    openSwapWidget() {
      this.$refs.swapWidget.$refs.modal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DevContainer';
</style>
