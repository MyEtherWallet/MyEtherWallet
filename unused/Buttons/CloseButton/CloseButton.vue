<template>
  <v-btn text color="red" class="text-transform--initial body-2" height="50px">
    <v-icon class="mr-1 display-1">mdi-close-circle-outline</v-icon>{{ text }}
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
