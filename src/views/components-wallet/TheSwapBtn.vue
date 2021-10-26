<template>
  <v-btn class="mew-component--swap-btn" color="maxButton" depressed>
    <img :src="swapIcon" height="25" />
  </v-btn>
</template>

<script>
import SwapIcon from '@/assets/images/icons/icon-swap.svg';

export default {
  name: 'SwapBtn',
  props: {},
  data: () => ({ swapIcon: SwapIcon })
};
</script>

<style lang="scss" scoped>
.mew-component--swap-btn {
  height: 50px !important;
  padding: 0px 0px !important;
  min-width: 50px !important;
  border-radius: 10px !important;
}
</style>
