<template>
  <v-btn fab x-small dark depressed :color="buttonColor" class="solo-button">
    <slot />
  </v-btn>
</template>

<script>
import Var from '@/common/plugins/variables.js';
export default {
  props: {
    buttonclass: { default: 'button--green', type: String }
  },
  data() {
    return {
      buttonColor: Var.colorSets.royalBlue
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
.solo-button {
  border-radius: 5px;
  height: 25px;
  min-width: 25px;
}
</style>
