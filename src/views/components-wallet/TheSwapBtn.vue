<template>
  <v-btn class="mew-component--swap-btn" color="greyLight" depressed>
    <v-icon color="textMedium">mdi-swap-horizontal</v-icon>
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
  height: 40px !important;
  padding: 0px 0px !important;
  min-width: 40px !important;
  border-radius: 10px !important;
}
</style>
