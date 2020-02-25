<template>
  <v-btn fab x-small dark depressed :color="mewGreen" class="solo-button">
    <slot />
  </v-btn>
</template>

<script>
import Var from '@/variables.js';
export default {
  props: {
    buttonclass: { default: 'button--green', type: String }
  },
  data() {
    return {
      mewGreen: Var.colorSets.emerald
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
.solo-button {
  border-radius: 7px;
  height: 25px;
  min-width: 25px;
}
</style>
