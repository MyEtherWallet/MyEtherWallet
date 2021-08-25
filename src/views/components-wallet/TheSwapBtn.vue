<template>
  <v-btn class="mew-component--swap-btn" color="maxButton" depressed>
    <v-icon large>mdi-swap-horizontal</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'SwapBtn',
  props: {},
  data: () => ({})
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
