<template>
  <v-btn fab x-small dark depressed color="royal_blue" class="solo-button">
    <slot />
  </v-btn>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.solo-button {
  border-radius: 5px;
  height: 25px;
  width: 25px;
}
</style>
