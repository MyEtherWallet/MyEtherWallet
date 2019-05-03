<template>
  <div class="sign-message-container">
    <swap-widget ref="swapWidget"></swap-widget>
    <button @click="openSwapWidget">OPEN</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SwapWidget from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapWidget';


export default {
  name: 'DevContainer',
  components: {
    'swap-widget': SwapWidget,
  },
  data() {
    return {
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
