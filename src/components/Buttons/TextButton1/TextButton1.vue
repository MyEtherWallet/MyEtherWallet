<template>
  <v-btn
    text
    :small="size == 'small' && size != 'normal'"
    :large="size == 'large'"
    :color="textColor"
    class="text-transform--initial body-2"
  >
    <slot />
  </v-btn>
</template>

<script>
import Var from '@/variables.js';
export default {
  props: {
    type: { default: '', type: String },
    size: { default: 'small', type: String }
  },
  data() {
    return {
      mewGreen: Var.colorSets.emerald,
      red: Var.colorSets.red.red1
    };
  },
  computed: {
    textColor() {
      switch (this.type) {
        case 'close':
          return this.red;
        default:
          return this.mewGreen;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
</style>
