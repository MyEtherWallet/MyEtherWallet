<template>
  <v-btn text color="black" class="text-transform--initial body-2">
    <v-icon class="mr-1 display-1">mdi-arrow-left-circle-outline</v-icon
    >{{ text }}
  </v-btn>
</template>

<script>
export default {
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>
