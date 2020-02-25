<template>
  <v-btn text small :color="mewGreen">
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
</style>
