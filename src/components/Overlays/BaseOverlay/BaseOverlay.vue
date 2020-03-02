<template>
  <v-overlay :color="backgroundColor" opacity="1" :value="open" z-index="100">
    <slot />
  </v-overlay>
</template>

<script>
import Var from '@/variables.js';

export default {
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      backgroundColor: Var.colorSets.lightMint
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
.v-overlay {
  border-radius: 0;
}
</style>
