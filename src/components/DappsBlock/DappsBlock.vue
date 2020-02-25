<template>
  <v-card class="mx-auto" max-width="344" outlined>
    aaaaaa
  </v-card>
</template>

<script>
import Var from '@/variables.js';

export default {
  topButtonColor: Var.colorSets.royalBlue,

  props: {
    buttonclass: { default: 'button--green', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
</style>
