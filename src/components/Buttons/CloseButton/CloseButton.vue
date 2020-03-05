<template>
  <v-btn text :color="red" class="text-transform--initial body-2">
    <v-icon class="mr-1">mdi-close-circle-outline</v-icon>{{ text }}
  </v-btn>
</template>

<script>
import Var from '@/plugins/variables.js';
export default {
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {
      red: Var.colorSets.red.red1
    };
  }
};
</script>
