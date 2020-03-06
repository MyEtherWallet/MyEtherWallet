<template>
  <v-btn text small :color="mewGreen" class="text-transform--initial body-2">
    <slot />
  </v-btn>
</template>

<script>
import Var from '@/common/plugins/variables.js';
export default {
  props: {},
  data() {
    return {
      mewGreen: Var.colorSets.emerald
    };
  }
};
</script>
